import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Maintain active SSE connections
const clients = new Map()

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  }

  const stream = new ReadableStream({
    async start(controller) {
      const clientId = crypto.randomUUID()
      clients.set(clientId, controller)

      // Function to send updates based on user role
      const sendUpdate = async () => {
        try {
          let data
          switch (session.user.role) {
            case "WORKER":
              data = await getWorkerUpdates(session.user.id)
              break
            case "MANAGER":
              data = await getManagerUpdates(session.user.terminalId)
              break
            case "CASHIER":
              data = await getCashierUpdates(session.user.terminalId)
              break
            case "ADMIN":
              data = await getAdminUpdates()
              break
          }

          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
        } catch (error) {
          console.error("Error sending update:", error)
        }
      }

      // Send initial data
      await sendUpdate()

      // Set up interval for periodic updates
      const intervalId = setInterval(sendUpdate, 5000)

      // Clean up on connection close
      request.signal.addEventListener("abort", () => {
        clearInterval(intervalId)
        clients.delete(clientId)
      })
    }
  })

  return new Response(stream, { headers })
}

// Role-specific update functions
async function getWorkerUpdates(userId: string) {
  const [shift, readings, sales] = await Promise.all([
    prisma.shift.findFirst({
      where: { userId, status: "ACTIVE" },
    }),
    prisma.meterReading.findMany({
      where: { userId, createdAt: { gte: new Date().setHours(0, 0, 0, 0) } },
    }),
    prisma.sale.findMany({
      where: { userId, createdAt: { gte: new Date().setHours(0, 0, 0, 0) } },
    }),
  ])

  return { shift, readings, sales }
}

async function getManagerUpdates(terminalId: string) {
  const [activeShifts, todaySales, tankLevels] = await Promise.all([
    prisma.shift.count({
      where: { terminalId, status: "ACTIVE" },
    }),
    prisma.sale.aggregate({
      where: {
        terminalId,
        createdAt: { gte: new Date().setHours(0, 0, 0, 0) },
      },
      _sum: { amount: true },
    }),
    prisma.tank.findMany({
      where: { terminalId },
      select: { currentLevel: true, capacity: true },
    }),
  ])

  return { activeShifts, todaySales, tankLevels }
}

async function getCashierUpdates(terminalId: string) {
  const [pendingSubmissions, todayTotal] = await Promise.all([
    prisma.cashSubmission.count({
      where: {
        terminalId,
        status: "PENDING",
      },
    }),
    prisma.cashSubmission.aggregate({
      where: {
        terminalId,
        createdAt: { gte: new Date().setHours(0, 0, 0, 0) },
      },
      _sum: { amount: true },
    }),
  ])

  return { pendingSubmissions, todayTotal }
}

async function getAdminUpdates() {
  const [companies, terminals, users] = await Promise.all([
    prisma.company.count(),
    prisma.terminal.count(),
    prisma.user.count(),
  ])

  return { companies, terminals, users }
}
