"use server"

import { revalidatePath } from "next/cache"
import { ElectronicPaymentSchema } from "@/lib/types"
import { withErrorHandling } from "@/lib/utils"
import { AuditLogger } from "@/lib/audit-logger"
import { prisma } from "@/lib/prisma"

export async function recordElectronicPayment(formData: FormData) {
  return withErrorHandling(async () => {
    const userId = formData.get("userId") as string
    const shiftId = formData.get("shiftId") as string
    const amount = parseFloat(formData.get("amount") as string)
    const paymentMethod = formData.get("paymentMethod") as string
    const referenceNumber = formData.get("referenceNumber") as string
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

    // Check if reference number is unique
    if (referenceNumber) {
      const existingPayment = await prisma.electronicPayment.findFirst({
        where: {
          referenceNumber
        }
      })

      if (existingPayment) {
        throw new Error("Payment with this reference number already exists")
      }
    }

    const paymentData = {
      userId,
      shiftId,
      amount,
      paymentMethod,
      referenceNumber,
      notes,
      status: "pending"
    }

    // Validate payment data
    ElectronicPaymentSchema.parse(paymentData)

    const payment = await prisma.electronicPayment.create({
      data: paymentData
    })

    // Log audit entry
    await AuditLogger.log(
      "create",
      "electronic_payments",
      payment.id,
      userId,
      { amount, paymentMethod, referenceNumber }
    )

    revalidatePath("/worker")
    return payment
  }, {
    validation: ElectronicPaymentSchema,
    data: formData
  })
}

export async function verifyElectronicPayment(formData: FormData) {
  return withErrorHandling(async () => {
    const paymentId = formData.get("paymentId") as string
    const verifierId = formData.get("verifierId") as string
    const status = formData.get("status") as "verified" | "rejected"
    const notes = formData.get("notes") as string

    const payment = await prisma.electronicPayment.findFirst({
      where: {
        id: paymentId,
        status: "pending"
      }
    })

    if (!payment) {
      throw new Error("Pending electronic payment not found")
    }

    const updatedPayment = await prisma.electronicPayment.update({
      where: { id: paymentId },
      data: {
        status,
        verifiedBy: verifierId,
        notes: notes || payment.notes
      }
    })

    // Log audit entry
    await AuditLogger.log(
      "verify",
      "electronic_payments",
      paymentId,
      verifierId,
      { status, notes }
    )

    revalidatePath("/worker")
    return updatedPayment
  })
}

export async function getElectronicPayments(options: {
  userId?: string
  shiftId?: string
  status?: "pending" | "verified" | "rejected"
  paymentMethod?: string
  startDate?: Date
  endDate?: Date
}) {
  return withErrorHandling(async () => {
    const { userId, shiftId, status, paymentMethod, startDate, endDate } = options

    const payments = await prisma.electronicPayment.findMany({
      where: {
        ...(userId && { userId }),
        ...(shiftId && { shiftId }),
        ...(status && { status }),
        ...(paymentMethod && { paymentMethod }),
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

    return payments
  })
}

export async function getPaymentSummary(paymentId: string) {
  return withErrorHandling(async () => {
    const payment = await prisma.electronicPayment.findUnique({
      where: { id: paymentId },
      include: {
        user: {
          select: {
            name: true
          }
        },
        shift: true
      }
    })

    if (!payment) {
      throw new Error("Payment not found")
    }

    return payment
  })
}

