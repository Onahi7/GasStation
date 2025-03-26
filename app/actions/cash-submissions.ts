"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getCashSubmissions(shiftId?: string, workerId?: string, terminalId?: string) {
  const supabase = getSupabaseServerClient()

  let query = supabase
    .from("cash_submissions")
    .select(`
      *,
      submitted_by:users!submitted_by(id, full_name),
      received_by:users!received_by(id, full_name),
      shift:shifts(id, worker_id, start_time, end_time)
    `)
    .order("submission_date", { ascending: false })

  if (shiftId) {
    query = query.eq("shift_id", shiftId)
  }

  if (workerId) {
    query = query.eq("submitted_by", workerId)
  }

  if (terminalId) {
    query = query.eq("terminal_id", terminalId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Error fetching cash submissions: ${error.message}`)
  }

  return data
}

export async function getCashSubmissionById(id: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("cash_submissions")
    .select(`
      *,
      submitted_by:users!submitted_by(id, full_name),
      received_by:users!received_by(id, full_name),
      shift:shifts(id, worker_id, start_time, end_time)
    `)
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(`Error fetching cash submission: ${error.message}`)
  }

  return data
}

export async function createCashSubmission(formData: FormData) {
  const supabase = getSupabaseServerClient()

  // Get the current user (worker)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Get the user's terminal
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("terminal_id, role")
    .eq("id", user.id)
    .single()

  if (userError || !userData?.terminal_id) {
    throw new Error("User not assigned to a terminal")
  }

  const shiftId = formData.get("shift_id") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const notes = (formData.get("notes") as string) || null

  // Validate the amount
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Invalid amount")
  }

  // Check if the shift exists and is active
  const { data: shift, error: shiftError } = await supabase
    .from("shifts")
    .select("*")
    .eq("id", shiftId)
    .eq("status", "active")
    .single()

  if (shiftError) {
    throw new Error(`Error fetching shift: ${shiftError.message}`)
  }

  // Calculate expected amount based on meter readings
  const expectedAmount = null
  const discrepancy = null

  // Create the cash submission
  const { data, error } = await supabase
    .from("cash_submissions")
    .insert({
      shift_id: shiftId,
      terminal_id: userData.terminal_id,
      submitted_by: user.id,
      amount,
      expected_amount: expectedAmount,
      discrepancy,
      notes,
      submission_date: new Date().toISOString(),
      status: "submitted",
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating cash submission: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    terminal_id: userData.terminal_id,
    user_id: user.id,
    action: "create",
    entity_type: "cash_submissions",
    entity_id: data.id,
    details: { shift_id: shiftId, amount },
  })

  revalidatePath("/worker")
  redirect("/worker")
}

export async function receiveCashSubmission(id: string, formData: FormData) {
  const supabase = getSupabaseServerClient()

  // Get the current user (cashier)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Get the user's terminal and verify role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("terminal_id, role")
    .eq("id", user.id)
    .single()

  if (userError || !userData?.terminal_id) {
    throw new Error("User not assigned to a terminal")
  }

  if (userData.role !== "cashier" && userData.role !== "finance" && userData.role !== "manager") {
    throw new Error("Unauthorized: Only cashiers, finance staff, or managers can receive cash submissions")
  }

  const notes = (formData.get("notes") as string) || null

  // Update the cash submission
  const { data, error } = await supabase
    .from("cash_submissions")
    .update({
      received_by: user.id,
      status: "verified",
      notes: notes ? `${notes} (Received by ${user.email})` : `Received by ${user.email}`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("terminal_id", userData.terminal_id)
    .select()
    .single()

  if (error) {
    throw new Error(`Error receiving cash submission: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    terminal_id: userData.terminal_id,
    user_id: user.id,
    action: "receive",
    entity_type: "cash_submissions",
    entity_id: data.id,
  })

  revalidatePath("/cashier")
  redirect("/cashier")
}

