"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

interface CreateTerminalParams {
  name: string
  location?: string
  address?: string
  companyId: string
}

export async function createTerminal(params: CreateTerminalParams) {
  const terminal = await prisma.terminal.create({
    data: {
      name: params.name,
      companyId: params.companyId,
      // Only include optional fields if they are provided
      ...(params.location && { location: params.location }),
      ...(params.address && { address: params.address })
    }
  })

  revalidatePath("/company-admin/terminals")
  return terminal
}

export async function getTerminals(companyId: string) {
  return prisma.terminal.findMany({
    where: { companyId },
    orderBy: { name: 'asc' }
  })
}

export async function getTerminalDetails(terminalId: string) {
  return prisma.terminal.findUnique({
    where: { id: terminalId },
    include: {
      tanks: true,
      pumps: {
        include: {
          tank: true,
          _count: {
            select: {
              meterReadings: true
            }
          }
        }
      },
      _count: {
        select: {
          users: true,
          shifts: true,
          cashHandovers: true,
          expenses: true,
          electronicPayments: true,
          cashSubmissions: true
        }
      }
    }
  });
}

export async function updateTerminalStatus(terminalId: string, isActive: boolean) {
  await prisma.terminal.update({
    where: { id: terminalId },
    data: { isActive }
  });
  
  revalidatePath("/company-admin/terminals");
}

export async function getTerminalSummaryMetrics(terminalId: string, period: "day" | "week" | "month" = "day") {
  // Get date range based on period
  const now = new Date();
  let startDate = new Date();
  
  if (period === "day") {
    startDate.setHours(0, 0, 0, 0);
  } else if (period === "week") {
    startDate.setDate(now.getDate() - 7);
  } else if (period === "month") {
    startDate.setMonth(now.getMonth() - 1);
  }

  // Get shift statistics
  const shifts = await prisma.shift.count({
    where: {
      terminalId,
      startTime: {
        gte: startDate
      }
    }
  });
  
  // Get cash handover metrics
  const cashMetrics = await prisma.cashHandover.aggregate({
    where: {
      terminalId,
      createdAt: {
        gte: startDate
      }
    },
    _sum: {
      amount: true
    },
    _count: true
  });
  
  // Get electronic payment metrics
  const electronicMetrics = await prisma.electronicPayment.aggregate({
    where: {
      terminalId,
      createdAt: {
        gte: startDate
      }
    },
    _sum: {
      amount: true
    },
    _count: true
  });
  
  // Get expense metrics
  const expenseMetrics = await prisma.expense.aggregate({
    where: {
      terminalId,
      createdAt: {
        gte: startDate
      }
    },
    _sum: {
      amount: true
    },
    _count: true
  });
  
  return {
    period,
    shifts,
    totalSales: (cashMetrics._sum.amount || 0) + (electronicMetrics._sum.amount || 0),
    cashSales: cashMetrics._sum.amount || 0,
    electronicSales: electronicMetrics._sum.amount || 0,
    expenses: expenseMetrics._sum.amount || 0,
    cashCount: cashMetrics._count,
    electronicCount: electronicMetrics._count,
    expenseCount: expenseMetrics._count
  };
}
