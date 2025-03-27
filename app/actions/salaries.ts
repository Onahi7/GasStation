"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function setEmployeeSalary(formData: FormData) {
  const supabase = getSupabaseServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const employeeId = formData.get("employee_id") as string
  const baseSalary = Number(formData.get("base_salary"))
  const effectiveDate = formData.get("effective_date") as string

  // Deactivate any existing active salary for this employee
  await supabase
    .from("employee_salaries")
    .update({ is_active: false })
    .eq("employee_id", employeeId)
    .eq("is_active", true)

  // Create new salary record
  const { error } = await supabase
    .from("employee_salaries")
    .insert({
      employee_id: employeeId,
      base_salary: baseSalary,
      effective_date: effectiveDate,
      is_active: true
    })

  if (error) throw new Error(error.message)
  
  revalidatePath("/manager/employees")
}

export async function addSalaryAdjustment(formData: FormData) {
  const supabase = getSupabaseServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const employeeId = formData.get("employee_id") as string
  const amount = Number(formData.get("amount"))
  const adjustmentType = formData.get("adjustment_type") as string
  const reason = formData.get("reason") as string
  const referenceId = formData.get("reference_id") as string
  const referenceType = formData.get("reference_type") as string

  const { error } = await supabase
    .from("salary_adjustments")
    .insert({
      employee_id: employeeId,
      amount,
      adjustment_type: adjustmentType,
      reason,
      reference_id: referenceId,
      reference_type: referenceType,
      adjusted_by: user.id,
      adjustment_date: new Date().toISOString().split('T')[0]
    })

  if (error) throw new Error(error.message)
  
  revalidatePath("/manager/employees")
}

export async function getEmployeeSalaryDetails(employeeId: string) {
  const supabase = getSupabaseServerClient()

  // Get current active salary
  const { data: salary } = await supabase
    .from("employee_salaries")
    .select("*")
    .eq("employee_id", employeeId)
    .eq("is_active", true)
    .single()

  // Get adjustments for current month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  
  const { data: adjustments } = await supabase
    .from("salary_adjustments")
    .select("*")
    .eq("employee_id", employeeId)
    .gte("adjustment_date", startOfMonth.toISOString().split('T')[0])
    .order("adjustment_date", { ascending: false })

  return {
    baseSalary: salary,
    adjustments: adjustments || []
  }
}