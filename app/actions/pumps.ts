"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getPumps() {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("pumps")
    .select(`
      *,
      tank:tanks(id, name, fuel_type)
    `)
    .order("name")

  if (error) {
    throw new Error(`Error fetching pumps: ${error.message}`)
  }

  return data
}

export async function getPumpById(id: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("pumps")
    .select(`
      *,
      tank:tanks(id, name, fuel_type)
    `)
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(`Error fetching pump: ${error.message}`)
  }

  return data
}

export async function createPump(formData: FormData) {
  const supabase = getSupabaseServerClient()

  const name = formData.get("name") as string
  const tankId = formData.get("tank_id") as string

  // Get the fuel type from the tank
  const { data: tank, error: tankError } = await supabase.from("tanks").select("fuel_type").eq("id", tankId).single()

  if (tankError) {
    throw new Error(`Error fetching tank: ${tankError.message}`)
  }

  const { data, error } = await supabase
    .from("pumps")
    .insert({
      name,
      tank_id: tankId,
      fuel_type: tank.fuel_type,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating pump: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    action: "create",
    entity: "pumps",
    entity_id: data.id,
    details: { name, tank_id: tankId, fuel_type: tank.fuel_type },
  })

  revalidatePath("/admin/pumps")
  redirect("/admin/pumps")
}

export async function updatePump(id: string, formData: FormData) {
  const supabase = getSupabaseServerClient()

  const name = formData.get("name") as string
  const tankId = formData.get("tank_id") as string
  const isActive = formData.get("is_active") === "true"

  // Get the fuel type from the tank
  const { data: tank, error: tankError } = await supabase.from("tanks").select("fuel_type").eq("id", tankId).single()

  if (tankError) {
    throw new Error(`Error fetching tank: ${tankError.message}`)
  }

  const { data, error } = await supabase
    .from("pumps")
    .update({
      name,
      tank_id: tankId,
      fuel_type: tank.fuel_type,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(`Error updating pump: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    action: "update",
    entity: "pumps",
    entity_id: id,
    details: { name, tank_id: tankId, fuel_type: tank.fuel_type, is_active: isActive },
  })

  revalidatePath("/admin/pumps")
  redirect("/admin/pumps")
}

export async function deletePump(id: string) {
  const supabase = getSupabaseServerClient()

  // First check if there are any nozzles connected to this pump
  const { data: nozzles, error: nozzlesError } = await supabase.from("nozzles").select("id").eq("pump_id", id)

  if (nozzlesError) {
    throw new Error(`Error checking nozzles: ${nozzlesError.message}`)
  }

  if (nozzles && nozzles.length > 0) {
    throw new Error("Cannot delete pump with connected nozzles")
  }

  const { error } = await supabase.from("pumps").delete().eq("id", id)

  if (error) {
    throw new Error(`Error deleting pump: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    action: "delete",
    entity: "pumps",
    entity_id: id,
  })

  revalidatePath("/admin/pumps")
  redirect("/admin/pumps")
}

