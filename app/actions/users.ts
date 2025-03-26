"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getUsers() {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.from("users").select("*").order("full_name")

  if (error) {
    throw new Error(`Error fetching users: ${error.message}`)
  }

  return data
}

export async function getUserById(id: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) {
    throw new Error(`Error fetching user: ${error.message}`)
  }

  return data
}

export async function updateUser(id: string, formData: FormData) {
  const supabase = getSupabaseServerClient()

  const fullName = formData.get("full_name") as string
  const phone = formData.get("phone") as string
  const role = formData.get("role") as "admin" | "manager" | "finance" | "worker" | "auditor"
  const isActive = formData.get("is_active") === "true"

  const { data, error } = await supabase
    .from("users")
    .update({
      full_name: fullName,
      phone,
      role,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(`Error updating user: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    action: "update",
    entity: "users",
    entity_id: id,
    details: { full_name: fullName, role, is_active: isActive },
  })

  revalidatePath("/admin/users")
  redirect("/admin/users")
}

export async function deactivateUser(id: string) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from("users")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(`Error deactivating user: ${error.message}`)
  }

  // Log the action
  await supabase.from("audit_logs").insert({
    action: "deactivate",
    entity: "users",
    entity_id: id,
  })

  revalidatePath("/admin/users")
  redirect("/admin/users")
}

export async function resetUserPassword(id: string, formData: FormData) {
  const supabase = getSupabaseServerClient()

  const password = formData.get("password") as string

  // This requires admin privileges in Supabase
  const { error } = await supabase.auth.admin.updateUserById(id, { password })

  if (error) {
    throw new Error(`Error resetting password: ${error.message}`)
  }

  // Log the action (without the password)
  await supabase.from("audit_logs").insert({
    action: "reset_password",
    entity: "users",
    entity_id: id,
  })

  revalidatePath("/admin/users")
  redirect("/admin/users")
}

