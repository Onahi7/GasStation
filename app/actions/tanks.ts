"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getTanks() {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.from("tanks").select("*").order("name")

  if (error) {
    throw new Error(`Error fetching tanks: ${error.message}`)
  }

  return data
}

export async function getTankById(id: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.from("tanks").select("*").eq("id", id).single()

  if (error) {
    throw new Error(`Error fetching tank: ${error.message}`)
  }

  return data
}

export async function createTank(formData: FormData) {
  const supabase = getSupabaseServerClient()

  const name = formData.get("name") as string
  const fuelType = formData.get("fuel_type") as "petrol" | "diesel" | "kerosene"
  const capacity = Number.parseFloat(formData.get("capacity") as string)
  const currentVolume = Number.parseFloat(formData.get("current_volume") as string) || 0
  const minVolume = Number.parseFloat(formData.get("min_volume") as string) || 0
  const location = (formData.get("location") as string) || null

  const { data, error } = await supabase
    .from("tanks")
    .insert({
      name,
      fuel_type: fuelType,
      capacity,
      current_volume: currentVolume,
      min_volume: minVolume,
      location,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating tank: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    action: "create",
    entity: "tanks",
    entity_id: data.id,
    details: { name, fuel_type: fuelType, capacity },
  })

  revalidatePath("/admin/tanks")
  redirect("/admin/tanks")
}

export async function updateTank(id: string, formData: FormData) {
  const supabase = getSupabaseServerClient()

  const name = formData.get("name") as string
  const fuelType = formData.get("fuel_type") as "petrol" | "diesel" | "kerosene"
  const capacity = Number.parseFloat(formData.get("capacity") as string)
  const currentVolume = Number.parseFloat(formData.get("current_volume") as string)
  const minVolume = Number.parseFloat(formData.get("min_volume") as string)
  const location = (formData.get("location") as string) || null
  const isActive = formData.get("is_active") === "true"

  const { data, error } = await supabase
    .from("tanks")
    .update({
      name,
      fuel_type: fuelType,
      capacity,
      current_volume: currentVolume,
      min_volume: minVolume,
      location,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(`Error updating tank: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    action: "update",
    entity: "tanks",
    entity_id: id,
    details: { name, fuel_type: fuelType, capacity, current_volume: currentVolume },
  })

  revalidatePath("/admin/tanks")
  redirect("/admin/tanks")
}

export async function deleteTank(id: string) {
  const supabase = getSupabaseServerClient()

  // First check if there are any pumps connected to this tank
  const { data: pumps, error: pumpsError } = await supabase.from("pumps").select("id").eq("tank_id", id)

  if (pumpsError) {
    throw new Error(`Error checking pumps: ${pumpsError.message}`)
  }

  if (pumps && pumps.length > 0) {
    throw new Error("Cannot delete tank with connected pumps")
  }

  const { error } = await supabase.from("tanks").delete().eq("id", id)

  if (error) {
    throw new Error(`Error deleting tank: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    action: "delete",
    entity: "tanks",
    entity_id: id,
  })

  revalidatePath("/admin/tanks")
  redirect("/admin/tanks")
}

