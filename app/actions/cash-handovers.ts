"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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

