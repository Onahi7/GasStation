"use server"

import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import type { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const role = formData.get("role") as string || "WORKER"
  const companyId = formData.get("companyId") as string | null

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "User already exists" }
    }

    // Hash the password
    const hashedPassword = await hash(password, 12)

    // Create the user
    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
        companyId,
      },
    })

    revalidatePath("/login")
    redirect("/login?registered=true")
  } catch (error) {
    return { error: "Error creating user" }
  }
}

export async function registerCompany(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const companyName = formData.get("companyName") as string
  const address = formData.get("address") as string
  const phone = formData.get("phone") as string

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "User already exists" }
    }

    // Hash the password
    const hashedPassword = await hash(password, 12)

    // Create company and admin user in a transaction
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create the company
      const company = await tx.company.create({
        data: {
          name: companyName,
          address,
          phone,
          email,
        },
      })

      // Create the company admin user
      await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: "COMPANY_ADMIN",
          companyId: company.id,
        },
      })
    })

    revalidatePath("/login")
    redirect("/login?registered=true")
  } catch (error) {
    return { error: "Error creating company and user" }
  }
}

export async function getUserRole() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      companyId: true
    }
  })
  
  if (!user) return null

  return {
    ...user,
    isCompanyAdmin: user.role === "COMPANY_ADMIN"
  }
}

