"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function logAuditEvent(action: string, entity: string, entityId?: string, details?: any) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from("audit_logs").insert({
    user_id: user?.id,
    action,
    entity,
    entity_id: entityId,
    details,
    ip_address: "0.0.0.0", // In a real app, you'd get this from the request
  })

  if (error) {
    console.error("Error logging audit event:", error)
  }
}

