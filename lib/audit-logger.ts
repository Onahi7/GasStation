"use server"

import { prisma } from "@/lib/prisma"
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
  entityId: string
  performedBy: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt?: Date
}

export class AuditLogger {
  private static async logEntry(entry: AuditLogEntry) {
    try {
      await prisma.auditLog.create({
        data: {
          action: entry.action,
          entity: entry.entity,
          entityId: entry.entityId,
          performedBy: entry.performedBy,
          details: entry.details as any, // Prisma will handle JSON serialization
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          createdAt: entry.createdAt || new Date()
        }
      })
    } catch (error) {
      console.error("Exception in audit logging:", error)
      this.logToFallback(entry, error)
    }
  }

  private static logToFallback(entry: AuditLogEntry, error: any) {
    // Log to file system or external logging service as fallback
    console.error("AUDIT LOG FALLBACK:", {
      ...entry,
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }

  static async logUserAction(
    action: z.infer<typeof AuditAction>,
    userId: string,
    details?: Record<string, any>
  ) {
    const headersList = headers()
    
    await this.logEntry({
      action,
      entity: "users",
      entityId: userId,
      performedBy: userId,
      details,
      ipAddress: headersList.get("x-forwarded-for") || undefined,
      userAgent: headersList.get("user-agent") || undefined
    })
  }

  static async getUserActivity(userId: string, options: {
    startDate?: Date
    endDate?: Date
    limit?: number
  } = {}) {
    const { startDate, endDate, limit = 100 } = options

    const logs = await prisma.auditLog.findMany({
      where: {
        performedBy: userId,
        ...(startDate && { createdAt: { gte: startDate } }),
        ...(endDate && { createdAt: { lte: endDate } })
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      include: {
        terminal: {
          select: {
            name: true
          }
        }
      }
    })

    // Group activities by date for better organization
    const groupedActivities = logs.reduce((groups: Record<string, any[]>, log) => {
      const date = log.createdAt.toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(log)
      return groups
    }, {})

    return groupedActivities
  }
}

