"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getDrivers(companyId: string) {
  const supabase = getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      full_name,
      email,
      phone,
      employee_salaries (
        base_salary,
        effective_date,
        is_active
      )
    `)
    .eq("company_id", companyId)
    .eq("role", "terminal_driver")

  if (error) throw new Error(error.message)
  return data
}

export async function getTrucks(companyId: string) {
  const supabase = getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("trucks")
    .select("*")
    .eq("company_id", companyId)
    .eq("is_active", true)

  if (error) throw new Error(error.message)
  return data
}

export async function createDeliveryWaybill(formData: FormData) {
  const supabase = getSupabaseServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const truckId = formData.get("truck_id") as string
  const driverId = formData.get("driver_id") as string
  const terminalId = formData.get("terminal_id") as string
  const waybillNumber = formData.get("waybill_number") as string
  const expectedVolume = Number(formData.get("expected_volume"))
  const productType = formData.get("product_type") as string
  const waybillImageUrl = formData.get("waybill_image_url") as string
  const notes = formData.get("notes") as string

  // Get company ID from user
  const { data: userData } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single()

  if (!userData?.company_id) throw new Error("User not associated with a company")

  const { error } = await supabase
    .from("delivery_waybills")
    .insert({
      company_id: userData.company_id,
      truck_id: truckId,
      driver_id: driverId,
      terminal_id: terminalId,
      waybill_number: waybillNumber,
      expected_volume: expectedVolume,
      product_type: productType,
      waybill_image_url: waybillImageUrl,
      notes,
      status: "pending"
    })

  if (error) throw new Error(error.message)
  
  revalidatePath("/manager/deliveries")
}

export async function updateDeliveryStatus(id: string, formData: FormData) {
  const supabase = getSupabaseServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const status = formData.get("status") as string
  const deliveredVolume = Number(formData.get("delivered_volume"))
  const arrivalTime = status === "delivered" ? new Date().toISOString() : null
  
  const { error } = await supabase
    .from("delivery_waybills")
    .update({
      status,
      delivered_volume: deliveredVolume,
      arrival_time: arrivalTime
    })
    .eq("id", id)

  if (error) throw new Error(error.message)

  // If there's a volume discrepancy, create a salary adjustment
  if (status === "delivered" && deliveredVolume) {
    const { data: delivery } = await supabase
      .from("delivery_waybills")
      .select("expected_volume, driver_id")
      .eq("id", id)
      .single()

    if (delivery) {
      const discrepancy = deliveredVolume - delivery.expected_volume
      if (Math.abs(discrepancy) > 0) {
        await supabase
          .from("salary_adjustments")
          .insert({
            employee_id: delivery.driver_id,
            amount: Math.abs(discrepancy),
            adjustment_type: discrepancy < 0 ? "shortage" : "excess",
            reason: `Volume ${discrepancy < 0 ? "shortage" : "excess"} for delivery ${id}`,
            reference_id: id,
            reference_type: "delivery",
            adjusted_by: user.id,
            adjustment_date: new Date().toISOString().split("T")[0]
          })
      }
    }
  }
  
  revalidatePath("/manager/deliveries")
}

export async function getDeliveryWaybills(companyId: string, status?: string) {
  const supabase = getSupabaseServerClient()
  
  let query = supabase
    .from("delivery_waybills")
    .select(`
      *,
      driver:users!driver_id(id, full_name),
      truck:trucks(registration_number),
      terminal:terminals(name)
    `)
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query
  
  if (error) throw new Error(error.message)
  return data
}