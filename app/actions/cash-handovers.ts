"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { CashHandoverSchema } from "@/lib/types"
import { withErrorHandling } from "@/lib/utils"
import { AuditLogger } from "@/lib/audit-logger"
import { prisma } from "@/lib/db"

export async function getDailyCashHandovers(date?: string, terminalId?: string) {
  return withErrorHandling(async () => {
    const handovers = await prisma.cashHandover.findMany({
      where: {
        ...(date && {
          createdAt: {
            gte: new Date(date),
            lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
          }
        }),
        ...(terminalId && { terminalId })
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return handovers
  })
}

export async function getDailyCashHandoverById(id: string) {
  return withErrorHandling(async () => {
    const handover = await prisma.cashHandover.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true
          }
        },
        shift: true
      }
    })
    
    if (!handover) {
      throw new Error("Cash handover not found")
    }
    
    return handover
  })
}

export async function createCashHandover(formData: FormData) {
  return withErrorHandling(async () => {
    const userId = formData.get("userId") as string
    const shiftId = formData.get("shiftId") as string
    const amount = parseFloat(formData.get("amount") as string)
    const notes = formData.get("notes") as string

    // Validate active shift
    const shift = await prisma.shift.findFirst({
      where: {
        id: shiftId,
        userId,
        endTime: null
      }
    })

    if (!shift) {
      throw new Error("No active shift found")
    }

    // Remove notes from the handover data since it doesn't exist in the schema
    const handoverData = {
      userId,
      shiftId,
      amount
      // notes removed as it's not in the Prisma schema
    }

    // Validate handover data
    CashHandoverSchema.parse(handoverData)

    const handover = await prisma.cashHandover.create({
      data: handoverData
    })

    // Log audit entry
    await AuditLogger.logUserAction(
      "cash_handover",
      userId,
      { amount, shiftId }
    )

    revalidatePath("/worker")
    return handover
  }, {
    validation: CashHandoverSchema,
    data: formData
  })
}

export async function verifyCashHandover(formData: FormData) {
  return withErrorHandling(async () => {
    const handoverId = formData.get("handoverId") as string
    const verifierId = formData.get("verifierId") as string
    const notes = formData.get("notes") as string

    const handover = await prisma.cashHandover.findFirst({
      where: {
        id: handoverId,
        verified: false
      }
    })

    if (!handover) {
      throw new Error("Pending cash handover not found")
    }

    const updatedHandover = await prisma.cashHandover.update({
      where: { id: handoverId },
      data: {
        verified: true,
        verifiedBy: verifierId
        // notes field removed as it doesn't exist in the schema
      }
    })

    // Log audit entry
    await AuditLogger.logUserAction(
      "update", // Using valid AuditAction
      verifierId,
      { handoverId, verified: true }
    )

    revalidatePath("/worker")
    return updatedHandover
  })
}

export async function getCashHandovers(options: {
  userId?: string
  shiftId?: string
  verified?: boolean
  startDate?: Date
  endDate?: Date
}) {
  return withErrorHandling(async () => {
    const { userId, shiftId, verified, startDate, endDate } = options

    const handovers = await prisma.cashHandover.findMany({
      where: {
        ...(userId && { userId }),
        ...(shiftId && { shiftId }),
        ...(verified !== undefined && { verified }),
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
        shift: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return handovers
  })
}

