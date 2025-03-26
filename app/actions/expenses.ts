"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getDailyExpenses(date?: string, terminalId?: string) {
  const supabase = getSupabaseServerClient()

  let query = supabase
    .from("daily_expenses")
    .select(`
      *,
      cashier:users!cashier_id(id, full_name),
      approver:users!approved_by(id, full_name)
    `)
    .order("created_at", { ascending: false })

  if (date) {
    query = query.eq("expense_date", date)
  }

  if (terminalId) {
    query = query.eq("terminal_id", terminalId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Error fetching daily expenses: ${error.message}`)
  }

  return data
}

export async function getDailyExpenseById(id: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("daily_expenses")
    .select(`
      *,
      cashier:users!cashier_id(id, full_name),
      approver:users!approved_by(id, full_name)
    `)
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(`Error fetching daily expense: ${error.message}`)
  }

  return data
}

export async function createDailyExpense(formData: FormData) {
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

  // Only cashiers, finance staff, and managers can record expenses
  if (userData.role !== "cashier" && userData.role !== "finance" && userData.role !== "manager") {
    throw new Error("Unauthorized: Only cashiers, finance staff, or managers can record expenses")
  }

  const category = formData.get("category") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string
  const receiptUrl = (formData.get("receipt_url") as string) || null

  // Auto-approve if manager or finance
  const status = userData.role === "manager" || userData.role === "finance" ? "approved" : "pending"
  const approvedBy = userData.role === "manager" || userData.role === "finance" ? user.id : null
  const approvalTime = userData.role === "manager" || userData.role === "finance" ? new Date().toISOString() : null

  // Validate the amount
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Invalid amount")
  }

  // Create the daily expense
  const { data, error } = await supabase
    .from("daily_expenses")
    .insert({
      terminal_id: userData.terminal_id,
      cashier_id: user.id,
      expense_date: new Date().toISOString().split("T")[0],
      category,
      amount,
      description,
      receipt_url: receiptUrl,
      approved_by: approvedBy,
      approval_time: approvalTime,
      status,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating daily expense: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    terminal_id: userData.terminal_id,
    user_id: user.id,
    action: "create",
    entity_type: "daily_expenses",
    entity_id: data.id,
    details: { category, amount, status },
  })

  revalidatePath("/cashier")
  redirect("/cashier")
}

export async function approveExpense(id: string, formData: FormData) {
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

  // Only managers and finance staff can approve expenses
  if (userData.role !== "manager" && userData.role !== "finance") {
    throw new Error("Unauthorized: Only managers and finance staff can approve expenses")
  }

  // Update the expense
  const { data, error } = await supabase
    .from("daily_expenses")
    .update({
      approved_by: user.id,
      approval_time: new Date().toISOString(),
      status: "approved",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("terminal_id", userData.terminal_id)
    .eq("status", "pending")
    .select()
    .single()

  if (error) {
    throw new Error(`Error approving expense: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    terminal_id: userData.terminal_id,
    user_id: user.id,
    action: "approve",
    entity_type: "daily_expenses",
    entity_id: data.id,
  })

  revalidatePath("/finance")
  redirect("/finance")
}

export async function rejectExpense(id: string, formData: FormData) {
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

  // Only managers and finance staff can reject expenses
  if (userData.role !== "manager" && userData.role !== "finance") {
    throw new Error("Unauthorized: Only managers and finance staff can reject expenses")
  }

  const reason = formData.get("reason") as string

  if (!reason) {
    throw new Error("Rejection reason is required")
  }

  // Update the expense
  const { data, error } = await supabase
    .from("daily_expenses")
    .update({
      approved_by: user.id,
      approval_time: new Date().toISOString(),
      status: "rejected",
      description: `${data.description || ""}\n\nRejected: ${reason} (by ${user.email})`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("terminal_id", userData.terminal_id)
    .eq("status", "pending")
    .select()
    .single()

  if (error) {
    throw new Error(`Error rejecting expense: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    terminal_id: userData.terminal_id,
    user_id: user.id,
    action: "reject",
    entity_type: "daily_expenses",
    entity_id: data.id,
    details: { reason },
  })

  revalidatePath("/finance")
  redirect("/finance")
}

