"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function setEmployeeSalary(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  const employeeId = formData.get("employee_id") as string
  const baseSalary = Number(formData.get("base_salary"))
  const effectiveDate = formData.get("effective_date") as string

  // Deactivate any existing active salary for this employee
  await prisma.employeeSalary.updateMany({
    where: {
      employeeId: employeeId,
      isActive: true
    },
    data: {
      isActive: false
    }
  })

  // Create new salary record
  await prisma.employeeSalary.create({
    data: {
      employeeId: employeeId,
      baseSalary: baseSalary,
      effectiveDate: new Date(effectiveDate),
      isActive: true
    }
  })

  revalidatePath("/manager/employees")
}

export async function addSalaryAdjustment(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  const employeeId = formData.get("employee_id") as string
  const amount = Number(formData.get("amount"))
  const adjustmentType = formData.get("adjustment_type") as string
  const reason = formData.get("reason") as string
  const referenceId = formData.get("reference_id") as string || undefined
  const referenceType = formData.get("reference_type") as string || undefined

  await prisma.salaryAdjustment.create({
    data: {
      employeeId: employeeId,
      amount,
      adjustmentType: adjustmentType,
      reason,
      referenceId,
      referenceType,
      adjustedBy: user.id,
      adjustmentDate: new Date()
    }
  })

  revalidatePath("/manager/employees")
}

export async function getEmployeeSalaryDetails(employeeId: string) {
  // Get current active salary
  const salary = await prisma.employeeSalary.findFirst({
    where: {
      employeeId: employeeId,
      isActive: true
    }
  })

  // Get adjustments for current month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  
  const adjustments = await prisma.salaryAdjustment.findMany({
    where: {
      employeeId: employeeId,
      adjustmentDate: {
        gte: startOfMonth
      }
    },
    orderBy: {
      adjustmentDate: 'desc'
    }
  })

  return {
    baseSalary: salary,
    adjustments: adjustments
  }
}