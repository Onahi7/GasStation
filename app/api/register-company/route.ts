import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import type { PrismaClient } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const { name, email, password, companyName, address, phone } = await req.json()

    if (!email || !password || !companyName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Check if company exists
    const existingCompany = await prisma.company.findFirst({
      where: { 
        OR: [
          { email },
          { name: companyName }
        ]
      }
    })

    if (existingCompany) {
      return NextResponse.json(
        { error: "Company already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 12)

    // Create company and admin user in a transaction
    const result = await prisma.$transaction(async (tx: PrismaClient) => {
      const company = await tx.company.create({
        data: {
          name: companyName,
          email,
          address,
          phone,
        },
      })

      const user = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: "COMPANY_ADMIN",
          companyId: company.id,
        },
      })

      return { company, user }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role
      }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Error creating company and user" },
      { status: 500 }
    )
  }
}
