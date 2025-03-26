"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getElectronicPayments(shiftId?: string, status?: string, terminalId?: string) {
  const supabase = getSupabaseServerClient()

  let query = supabase
    .from("electronic_payments")
    .select(`
      *,
      submitted_by:users!submitted_by(id, full_name),
      approved_by:users(id, full_name),
      payment_method:payment_methods(id, name),
      shift:shifts(id, worker_id, start_time, end_time)
    `)
    .order("created_at", { ascending: false })

  if (shiftId) {
    query = query.eq("shift_id", shiftId)
  }

  if (status) {
    query = query.eq("status", status)
  }

  if (terminalId) {
    query = query.eq("terminal_id", terminalId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Error fetching electronic payments: ${error.message}`)
  }

  return data
}

export async function getElectronicPaymentById(id: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("electronic_payments")
    .select(`
      *,
      submitted_by:users!submitted_by(id, full_name),
      approved_by:users(id, full_name),
      payment_method:payment_methods(id, name),
      shift:shifts(id, worker_id, start_time, end_time)
    `)
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(`Error fetching electronic payment: ${error.message}`)
  }

  return data
}

export async function createElectronicPayment(formData: FormData) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Get the user's terminal
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("terminal_id")
    .eq("id", user.id)
    .single()

  if (userError || !userData?.terminal_id) {
    throw new Error("User not assigned to a terminal")
  }

  const shiftId = formData.get("shift_id") as string
  const paymentMethodId = formData.get("payment_method_id") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const referenceNumber = formData.get("reference_number") as string
  const customerName = formData.get("customer_name") as string
  const notes = (formData.get("notes") as string) || null

  // Validate the amount
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Invalid amount")
  }

  // Check if the payment method requires approval
  const { data: paymentMethod, error: paymentMethodError } = await supabase
    .from("payment_methods")
    .select("requires_approval")
    .eq("id", paymentMethodId)
    .single()

  if (paymentMethodError) {
    throw new Error(`Error fetching payment method: ${paymentMethodError.message}`)
  }

  const status = paymentMethod.requires_approval ? "pending" : "approved"
  const approvalTime = paymentMethod.requires_approval ? null : new Date().toISOString()
  const approvedBy = paymentMethod.requires_approval ? null : user.id

  // Create the electronic payment
  const { data, error } = await supabase
    .from("electronic_payments")
    .insert({
      shift_id: shiftId,
      terminal_id: userData.terminal_id,
      submitted_by: user.id,
      payment_method_id: paymentMethodId,
      amount,
      reference_number: referenceNumber,
      customer_name: customerName,
      approved_by: approvedBy,
      approval_time: approvalTime,
      status,
      notes,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating electronic payment: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    terminal_id: userData.terminal_id,
    user_id: user.id,
    action: "create",
    entity_type: "electronic_payments",
    entity_id: data.id,
    details: { shift_id: shiftId, payment_method_id: paymentMethodId, amount, status },
  })

  revalidatePath("/worker")
  redirect("/worker")
}

export async function approveElectronicPayment(id: string, formData: FormData) {
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

  // Only managers and finance staff can approve payments
  if (userData.role !== "manager" && userData.role !== "finance") {
    throw new Error("Unauthorized: Only managers and finance staff can approve payments")
  }

  const notes = (formData.get("notes") as string) || null

  // Update the electronic payment
  const { data, error } = await supabase
    .from("electronic_payments")
    .update({
      approved_by: user.id,
      approval_time: new Date().toISOString(),
      status: "approved",
      notes: notes ? `${notes} (Approved by ${user.email})` : `Approved by ${user.email}`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("terminal_id", userData.terminal_id)
    .eq("status", "pending")
    .select()
    .single()

  if (error) {
    throw new Error(`Error approving electronic payment: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    terminal_id: userData.terminal_id,
    user_id: user.id,
    action: "approve",
    entity_type: "electronic_payments",
    entity_id: data.id,
  })

  revalidatePath("/finance")
  redirect("/finance")
}

export async function rejectElectronicPayment(id: string, formData: FormData) {
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

  // Only managers and finance staff can reject payments
  if (userData.role !== "manager" && userData.role !== "finance") {
    throw new Error("Unauthorized: Only managers and finance staff can reject payments")
  }

  const reason = formData.get("reason") as string

  if (!reason) {
    throw new Error("Rejection reason is required")
  }

  // Update the electronic payment
  const { data, error } = await supabase
    .from("electronic_payments")
    .update({
      approved_by: user.id,
      approval_time: new Date().toISOString(),
      status: "rejected",
      notes: `Rejected: ${reason} (by ${user.email})`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("terminal_id", userData.terminal_id)
    .eq("status", "pending")
    .select()
    .single()

  if (error) {
    throw new Error(`Error rejecting electronic payment: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    terminal_id: userData.terminal_id,
    user_id: user.id,
    action: "reject",
    entity_type: "electronic_payments",
    entity_id: data.id,
    details: { reason },
  })

  revalidatePath("/finance")
  redirect("/finance")
}

