"use server"

import { revalidatePath } from "next/cache"
import { CashSubmissionSchema } from "@/lib/types"
import { withErrorHandling } from "@/lib/utils"
import { AuditLogger } from "@/lib/audit-logger"
import { prisma } from "@/lib/prisma"

export async function submitCash(formData: FormData) {
  return withErrorHandling(async () => {
    const userId = formData.get("userId") as string
    const shiftId = formData.get("shiftId") as string
    const amount = parseFloat(formData.get("amount") as string)
    const notes = formData.get("notes") as string

    // Get active shift to validate
    const activeShift = await prisma.shift.findFirst({
      where: {
        id: shiftId,
        userId,
        endTime: null
      }
    })

    if (!activeShift) {
      throw new Error("No active shift found")
    }

    const submissionData = {
      userId,
      shiftId,
      amount,
      notes,
      verified: false
    }

    // Validate submission data
    CashSubmissionSchema.parse(submissionData)

    const submission = await prisma.cashSubmission.create({
      data: submissionData
    })

    // Log audit entry
    await AuditLogger.log(
      "create",
      "cash_submissions",
      submission.id,
      userId,
      { amount, shiftId }
    )

    revalidatePath("/worker")
    return submission
  }, {
    validation: CashSubmissionSchema,
    data: formData
  })
}

export async function verifyCashSubmission(formData: FormData) {
  return withErrorHandling(async () => {
    const submissionId = formData.get("submissionId") as string
    const verifierId = formData.get("verifierId") as string
    const notes = formData.get("notes") as string

    const submission = await prisma.cashSubmission.findFirst({
      where: {
        id: submissionId,
        verified: false
      }
    })

    if (!submission) {
      throw new Error("Pending cash submission not found")
    }

    const updatedSubmission = await prisma.cashSubmission.update({
      where: { id: submissionId },
      data: {
        verified: true,
        verifiedBy: verifierId,
        notes: notes || submission.notes
      }
    })

    // Log audit entry
    await AuditLogger.log(
      "verify",
      "cash_submissions",
      submissionId,
      verifierId,
      { notes }
    )

    revalidatePath("/worker")
    return updatedSubmission
  })
}

export async function getCashSubmissions(options: {
  userId?: string
  shiftId?: string
  verified?: boolean
  startDate?: Date
  endDate?: Date
}) {
  return withErrorHandling(async () => {
    const { userId, shiftId, verified, startDate, endDate } = options

    const submissions = await prisma.cashSubmission.findMany({
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

    return submissions
  })
}

export async function getShiftSubmissions(shiftId: string) {
  return withErrorHandling(async () => {
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
      include: {
        user: {
          select: {
            name: true
          }
        },
        meterReadings: true,
        cashSubmissions: true,
        electronicPayments: true
      }
    })

    if (!shift) {
      throw new Error("Shift not found")
    }

    // Calculate totals
    const totalExpectedCash = shift.meterReadings.reduce((total, reading) => 
      total + (reading.expectedAmount || 0), 0)
    
    const totalSubmittedCash = shift.cashSubmissions.reduce((total, submission) => 
      total + submission.amount, 0)
    
    const totalElectronicPayments = shift.electronicPayments.reduce((total, payment) => 
      total + payment.amount, 0)

    const cashVariance = totalSubmittedCash - totalExpectedCash

    return {
      shift,
      totals: {
        expectedCash: totalExpectedCash,
        submittedCash: totalSubmittedCash,
        electronicPayments: totalElectronicPayments,
        totalCollected: totalSubmittedCash + totalElectronicPayments,
        cashVariance,
      }
    }
  })
}
