"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { CashHandoverSchema } from "@/lib/types"
import { withErrorHandling } from "@/lib/utils"
import { AuditLogger } from "@/lib/audit-logger"

export async function getDailyCashHandovers(date?: string, terminalId?: string) {
  const supabase = getSupabaseServerClient()

  let query = supabase
    .from("daily_cash_handovers")
    .select(`
      *,
      cashier:users!cashier_id(id, full_name),
      manager:users!manager_id(id, full_name)
    `)
    .order("handover_time", { ascending: false })

  if (date) {
    query = query.eq("handover_date", date)
  }

  if (terminalId) {
    query = query.eq("terminal_id", terminalId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Error fetching daily cash handovers: ${error.message}`)
  }

  return data
}

export async function getDailyCashHandoverById(id: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("daily_cash_handovers")
    .select(`
      *,
      cashier:users!cashier_id(id, full_name),
      manager:users!manager_id(id, full_name)
    `)
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(`Error fetching daily cash handover: ${error.message}`)
  }

  return data
}

export async function createDailyCashHandover(formData: FormData) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Get the user's terminal and role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("terminal_id, role")
    .eq("id", user.id)
    .single()

  if (userError || !userData?.terminal_id) {
    throw new Error("User not assigned to a terminal")
  }

  // Only cashiers can create cash handovers
  if (userData.role !== "cashier") {
    throw new Error("Unauthorized: Only cashiers can create cash handovers")
  }

  const totalCashCollected = Number.parseFloat(formData.get("total_cash_collected") as string)
  const totalExpenses = Number.parseFloat(formData.get("total_expenses") as string)
  const netCashHandedOver = Number.parseFloat(formData.get("net_cash_handed_over") as string)
  const expectedAmount = Number.parseFloat((formData.get("expected_amount") as string) || "0")
  const notes = (formData.get("notes") as string) || null

  // Calculate discrepancy
  const discrepancy = expectedAmount > 0 ? netCashHandedOver - expectedAmount : null

  // Validate the amounts
  if (isNaN(totalCashCollected) || totalCashCollected < 0) {
    throw new Error("Invalid total cash collected amount")
  }

  if (isNaN(totalExpenses) || totalExpenses < 0) {
    throw new Error("Invalid total expenses amount")
  }

  if (isNaN(netCashHandedOver) || netCashHandedOver < 0) {
    throw new Error("Invalid net cash handed over amount")
  }

  // Validate that net cash = total cash - expenses
  if (Math.abs(netCashHandedOver - (totalCashCollected - totalExpenses)) > 0.01) {
    throw new Error("Net cash handed over must equal total cash collected minus total expenses")
  }

  // Create the daily cash handover
  const { data, error } = await supabase
    .from("daily_cash_handovers")
    .insert({
      terminal_id: userData.terminal_id,
      cashier_id: user.id,
      handover_date: new Date().toISOString().split("T")[0],
      total_cash_collected: totalCashCollected,
      total_expenses: totalExpenses,
      net_cash_handed_over: netCashHandedOver,
      expected_amount: expectedAmount > 0 ? expectedAmount : null,
      discrepancy,
      notes,
      status: "pending",
      handover_time: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating daily cash handover: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    terminal_id: userData.terminal_id,
    user_id: user.id,
    action: "create",
    entity_type: "daily_cash_handovers",
    entity_id: data.id,
    details: {
      total_cash_collected: totalCashCollected,
      total_expenses: totalExpenses,
      net_cash_handed_over: netCashHandedOver,
      expected_amount: expectedAmount > 0 ? expectedAmount : null,
      discrepancy,
    },
  })

  revalidatePath("/cashier")
  redirect("/cashier")
}

export async function verifyDailyCashHandover(id: string, formData: FormData) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Get the user's terminal and role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("terminal_id, role")
    .eq("id", user.id)
    .single()

  if (userError || !userData?.terminal_id) {
    throw new Error("User not assigned to a terminal")
  }

  // Only managers and finance staff can verify cash handovers
  if (userData.role !== "manager" && userData.role !== "finance") {
    throw new Error("Unauthorized: Only managers and finance staff can verify cash handovers")
  }

  const notes = (formData.get("notes") as string) || null

  // Update the cash handover
  const { data, error } = await supabase
    .from("daily_cash_handovers")
    .update({
      manager_id: user.id,
      status: "verified",
      notes: notes ? `${notes} (Verified by ${user.email})` : `Verified by ${user.email}`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("terminal_id", userData.terminal_id)
    .eq("status", "pending")
    .select()
    .single()

  if (error) {
    throw new Error(`Error verifying cash handover: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    terminal_id: userData.terminal_id,
    user_id: user.id,
    action: "verify",
    entity_type: "daily_cash_handovers",
    entity_id: data.id,
  })

  revalidatePath("/finance")
  redirect("/finance")
}

