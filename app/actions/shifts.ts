"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ShiftSchema } from "@/lib/types"
import { withErrorHandling } from "@/lib/utils"
import { AuditLogger } from "@/lib/audit-logger"

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

export async function getActiveShift(userId: string) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("shifts")
      .select("*, user:users(full_name)")
      .eq("user_id", userId)
      .eq("status", "active")
      .single()

    if (error) throw error
    return data
  })
}

export async function startShift(formData: FormData) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()

    const userId = formData.get("userId") as string
    const terminalId = formData.get("terminalId") as string
    const notes = formData.get("notes") as string

    // Check if user already has an active shift
    const { data: activeShift } = await supabase
      .from("shifts")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "active")
      .single()

    if (activeShift) {
      throw new Error("User already has an active shift")
    }

    // Create new shift
    const shiftData = {
      user_id: userId,
      terminal_id: terminalId,
      start_time: new Date().toISOString(),
      status: "active",
      notes,
    }

    // Validate shift data
    ShiftSchema.parse(shiftData)

    const { data: shift, error } = await supabase
      .from("shifts")
      .insert(shiftData)
      .select()
      .single()

    if (error) throw error

    // Log audit entry
    await AuditLogger.log(
      "shift_start",
      "shifts",
      shift.id,
      userId,
      { terminalId, notes }
    )

    revalidatePath("/worker")
    redirect("/worker")
  }, {
    validation: ShiftSchema,
    data: formData
  })
}

export async function endShift(formData: FormData) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()

    const shiftId = formData.get("shiftId") as string
    const userId = formData.get("userId") as string
    const notes = formData.get("notes") as string

    // Get the shift to validate ownership
    const { data: shift, error: shiftError } = await supabase
      .from("shifts")
      .select("*")
      .eq("id", shiftId)
      .eq("user_id", userId)
      .eq("status", "active")
      .single()

    if (shiftError || !shift) {
      throw new Error("Active shift not found")
    }

    // Update shift end time and status
    const { error: updateError } = await supabase
      .from("shifts")
      .update({
        end_time: new Date().toISOString(),
        status: "completed",
        notes: notes || shift.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", shiftId)

    if (updateError) throw updateError

    // Log audit entry
    await AuditLogger.log(
      "shift_end",
      "shifts",
      shiftId,
      userId,
      { notes }
    )

    // Handle any pending tasks before shift end
    await completeShiftTasks(shiftId)

    revalidatePath("/worker")
    redirect("/worker")
  })
}

async function completeShiftTasks(shiftId: string) {
  const supabase = getSupabaseServerClient()

  // Close any open meter readings
  const { error: readingsError } = await supabase
    .from("meter_readings")
    .update({ status: "closed", updated_at: new Date().toISOString() })
    .eq("shift_id", shiftId)
    .eq("status", "open")

  if (readingsError) throw readingsError

  // Verify any pending cash submissions
  const { error: submissionsError } = await supabase
    .from("cash_submissions")
    .update({
      verification_status: "verified",
      updated_at: new Date().toISOString()
    })
    .eq("shift_id", shiftId)
    .eq("verification_status", "pending")

  if (submissionsError) throw submissionsError
}

export async function getShiftSummary(shiftId: string) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()

    // Get all related data for the shift
    const [
      { data: meterReadings },
      { data: cashSubmissions },
      { data: electronicPayments },
      { data: expenses }
    ] = await Promise.all([
      supabase
        .from("meter_readings")
        .select("*")
        .eq("shift_id", shiftId),
      supabase
        .from("cash_submissions")
        .select("*")
        .eq("shift_id", shiftId),
      supabase
        .from("electronic_payments")
        .select("*")
        .eq("shift_id", shiftId),
      supabase
        .from("expenses")
        .select("*")
        .eq("shift_id", shiftId)
    ])

    const summary = {
      totalFuelSold: calculateTotalFuelSold(meterReadings || []),
      totalCashCollected: calculateTotalCash(cashSubmissions || []),
      totalElectronicPayments: calculateTotalElectronic(electronicPayments || []),
      totalExpenses: calculateTotalExpenses(expenses || []),
      meterReadings: meterReadings || [],
      cashSubmissions: cashSubmissions || [],
      electronicPayments: electronicPayments || [],
      expenses: expenses || []
    }

    return summary
  })
}

function calculateTotalFuelSold(readings: any[]) {
  return readings.reduce((total, reading) => {
    if (reading.liters_sold) {
      return total + reading.liters_sold
    }
    return total
  }, 0)
}

function calculateTotalCash(submissions: any[]) {
  return submissions.reduce((total, submission) => total + submission.amount, 0)
}

function calculateTotalElectronic(payments: any[]) {
  return payments.reduce((total, payment) => total + payment.amount, 0)
}

function calculateTotalExpenses(expenses: any[]) {
  return expenses.reduce((total, expense) => total + expense.amount, 0)
}

export async function createMeterReading(formData: FormData) {
  throw new Error("createMeterReading is not implemented yet")
}

