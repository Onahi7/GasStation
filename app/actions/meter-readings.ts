"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { MeterReadingSchema } from "@/lib/types"
import { withErrorHandling } from "@/lib/utils"
import { AuditLogger } from "@/lib/audit-logger"

export async function createMeterReading(formData: FormData) {
  return withErrorHandling(
    async () => {
      const supabase = getSupabaseServerClient()

      const terminalId = formData.get("terminalId") as string
      const pumpId = formData.get("pumpId") as string
      const userId = formData.get("userId") as string
      const shiftId = formData.get("shiftId") as string
      const openingReading = parseFloat(formData.get("openingReading") as string)

      // Validate if there's already an open reading for this pump in this shift
      const { data: existingReading } = await supabase
        .from("meter_readings")
        .select("*")
        .eq("pump_id", pumpId)
        .eq("shift_id", shiftId)
        .eq("status", "open")
        .maybeSingle()

      if (existingReading) {
        throw new Error("There is already an open meter reading for this pump")
      }

      // Get the last reading for this pump to validate
      const { data: lastReading } = await supabase
        .from("meter_readings")
        .select("closing_reading")
        .eq("pump_id", pumpId)
        .order("reading_time", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (lastReading && openingReading < lastReading.closing_reading) {
        throw new Error("Opening reading cannot be less than the last closing reading")
      }

      const readingData = {
        terminal_id: terminalId,
        pump_id: pumpId,
        user_id: userId,
        shift_id: shiftId,
        opening_reading: openingReading,
        reading_time: new Date().toISOString(),
        status: "open",
      }

      // Validate reading data
      MeterReadingSchema.parse(readingData)

      const { data: reading, error } = await supabase
        .from("meter_readings")
        .insert(readingData)
        .select()
        .single()

      if (error) throw error

      // Log audit entry
      await AuditLogger.log(
        "meter_reading",
        "meter_readings",
        reading.id,
        userId,
        { pumpId, openingReading }
      )

      revalidatePath("/worker/readings")
      return reading
    },
    {
      validation: MeterReadingSchema,
      data: formData,
    }
  )
}

export async function closeMeterReading(formData: FormData) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()

    const readingId = formData.get("readingId") as string
    const userId = formData.get("userId") as string
    const closingReading = parseFloat(formData.get("closingReading") as string)

    // Get current reading to validate
    const { data: currentReading, error: readingError } = await supabase
      .from("meter_readings")
      .select("*, pump:pumps(price_per_liter)")
      .eq("id", readingId)
      .eq("status", "open")
      .single()

    if (readingError || !currentReading) {
      throw new Error("Open meter reading not found")
    }

    if (closingReading <= currentReading.opening_reading) {
      throw new Error("Closing reading must be greater than opening reading")
    }

    const litersSold = closingReading - currentReading.opening_reading
    const expectedAmount = litersSold * currentReading.pump.price_per_liter

    const { error: updateError } = await supabase
      .from("meter_readings")
      .update({
        closing_reading: closingReading,
        liters_sold: litersSold,
        expected_amount: expectedAmount,
        status: "closed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", readingId)

    if (updateError) throw updateError

    // Log audit entry
    await AuditLogger.log(
      "meter_reading",
      "meter_readings",
      readingId,
      userId,
      {
        closingReading,
        litersSold,
        expectedAmount,
      }
    )

    revalidatePath("/worker/readings")
    return { litersSold, expectedAmount }
  })
}

export async function verifyMeterReading(formData: FormData) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()

    const readingId = formData.get("readingId") as string
    const userId = formData.get("userId") as string

    const { error } = await supabase
      .from("meter_readings")
      .update({
        status: "verified",
        updated_at: new Date().toISOString(),
      })
      .eq("id", readingId)
      .eq("status", "closed")

    if (error) throw error

    // Log audit entry
    await AuditLogger.log(
      "meter_reading",
      "meter_readings",
      readingId,
      userId,
      { action: "verify" }
    )

    revalidatePath("/manager/readings")
  })
}

export async function getMeterReadings(options: {
  pumpId?: string
  shiftId?: string
  userId?: string
  status?: "open" | "closed" | "verified"
  startDate?: Date
  endDate?: Date
}) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()
    const { pumpId, shiftId, userId, status, startDate, endDate } = options

    let query = supabase
      .from("meter_readings")
      .select(`
        *,
        pump:pumps(name, product),
        user:users(full_name)
      `)
      .order("reading_time", { ascending: false })

    if (pumpId) {
      query = query.eq("pump_id", pumpId)
    }
    if (shiftId) {
      query = query.eq("shift_id", shiftId)
    }
    if (userId) {
      query = query.eq("user_id", userId)
    }
    if (status) {
      query = query.eq("status", status)
    }
    if (startDate) {
      query = query.gte("reading_time", startDate.toISOString())
    }
    if (endDate) {
      query = query.lte("reading_time", endDate.toISOString())
    }

    const { data, error } = await query
    if (error) throw error

    return data
  })
}

export async function getReadingSummary(readingId: string) {
  return withErrorHandling(async () => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("meter_readings")
      .select(`
        *,
        pump:pumps(name, product, price_per_liter),
        user:users(full_name),
        shift:shifts(start_time, end_time)
      `)
      .eq("id", readingId)
      .single()

    if (error) throw error

    return {
      ...data,
      litersSold: data.closing_reading ? data.closing_reading - data.opening_reading : 0,
      expectedAmount: data.closing_reading ? 
        (data.closing_reading - data.opening_reading) * data.pump.price_per_liter : 0,
    }
  })
}

