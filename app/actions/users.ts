"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

// Convert Prisma User to UI User
function adaptUser(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    terminalId: user.terminalId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

export async function getUsers(companyId?: string) {
  const users = await prisma.user.findMany({
    where: companyId ? { companyId } : {},
    orderBy: { name: "asc" },
  })
  return users.map(adaptUser)
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } })
  return user ? adaptUser(user) : null
}

export async function createUser({
  name,
  email,
  password,
  role = UserRole.COMPANY_ADMIN,
  companyId,
  terminalId,
}: {
  name: string
  email: string
  password: string
  role?: UserRole
  companyId?: string
  terminalId?: string
}) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      companyId,
      terminalId
    },
  })
  revalidatePath("/company-admin/users")
  return adaptUser(user)
}

export async function updateUser(
  id: string,
  data: { name?: string; role?: UserRole; terminalId?: string }
) {
  const user = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      role: data.role,
      terminalId: data.terminalId
    },
  })
  revalidatePath("/company-admin/users")
  return adaptUser(user)
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } })
  revalidatePath("/company-admin/users")
}

export async function resetUserPassword(id: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  })
  revalidatePath("/company-admin/users")
  return adaptUser(user)
}

