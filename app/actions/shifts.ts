"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ShiftSchema } from "@/lib/types"
import { withErrorHandling } from "@/lib/utils"
import { AuditLogger } from "@/lib/audit-logger"
import { prisma } from "@/lib/db"

export async function getShifts(workerId?: string, status?: string, terminalId?: string) {
  return withErrorHandling(async () => {
    const shifts = await prisma.shift.findMany({
      where: {
        ...(workerId && { userId: workerId }),
        ...(status && { status: status }),
        ...(terminalId && { terminalId: terminalId })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        startTime: 'desc'
      }
    })

    return shifts
  })
}

export async function getCurrentShift(workerId: string, terminalId: string) {
  return withErrorHandling(async () => {
    const shift = await prisma.shift.findFirst({
      where: {
        userId: workerId,
        terminalId: terminalId,
        endTime: null
      }
    })

    return shift
  })
}

export async function getActiveShift(userId: string) {
  return withErrorHandling(async () => {
    const shift = await prisma.shift.findFirst({
      where: {
        userId,
        endTime: null
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    return shift
  })
}

export async function startShift(formData: FormData) {
  return withErrorHandling(async () => {
    const userId = formData.get("userId") as string
    const terminalId = formData.get("terminalId") as string
    const notes = formData.get("notes") as string

    // Check if user already has an active shift
    const activeShift = await prisma.shift.findFirst({
      where: {
        userId,
        endTime: null
      }
    })

    if (activeShift) {
      throw new Error("User already has an active shift")
    }

    // Create new shift
    const shiftData = {
      userId,
      terminalId,
      startTime: new Date(),
      notes
    }

    // Validate shift data
    ShiftSchema.parse(shiftData)

    const shift = await prisma.shift.create({
      data: shiftData
    })

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
    const shiftId = formData.get("shiftId") as string
    const userId = formData.get("userId") as string
    const notes = formData.get("notes") as string

    // Get the shift to validate ownership
    const shift = await prisma.shift.findFirst({
      where: {
        id: shiftId,
        userId,
        endTime: null
      }
    })

    if (!shift) {
      throw new Error("Active shift not found")
    }

    // Update shift end time
    await prisma.shift.update({
      where: { id: shiftId },
      data: {
        endTime: new Date(),
        notes: notes || shift.notes
      }
    })

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
  // Close any open meter readings
  await prisma.meterReading.updateMany({
    where: {
      shiftId,
      status: "open"
    },
    data: {
      status: "closed"
    }
  })

  // Verify any pending cash submissions
  await prisma.cashHandover.updateMany({
    where: {
      shiftId,
      verified: false
    },
    data: {
      verified: true
    }
  })
}

export async function getShiftSummary(shiftId: string) {
  return withErrorHandling(async () => {
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
      include: {
        meterReadings: true,
        cashHandovers: true,
      }
    })

    if (!shift) {
      throw new Error("Shift not found")
    }

    const summary = {
      totalFuelSold: calculateTotalFuelSold(shift.meterReadings),
      totalCashCollected: calculateTotalCash(shift.cashHandovers),
      meterReadings: shift.meterReadings,
      cashHandovers: shift.cashHandovers
    }

    return summary
  })
}

function calculateTotalFuelSold(readings: any[]) {
  return readings.reduce((total, reading) => {
    return total + (reading.closing - reading.opening)
  }, 0)
}

function calculateTotalCash(handovers: any[]) {
  return handovers.reduce((total, handover) => {
    return total + handover.amount
  }, 0)
}

