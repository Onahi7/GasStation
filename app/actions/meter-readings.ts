"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { MeterReadingSchema } from "@/lib/types"
import { withErrorHandling } from "@/lib/utils"
import { AuditLogger } from "@/lib/audit-logger"
import { prisma } from "@/lib/prisma"

export async function createMeterReading(formData: FormData) {
  return withErrorHandling(
    async () => {
      const pumpId = formData.get("pumpId") as string
      const userId = formData.get("userId") as string
      const shiftId = formData.get("shiftId") as string
      const openingReading = parseFloat(formData.get("openingReading") as string)

      // Validate if there's already an open reading for this pump in this shift
      const existingReading = await prisma.meterReading.findFirst({
        where: {
          pumpId,
          shiftId,
          closing: null // Use null to indicate an open reading
        }
      })

      if (existingReading) {
        throw new Error("There is already an open meter reading for this pump")
      }

      // Get the last reading for this pump to validate
      const lastReading = await prisma.meterReading.findFirst({
        where: {
          pumpId
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      if (lastReading && openingReading < lastReading.closing) {
        throw new Error("Opening reading cannot be less than the last closing reading")
      }

      const readingData = {
        pumpId,
        userId,
        shiftId,
        opening: openingReading,
        closing: 0 // This will be updated when the reading is closed
      }

      // Validate reading data
      MeterReadingSchema.parse(readingData)

      const reading = await prisma.meterReading.create({
        data: readingData
      })

      // Log audit entry
      await AuditLogger.log(
        "create",
        "meter_readings",
        reading.id,
        userId,
        { pumpId, openingReading }
      )

      revalidatePath("/worker")
      return reading
    },
    {
      validation: MeterReadingSchema,
      data: formData
    }
  )
}

export async function closeMeterReading(formData: FormData) {
  return withErrorHandling(async () => {
    const readingId = formData.get("readingId") as string
    const userId = formData.get("userId") as string
    const closingReading = parseFloat(formData.get("closingReading") as string)

    // Get the reading to update
    const reading = await prisma.meterReading.findUnique({
      where: { id: readingId }
    })

    if (!reading) {
      throw new Error("Meter reading not found")
    }

    if (closingReading < reading.opening) {
      throw new Error("Closing reading cannot be less than opening reading")
    }

    const litersSold = closingReading - reading.opening

    // Get current price for this pump
    const pump = await prisma.pump.findUnique({
      where: { id: reading.pumpId },
      include: { tank: true }
    })

    if (!pump) {
      throw new Error("Pump not found")
    }

    // Update the reading
    const updatedReading = await prisma.meterReading.update({
      where: { id: readingId },
      data: {
        closing: closingReading
      }
    })

    // Log audit entry
    await AuditLogger.log(
      "update",
      "meter_readings",
      readingId,
      userId,
      { closingReading, litersSold }
    )

    revalidatePath("/worker/readings")
    return updatedReading
  })
}

export async function getMeterReadings(options: {
  userId?: string
  pumpId?: string
  shiftId?: string
  startDate?: Date
  endDate?: Date
}) {
  return withErrorHandling(async () => {
    const { userId, pumpId, shiftId, startDate, endDate } = options

    const readings = await prisma.meterReading.findMany({
      where: {
        ...(userId && { userId }),
        ...(pumpId && { pumpId }),
        ...(shiftId && { shiftId }),
        ...(startDate && {
          createdAt: {
            gte: startDate
          }
        }),
        ...(endDate && {
          createdAt: {
            lte: endDate
          }
        })
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        pump: true,
        shift: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return readings
  })
}

export async function verifyMeterReading(formData: FormData) {
  return withErrorHandling(async () => {
    const readingId = formData.get("readingId") as string
    const userId = formData.get("userId") as string

    // There's no status field in our Prisma model yet, 
    // so we could add a 'verified' field or similar

    // Update the reading
    const updatedReading = await prisma.meterReading.update({
      where: { id: readingId },
      data: {
        // Add a verified field to MeterReading model
        // verified: true,
        // verifiedBy: userId
      }
    })

    // Log audit entry
    await AuditLogger.log(
      "verify",
      "meter_readings",
      readingId,
      userId,
      { action: "verify" }
    )

    revalidatePath("/manager/readings")
    return updatedReading
  })
}

