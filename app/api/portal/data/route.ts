import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { UserRole } from "@prisma/client"

// Type for portal data handlers
type PortalDataHandler = {
  [K in UserRole]: () => Promise<any>
}

// Handler functions for different roles
const portalDataHandlers: PortalDataHandler = {
  ADMIN: async () => {
    const companies = await prisma.company.count()
    const terminals = await prisma.terminal.count()
    const users = await prisma.user.count()
    
    return {
      stats: {
        companies,
        terminals,
        users,
        systemHealth: "98%"
      }
    }
  },
  
  MANAGER: async () => {
    // Will be implemented with actual terminal stats
    return {
      stats: {
        activeWorkers: 12,
        todayRevenue: 1245000,
        tankLevels: "75%",
        performance: "92%"
      }
    }
  },
  
  CASHIER: async () => {
    // Will be implemented with actual cash handling stats
    return {
      stats: {
        cashOnHand: 580000,
        cardPayments: 245000,
        pendingSubmissions: 3,
        dailyTransactions: 85
      }
    }
  },
  
  WORKER: async () => {
    // Will be implemented with actual worker stats
    return {
      stats: {
        currentShift: "08:00 - 16:00",
        meterReadings: 12450,
        sales: 245000,
        performance: "95%"
      }
    }
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const handler = portalDataHandlers[session.user.role]
    if (!handler) {
      throw new Error("Invalid role")
    }

    const data = await handler()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Portal data error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
