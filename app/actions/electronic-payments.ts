"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ElectronicPaymentSchema } from "@/lib/types"
import { withErrorHandling } from "@/lib/utils"
import { AuditLogger } from "@/lib/audit-logger"

export async function recordElectronicPayment(formData: FormData) {
  return withErrorHandling(
    async () => {
      const supabase = getSupabaseServerClient()

      const terminalId = formData.get("terminalId") as string
      const userId = formData.get("userId") as string
      const shiftId = formData.get("shiftId") as string
      const amount = parseFloat(formData.get("amount") as string)
      const paymentMethod = formData.get("paymentMethod") as string
      const referenceNumber = formData.get("referenceNumber") as string
      const notes = formData.get("notes") as string

      // Validate active shift
      const { data: activeShift } = await supabase
        .from("shifts")
        .select("id")
        .eq("id", shiftId)
        .eq("user_id", userId)
        .eq("status", "active")
        .single()

      if (!activeShift) {
        throw new Error("No active shift found")
      }

      // Check if reference number is unique
      if (referenceNumber) {
        const { data: existingPayment } = await supabase
          .from("electronic_payments")
          .select("id")
          .eq("reference_number", referenceNumber)
          .maybeSingle()

        if (existingPayment) {
          throw new Error("Payment with this reference number already exists")
        }
      }

      const paymentData = {
        terminal_id: terminalId,
        user_id: userId,
        shift_id: shiftId,
        amount,
        payment_method: paymentMethod,
        reference_number: referenceNumber,
        payment_time: new Date().toISOString(),
        verification_status: "pending",
        notes,
      }

      // Validate payment data
      ElectronicPaymentSchema.parse(paymentData)

      const { data: payment, error } = await supabase
        .from("electronic_payments")
        .insert(paymentData)
        .select()
        .single()

      if (error) throw error

      // Log audit entry
      await AuditLogger.log(
        "create",
        "electronic_payments",
        payment.id,
        userId,
        {
          amount,
          paymentMethod,
          referenceNumber,
          shiftId
        }
      )

      revalidatePath("/worker")
      return payment
    },
    {
      validation: ElectronicPaymentSchema,
      data: formData,
    }
  )
}

export async function verifyElectronicPayment(formData: FormData) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()

    const paymentId = formData.get("paymentId") as string
    const userId = formData.get("userId") as string
    const status = formData.get("status") as "verified" | "rejected"
    const notes = formData.get("notes") as string

    // Get payment to validate
    const { data: payment, error: paymentError } = await supabase
      .from("electronic_payments")
      .select("*")
      .eq("id", paymentId)
      .eq("verification_status", "pending")
      .single()

    if (paymentError || !payment) {
      throw new Error("Pending electronic payment not found")
    }

    const { error: updateError } = await supabase
      .from("electronic_payments")
      .update({
        verification_status: status,
        notes: notes || payment.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", paymentId)

    if (updateError) throw updateError

    // Log audit entry
    await AuditLogger.log(
      "update",
      "electronic_payments",
      paymentId,
      userId,
      { status, notes }
    )

    revalidatePath("/cashier/payments")
    return { status }
  })
}

export async function getElectronicPayments(options: {
  terminalId?: string
  userId?: string
  shiftId?: string
  status?: "pending" | "verified" | "rejected"
  paymentMethod?: "pos" | "transfer" | "other"
  startDate?: Date
  endDate?: Date
}) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()
    const { terminalId, userId, shiftId, status, paymentMethod, startDate, endDate } = options

    let query = supabase
      .from("electronic_payments")
      .select(`
        *,
        user:users(full_name),
        shift:shifts(start_time, end_time)
      `)
      .order("payment_time", { ascending: false })

    if (terminalId) {
      query = query.eq("terminal_id", terminalId)
    }
    if (userId) {
      query = query.eq("user_id", userId)
    }
    if (shiftId) {
      query = query.eq("shift_id", shiftId)
    }
    if (status) {
      query = query.eq("verification_status", status)
    }
    if (paymentMethod) {
      query = query.eq("payment_method", paymentMethod)
    }
    if (startDate) {
      query = query.gte("payment_time", startDate.toISOString())
    }
    if (endDate) {
      query = query.lte("payment_time", endDate.toISOString())
    }

    const { data, error } = await query
    if (error) throw error

    return data
  })
}

export async function getPaymentSummary(paymentId: string) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()

    const { data: payment, error } = await supabase
      .from("electronic_payments")
      .select(`
        *,
        user:users(full_name),
        shift:shifts(start_time, end_time),
        terminal:terminals(name)
      `)
      .eq("id", paymentId)
      .single()

    if (error) throw error

    // Get other payments with the same reference number
    let relatedPayments = []
    if (payment.reference_number) {
      const { data: related } = await supabase
        .from("electronic_payments")
        .select("*")
        .eq("reference_number", payment.reference_number)
        .neq("id", paymentId)

      relatedPayments = related || []
    }

    return {
      payment,
      relatedPayments,
    }
  })
}

export async function getDailyElectronicPaymentSummary(terminalId: string, date: Date) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()
    
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
      .from("electronic_payments")
      .select(`
        payment_method,
        verification_status,
        count(*),
        sum(amount)
      `)
      .eq("terminal_id", terminalId)
      .gte("payment_time", startOfDay.toISOString())
      .lte("payment_time", endOfDay.toISOString())
      .groupBy("payment_method, verification_status")

    if (error) throw error

    const summary = {
      pos: {
        pending: { count: 0, amount: 0 },
        verified: { count: 0, amount: 0 },
        rejected: { count: 0, amount: 0 },
      },
      transfer: {
        pending: { count: 0, amount: 0 },
        verified: { count: 0, amount: 0 },
        rejected: { count: 0, amount: 0 },
      },
      other: {
        pending: { count: 0, amount: 0 },
        verified: { count: 0, amount: 0 },
        rejected: { count: 0, amount: 0 },
      },
    }

    data?.forEach((row: any) => {
      summary[row.payment_method][row.verification_status] = {
        count: parseInt(row.count),
        amount: parseFloat(row.sum),
      }
    })

    return summary
  })
}

