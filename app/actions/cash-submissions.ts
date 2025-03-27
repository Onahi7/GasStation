"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { CashSubmissionSchema } from "@/lib/types"
import { withErrorHandling } from "@/lib/utils"
import { AuditLogger } from "@/lib/audit-logger"

export async function submitCash(formData: FormData) {
  return withErrorHandling(
    async () => {
      const supabase = getSupabaseServerClient()

      const terminalId = formData.get("terminalId") as string
      const userId = formData.get("userId") as string
      const shiftId = formData.get("shiftId") as string
      const amount = parseFloat(formData.get("amount") as string)
      const notes = formData.get("notes") as string

      // Get active shift to validate
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

      const submissionData = {
        terminal_id: terminalId,
        user_id: userId,
        shift_id: shiftId,
        amount,
        submission_time: new Date().toISOString(),
        verification_status: "pending",
        notes,
      }

      // Validate submission data
      CashSubmissionSchema.parse(submissionData)

      const { data: submission, error } = await supabase
        .from("cash_submissions")
        .insert(submissionData)
        .select()
        .single()

      if (error) throw error

      // Log audit entry
      await AuditLogger.log(
        "create",
        "cash_submissions",
        submission.id,
        userId,
        { amount, shiftId }
      )

      revalidatePath("/worker")
      return submission
    },
    {
      validation: CashSubmissionSchema,
      data: formData,
    }
  )
}

export async function verifyCashSubmission(formData: FormData) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()

    const submissionId = formData.get("submissionId") as string
    const userId = formData.get("userId") as string
    const status = formData.get("status") as "verified" | "discrepancy"
    const notes = formData.get("notes") as string

    // Get submission to validate
    const { data: submission, error: submissionError } = await supabase
      .from("cash_submissions")
      .select("*")
      .eq("id", submissionId)
      .eq("verification_status", "pending")
      .single()

    if (submissionError || !submission) {
      throw new Error("Pending cash submission not found")
    }

    const { error: updateError } = await supabase
      .from("cash_submissions")
      .update({
        verification_status: status,
        received_by: userId,
        notes: notes || submission.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", submissionId)

    if (updateError) throw updateError

    // Log audit entry
    await AuditLogger.log(
      "update",
      "cash_submissions",
      submissionId,
      userId,
      { status, notes }
    )

    revalidatePath("/cashier/submissions")
    return { status }
  })
}

export async function getCashSubmissions(options: {
  userId?: string
  shiftId?: string
  status?: "pending" | "verified" | "discrepancy"
  startDate?: Date
  endDate?: Date
}) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()
    const { userId, shiftId, status, startDate, endDate } = options

    let query = supabase
      .from("cash_submissions")
      .select(`
        *,
        user:users!user_id(full_name),
        receiver:users!received_by(full_name),
        shift:shifts(start_time, end_time)
      `)
      .order("submission_time", { ascending: false })

    if (userId) {
      query = query.eq("user_id", userId)
    }
    if (shiftId) {
      query = query.eq("shift_id", shiftId)
    }
    if (status) {
      query = query.eq("verification_status", status)
    }
    if (startDate) {
      query = query.gte("submission_time", startDate.toISOString())
    }
    if (endDate) {
      query = query.lte("submission_time", endDate.toISOString())
    }

    const { data, error } = await query
    if (error) throw error

    return data
  })
}

export async function getShiftSubmissions(shiftId: string) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()

    // Get shift details first
    const { data: shift, error: shiftError } = await supabase
      .from("shifts")
      .select(`
        *,
        user:users(full_name),
        meter_readings(
          opening_reading,
          closing_reading,
          liters_sold,
          expected_amount
        ),
        cash_submissions(
          amount,
          verification_status
        ),
        electronic_payments(
          amount,
          payment_method,
          verification_status
        )
      `)
      .eq("id", shiftId)
      .single()

    if (shiftError || !shift) {
      throw new Error("Shift not found")
    }

    // Calculate totals
    const totalExpectedCash = shift.meter_readings.reduce((total, reading) => 
      total + (reading.expected_amount || 0), 0)
    
    const totalSubmittedCash = shift.cash_submissions.reduce((total, submission) => 
      total + submission.amount, 0)
    
    const totalElectronicPayments = shift.electronic_payments.reduce((total, payment) => 
      total + payment.amount, 0)

    const cashVariance = totalSubmittedCash - totalExpectedCash

    return {
      shift,
      totals: {
        expectedCash: totalExpectedCash,
        submittedCash: totalSubmittedCash,
        electronicPayments: totalElectronicPayments,
        totalCollected: totalSubmittedCash + totalElectronicPayments,
        cashVariance,
      }
    }
  })
}

