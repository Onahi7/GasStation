"use server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AuditAction } from "@/lib/types"
import type { z } from "zod"
import { headers } from "next/headers"

export type AuditEntity =
  | "users"
  | "companies"
  | "terminals"
  | "pumps"
  | "tanks"
  | "shifts"
  | "payments"
  | "expenses"
  | "meter_readings"
  | "stock"
  | "prices"
  | "cash_handovers"
  | "deliveries"

export interface AuditLogEntry {
  action: z.infer<typeof AuditAction>
  entity: AuditEntity
  entity_id: string
  performed_by: string
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at?: string
}

export class AuditLogger {
  private static async logEntry(entry: AuditLogEntry) {
    const supabase = await getSupabaseServerClient()
    
    try {
      const { error } = await supabase.from("audit_logs").insert({
        ...entry,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error logging audit entry:", error)
        // Fallback logging to ensure we don't lose audit data
        this.logToFallback(entry, error)
      }
    } catch (error) {
      console.error("Exception in audit logging:", error)
      this.logToFallback(entry, error)
    }
  }

  private static logToFallback(entry: AuditLogEntry, error: any) {
    // Implement fallback logging (could be file-based or another backup mechanism)
    console.error("AUDIT LOG FALLBACK:", {
      ...entry,
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }

  static async log(
    action: z.infer<typeof AuditAction>,
    entityType: string,
    entityId: string,
    userId: string,
    details?: any,
    terminalId?: string
  ) {
    const supabase = await getSupabaseServerClient()
    const headersList = await headers()
    
    // Get client IP if available
    const forwardedFor = headersList.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : null
    
    const logEntry = {
      terminal_id: terminalId,
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      ip_address: ip,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from("audit_logs")
      .insert(logEntry)

    if (error) {
      console.error("Error creating audit log:", error)
      // Don't throw error to prevent disrupting the main operation
    }
  }

  static async getRecentLogs(
    options: {
      entity?: AuditEntity
      entityId?: string
      performedBy?: string
      action?: z.infer<typeof AuditAction>
      limit?: number
      offset?: number
    } = {}
  ) {
    const supabase = await getSupabaseServerClient()
    const { entity, entityId, performedBy, action, limit = 50, offset = 0 } = options

    let query = supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (entity) {
      query = query.eq("entity", entity)
    }
    if (entityId) {
      query = query.eq("entity_id", entityId)
    }
    if (performedBy) {
      query = query.eq("performed_by", performedBy)
    }
    if (action) {
      query = query.eq("action", action)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching audit logs:", error)
      throw error
    }

    return data
  }

  static async searchLogs(
    params: {
      searchTerm?: string
      startDate?: Date
      endDate?: Date
      entityType?: string
      action?: z.infer<typeof AuditAction>
      userId?: string
      terminalId?: string
      limit?: number
      offset?: number
    }
  ) {
    const supabase = await getSupabaseServerClient()
    const {
      searchTerm,
      startDate,
      endDate,
      entityType,
      action,
      userId,
      terminalId,
      limit = 50,
      offset = 0
    } = params

    let query = supabase
      .from("audit_logs")
      .select(`
        id,
        terminal_id,
        user_id,
        action,
        entity_type,
        entity_id,
        details,
        ip_address,
        created_at,
        users:user_id (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (searchTerm) {
      query = query.or(`
        entity_id.ilike.%${searchTerm}%,
        details->>'description'.ilike.%${searchTerm}%,
        users.full_name.ilike.%${searchTerm}%,
        users.email.ilike.%${searchTerm}%
      `)
    }

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString())
    }

    if (endDate) {
      query = query.lte('created_at', endDate.toISOString())
    }

    if (entityType) {
      query = query.eq('entity_type', entityType)
    }

    if (action) {
      query = query.eq('action', action)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (terminalId) {
      query = query.eq('terminal_id', terminalId)
    }

    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error("Error searching audit logs:", error)
      throw error
    }

    return {
      logs: data,
      total: count || 0
    }
  }

  static async getAuditLogs(options: {
    terminalId?: string
    userId?: string
    entityType?: string
    entityId?: string
    action?: string
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
  }) {
    const supabase = await getSupabaseServerClient()
    const {
      terminalId,
      userId,
      entityType,
      entityId,
      action,
      startDate,
      endDate,
      limit = 50,
      offset = 0,
    } = options

    let query = supabase
      .from("audit_logs")
      .select(`
        *,
        user:users(full_name, email),
        terminal:terminals(name)
      `)
      .order("created_at", { ascending: false })

    if (terminalId) {
      query = query.eq("terminal_id", terminalId)
    }
    if (userId) {
      query = query.eq("user_id", userId)
    }
    if (entityType) {
      query = query.eq("entity_type", entityType)
    }
    if (entityId) {
      query = query.eq("entity_id", entityId)
    }
    if (action) {
      query = query.eq("action", action)
    }
    if (startDate) {
      query = query.gte("created_at", startDate.toISOString())
    }
    if (endDate) {
      query = query.lte("created_at", endDate.toISOString())
    }

    // Get total count for pagination
    const { count } = await supabase
      .from("audit_logs")
      .select("*", { count: "exact", head: true })
      .eq(terminalId ? "terminal_id" : "id", terminalId || "")

    // Get paginated results
    const { data, error } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return {
      logs: data || [],
      total: count || 0,
      hasMore: (count || 0) > offset + limit,
    }
  }

  static async getEntityHistory(
    entityType: string,
    entityId: string,
    limit: number = 20
  ) {
    const supabase = await getSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("audit_logs")
      .select(`
        id,
        terminal_id,
        user_id,
        action,
        entity_type,
        entity_id,
        details,
        ip_address,
        created_at,
        users:user_id (
          full_name,
          email
        )
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching entity history:", error)
      throw error
    }

    return data
  }

  static async getUserActivity(userId: string, options: {
    startDate?: Date
    endDate?: Date
    limit?: number
  } = {}) {
    const { startDate, endDate, limit = 100 } = options
    const supabase = await getSupabaseServerClient()

    let query = supabase
      .from("audit_logs")
      .select(`
        *,
        terminal:terminals(name)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (startDate) {
      query = query.gte("created_at", startDate.toISOString())
    }
    if (endDate) {
      query = query.lte("created_at", endDate.toISOString())
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    // Group activities by date for better organization
    const groupedActivities = (data || []).reduce((groups: any, log: any) => {
      const date = new Date(log.created_at).toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(log)
      return groups
    }, {})

    return groupedActivities
  }

  static async getTerminalActivity(terminalId: string, options: {
    startDate?: Date
    endDate?: Date
    entityTypes?: string[]
    limit?: number
  } = {}) {
    const { startDate, endDate, entityTypes, limit = 100 } = options
    const supabase = await getSupabaseServerClient()

    let query = supabase
      .from("audit_logs")
      .select(`
        *,
        user:users(full_name)
      `)
      .eq("terminal_id", terminalId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (startDate) {
      query = query.gte("created_at", startDate.toISOString())
    }
    if (endDate) {
      query = query.lte("created_at", endDate.toISOString())
    }
    if (entityTypes && entityTypes.length > 0) {
      query = query.in("entity_type", entityTypes)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    // Group activities by type for analysis
    const activitySummary = (data || []).reduce((summary: any, log: any) => {
      if (!summary[log.entity_type]) {
        summary[log.entity_type] = {
          count: 0,
          actions: {}
        }
      }
      summary[log.entity_type].count++
      
      if (!summary[log.entity_type].actions[log.action]) {
        summary[log.entity_type].actions[log.action] = 0
      }
      summary[log.entity_type].actions[log.action]++

      return summary
    }, {})

    return {
      logs: data || [],
      summary: activitySummary
    }
  }

  static async getDailyActivitySummary(
    terminalId: string,
    date: Date
  ) {
    const supabase = await getSupabaseServerClient()
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
      .from("audit_logs")
      .select('action, entity_type, count(*)')
      .eq('terminal_id', terminalId)
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString())

    if (error) {
      console.error("Error fetching daily activity summary:", error)
      throw error
    }

    return data
  }

  static async getAnomalies(
    terminalId: string,
    startDate: Date,
    endDate: Date
  ) {
    const supabase = await getSupabaseServerClient()
    
    // Get unusual patterns like:
    // - Multiple failed login attempts
    // - Unusual transaction volumes
    // - Off-hours activities
    // - Multiple price changes
    // - Frequent cash discrepancies
    
    const { data, error } = await supabase
      .from("audit_logs")
      .select(`
        id,
        terminal_id,
        user_id,
        action,
        entity_type,
        entity_id,
        details,
        ip_address,
        created_at,
        users:user_id (
          full_name,
          email
        )
      `)
      .eq('terminal_id', terminalId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .or(`
        and(action.eq.login,details->>'failed'.eq.true),
        and(action.eq.price_change),
        and(action.eq.cash_handover,details->>'discrepancy'.gt.0),
        and(action.eq.meter_reading,details->>'discrepancy'.gt.0)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching anomalies:", error)
      throw error
    }

    return data
  }
}

