"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getShifts(workerId?: string, status?: string, terminalId?: string) {
  const supabase = getSupabaseServerClient()

  let query = supabase
    .from("shifts")
    .select(`
      *,
      worker:users(id, full_name)
    `)
    .order("start_time", { ascending: false })

  if (workerId) {
    query = query.eq("worker_id", workerId)
  }

  if (status) {
    query = query.eq("status", status)
  }

  if (terminalId) {
    query = query.eq("terminal_id", terminalId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Error fetching shifts: ${error.message}`)
  }

  return data
}

export async function getShiftById(id: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("shifts")
    .select(`
      *,
      worker:users(id, full_name)
    `)
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(`Error fetching shift: ${error.message}`)
  }

  return data
}

export async function getCurrentShift(workerId: string, terminalId: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("shifts")
    .select("*")
    .eq("worker_id", workerId)
    .eq("terminal_id", terminalId)
    .eq("status", "active")
    .maybeSingle()

  if (error) {
    throw new Error(`Error fetching current shift: ${error.message}`)
  }

  return data
}

export async function startShift(formData: FormData) {
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

  // Check if the user already has an active shift
  const { data: activeShift, error: checkError } = await supabase
    .from("shifts")
    .select("id")
    .eq("worker_id", user.id)
    .eq("terminal_id", userData.terminal_id)
    .eq("status", "active")
    .maybeSingle()

  if (checkError) {
    throw new Error(`Error checking active shifts: ${checkError.message}`)
  }

  if (activeShift) {
    throw new Error("You already have an active shift")
  }

  const notes = (formData.get("notes") as string) || null

  const { data, error } = await supabase
    .from("shifts")
    .insert({
      worker_id: user.id,
      terminal_id: userData.terminal_id,
      start_time: new Date().toISOString(),
      status: "active",
      notes,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Error starting shift: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    terminal_id: userData.terminal_id,
    user_id: user.id,
    action: "start_shift",
    entity_type: "shifts",
    entity_id: data.id,
  })

  revalidatePath("/worker")
  redirect("/worker")
}

export async function endShift(shiftId: string, formData: FormData) {
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

  // Check if the shift exists and belongs to the user
  const { data: shift, error: shiftError } = await supabase
    .from("shifts")
    .select("*")
    .eq("id", shiftId)
    .eq("worker_id", user.id)
    .eq("terminal_id", userData.terminal_id)
    .eq("status", "active")
    .single()

  if (shiftError) {
    throw new Error(`Error fetching shift: ${shiftError.message}`)
  }

  const notes = (formData.get("notes") as string) || shift.notes

  const { data, error } = await supabase
    .from("shifts")
    .update({
      end_time: new Date().toISOString(),
      status: "completed",
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", shiftId)
    .select()
    .single()

  if (error) {
    throw new Error(`Error ending shift: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    terminal_id: userData.terminal_id,
    user_id: user.id,
    action: "end_shift",
    entity_type: "shifts",
    entity_id: data.id,
  })

  revalidatePath("/worker")
  redirect("/worker")
}

export async function createMeterReading(formData: FormData) {
  throw new Error("createMeterReading is not implemented yet")
}