export async function disputeDailyCashHandover(id: string, formData: FormData) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Get the user's terminal and role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("terminal_id, role")
    .eq("id", user.id)
    .single()

  if (userError || !userData?.terminal_id) {
    throw new Error("User not assigned to a terminal")
  }

  // Only managers and finance staff can dispute cash handovers
  if (userData.role !== "manager" && userData.role !== "finance") {
    throw new Error("Unauthorized: Only managers and finance staff can dispute cash handovers")
  }

  const reason = formData.get("reason") as string

  if (!reason) {
    throw new Error("Dispute reason is required")
  }

  // Update the cash handover
  const { data, error } = await supabase
    .from("daily_cash_handovers")
    .update({
      manager_id: user.id,
      status: "disputed",
      notes: `Disputed: ${reason} (by ${user.email})`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("terminal_id", userData.terminal_id)
    .eq("status", "pending")
    .select()
    .single()

  if (error) {
    throw new Error(`Error disputing cash handover: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    terminal_id: userData.terminal_id,
    user_id: user.id,
    action: "dispute",
    entity_type: "daily_cash_handovers",
    entity_id: data.id,
    details: { reason },
  })

  revalidatePath("/finance")
  redirect("/finance")
}

export async function createCashHandover(formData: FormData) {
  return withErrorHandling(
    async () => {
      const supabase = getSupabaseServerClient()

      const terminalId = formData.get("terminalId") as string
      const fromUserId = formData.get("fromUserId") as string
      const toUserId = formData.get("toUserId") as string
      const amount = parseFloat(formData.get("amount") as string)
      const notes = formData.get("notes") as string

      // Validate the users are different
      if (fromUserId === toUserId) {
        throw new Error("Cannot hand over cash to yourself")
      }

      // Get all pending submissions from the outgoing user
      const { data: pendingSubmissions } = await supabase
        .from("cash_submissions")
        .select("amount")
        .eq("user_id", fromUserId)
        .eq("terminal_id", terminalId)
        .eq("verification_status", "pending")

      const totalPendingAmount = (pendingSubmissions || []).reduce(
        (sum, submission) => sum + submission.amount,
        0
      )

      if (totalPendingAmount > 0) {
        throw new Error(`Cannot perform handover with ${totalPendingAmount} in pending submissions`)
      }

      const handoverData = {
        terminal_id: terminalId,
        from_user_id: fromUserId,
        to_user_id: toUserId,
        amount,
        handover_time: new Date().toISOString(),
        verification_status: "pending",
        notes,
      }

      // Validate handover data
      CashHandoverSchema.parse(handoverData)

      const { data: handover, error } = await supabase
        .from("cash_handovers")
        .insert(handoverData)
        .select()
        .single()

      if (error) throw error

      // Log audit entry
      await AuditLogger.log(
        "create",
        "cash_handovers",
        handover.id,
        fromUserId,
        { 
          toUserId,
          amount,
          terminalId 
        }
      )

      revalidatePath("/worker")
      return handover
    },
    {
      validation: CashHandoverSchema,
      data: formData,
    }
  )
}

export async function verifyCashHandover(formData: FormData) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()

    const handoverId = formData.get("handoverId") as string
    const userId = formData.get("userId") as string
    const status = formData.get("status") as "verified" | "discrepancy"
    const notes = formData.get("notes") as string

    // Get handover to validate
    const { data: handover, error: handoverError } = await supabase
      .from("cash_handovers")
      .select("*")
      .eq("id", handoverId)
      .eq("verification_status", "pending")
      .single()

    if (handoverError || !handover) {
      throw new Error("Pending cash handover not found")
    }

    // Only the receiving user can verify the handover
    if (handover.to_user_id !== userId) {
      throw new Error("Only the receiving user can verify the handover")
    }

    const { error: updateError } = await supabase
      .from("cash_handovers")
      .update({
        verification_status: status,
        notes: notes || handover.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", handoverId)

    if (updateError) throw updateError

    // Log audit entry
    await AuditLogger.log(
      "update",
      "cash_handovers",
      handoverId,
      userId,
      { status, notes }
    )

    revalidatePath("/worker")
    return { status }
  })
}

export async function getCashHandovers(options: {
  terminalId?: string
  userId?: string
  status?: "pending" | "verified" | "discrepancy"
  startDate?: Date
  endDate?: Date
}) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()
    const { terminalId, userId, status, startDate, endDate } = options

    let query = supabase
      .from("cash_handovers")
      .select(`
        *,
        from_user:users!from_user_id(full_name),
        to_user:users!to_user_id(full_name)
      `)
      .order("handover_time", { ascending: false })

    if (terminalId) {
      query = query.eq("terminal_id", terminalId)
    }
    if (userId) {
      query = query.or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
    }
    if (status) {
      query = query.eq("verification_status", status)
    }
    if (startDate) {
      query = query.gte("handover_time", startDate.toISOString())
    }
    if (endDate) {
      query = query.lte("handover_time", endDate.toISOString())
    }

    const { data, error } = await query
    if (error) throw error

    return data
  })
}

export async function getHandoverSummary(handoverId: string) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()

    const { data: handover, error } = await supabase
      .from("cash_handovers")
      .select(`
        *,
        from_user:users!from_user_id(full_name),
        to_user:users!to_user_id(full_name),
        terminal:terminals(name)
      `)
      .eq("id", handoverId)
      .single()

    if (error) throw error

    // Get related transactions around handover time
    const handoverTime = new Date(handover.handover_time)
    const timeWindow = 30 * 60 * 1000 // 30 minutes
    const startTime = new Date(handoverTime.getTime() - timeWindow)
    const endTime = new Date(handoverTime.getTime() + timeWindow)

    const [
      { data: cashSubmissions },
      { data: electronicPayments }
    ] = await Promise.all([
      supabase
        .from("cash_submissions")
        .select("*")
        .eq("terminal_id", handover.terminal_id)
        .eq("user_id", handover.from_user_id)
        .gte("submission_time", startTime.toISOString())
        .lte("submission_time", handover.handover_time),
      supabase
        .from("electronic_payments")
        .select("*")
        .eq("terminal_id", handover.terminal_id)
        .eq("user_id", handover.from_user_id)
        .gte("payment_time", startTime.toISOString())
        .lte("payment_time", handover.handover_time)
    ])

    return {
      handover,
      relatedTransactions: {
        cashSubmissions: cashSubmissions || [],
        electronicPayments: electronicPayments || [],
        totalCashSubmitted: (cashSubmissions || []).reduce((sum, sub) => sum + sub.amount, 0),
        totalElectronicPayments: (electronicPayments || []).reduce((sum, pay) => sum + pay.amount, 0)
      }
    }
  })
}

