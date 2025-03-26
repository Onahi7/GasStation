"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getMeterReadings(shiftId?: string, nozzleId?: string, terminalId?: string) {
  const supabase = getSupabaseServerClient()

  let query = supabase
    .from("meter_readings")
    .select(`
      *,
      nozzle:nozzles(id, name, pump_id),
      recorded_by:users(id, full_name)
    `)
    .order("reading_time", { ascending: false })

  if (shiftId) {
    query = query.eq("shift_id", shiftId)
  }

  if (nozzleId) {
    query = query.eq("nozzle_id", nozzleId)
  }

  if (terminalId) {
    const { data: nozzles } = await supabase.from("nozzles").select("id").eq("terminal_id", terminalId)

    if (nozzles && nozzles.length > 0) {
      const nozzleIds = nozzles.map((n) => n.id)
      query = query.in("nozzle_id", nozzleIds)
    }
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Error fetching meter readings: ${error.message}`)
  }

  return data
}

export async function getMeterReadingById(id: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("meter_readings")
    .select(`
      *,
      nozzle:nozzles(id, name, pump_id),
      recorded_by:users(id, full_name)
    `)
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(`Error fetching meter reading: ${error.message}`)
  }

  return data
}

export async function createMeterReading(formData: FormData) {
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
  const nozzleId = formData.get("nozzle_id") as string
  const readingType = formData.get("reading_type") as string
  const readingValue = Number.parseFloat(formData.get("reading_value") as string)

  // Validate the reading type
  if (readingType !== "opening" && readingType !== "closing") {
    throw new Error("Invalid reading type")
  }

  // Check if there's already a reading of this type for this nozzle in this shift
  const { data: existingReading, error: checkError } = await supabase
    .from("meter_readings")
    .select("id")
    .eq("shift_id", shiftId)
    .eq("nozzle_id", nozzleId)
    .eq("reading_type", readingType)
    .maybeSingle()

  if (checkError) {
    throw new Error(`Error checking existing readings: ${checkError.message}`)
  }

  if (existingReading) {
    throw new Error(`A ${readingType} reading already exists for this nozzle in this shift`)
  }

  // For closing readings, check if there's an opening reading and if the closing value is greater
  if (readingType === "closing") {
    const { data: openingReading, error: openingError } = await supabase
      .from("meter_readings")
      .select("reading_value")
      .eq("shift_id", shiftId)
      .eq("nozzle_id", nozzleId)
      .eq("reading_type", "opening")
      .maybeSingle()

    if (openingError) {
      throw new Error(`Error checking opening reading: ${openingError.message}`)
    }

    if (!openingReading) {
      throw new Error("No opening reading found for this nozzle in this shift")
    }

    if (readingValue < openingReading.reading_value) {
      throw new Error("Closing reading must be greater than or equal to opening reading")
    }
  }

  const { data, error } = await supabase
    .from("meter_readings")
    .insert({
      shift_id: shiftId,
      nozzle_id: nozzleId,
      reading_type: readingType,
      reading_value: readingValue,
      recorded_by: user.id,
      reading_time: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating meter reading: ${error.message}`)
  }

  // If this is a closing reading, update the nozzle's current reading
  if (readingType === "closing") {
    const { error: updateError } = await supabase
      .from("nozzles")
      .update({
        current_reading: readingValue,
        updated_at: new Date().toISOString(),
      })
      .eq("id", nozzleId)

    if (updateError) {
      throw new Error(`Error updating nozzle reading: ${updateError.message}`)
    }
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    terminal_id: userData.terminal_id,
    user_id: user.id,
    action: "create",
    entity_type: "meter_readings",
    entity_id: data.id,
    details: { shift_id: shiftId, nozzle_id: nozzleId, reading_type: readingType, reading_value: readingValue },
  })

  revalidatePath("/worker/readings")
  redirect("/worker/readings")
}

