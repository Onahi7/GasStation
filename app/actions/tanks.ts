"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { withErrorHandling } from "@/lib/utils"
import { AuditLogger } from "@/lib/audit-logger"

export async function getTanks() {
  return withErrorHandling(async () => {
    const tanks = await prisma.tank.findMany({
      orderBy: {
        number: 'asc'
      }
    });
    
    return tanks;
  });
}

export async function getTankById(id: string) {
  return withErrorHandling(async () => {
    const tank = await prisma.tank.findUnique({
      where: { id }
    });
    
    if (!tank) {
      throw new Error("Tank not found");
    }
    
    return tank;
  });
}

export async function createTank(formData: FormData) {
  return withErrorHandling(async () => {
    const number = parseInt(formData.get("number") as string);
    const capacity = parseFloat(formData.get("capacity") as string);
    const terminalId = formData.get("terminalId") as string;
    
    // Validate terminal exists
    const terminal = await prisma.terminal.findUnique({
      where: { id: terminalId }
    });
    
    if (!terminal) {
      throw new Error("Terminal not found");
    }
    
    // Check if tank number already exists in this terminal
    const existingTank = await prisma.tank.findFirst({
      where: {
        number,
        terminalId
      }
    });
    
    if (existingTank) {
      throw new Error("Tank with this number already exists at this terminal");
    }
    
    const tank = await prisma.tank.create({
      data: {
        number,
        capacity,
        terminalId
      }
    });
    
    // Log audit entry
    await AuditLogger.log(
      "create",
      "tanks",
      tank.id,
      "system", // Replace with actual user ID if available
      { number, capacity, terminalId }
    );
    
    revalidatePath("/admin/tanks");
    return tank;
  });
}

export async function updateTank(id: string, formData: FormData) {
  return withErrorHandling(async () => {
    const capacity = parseFloat(formData.get("capacity") as string);
    
    // Validate tank exists
    const tank = await prisma.tank.findUnique({
      where: { id }
    });
    
    if (!tank) {
      throw new Error("Tank not found");
    }
    
    const updatedTank = await prisma.tank.update({
      where: { id },
      data: {
        capacity
      }
    });
    
    // Log audit entry
    await AuditLogger.log(
      "update",
      "tanks",
      id,
      "system", // Replace with actual user ID if available
      { capacity }
    );
    
    revalidatePath("/admin/tanks");
    return updatedTank;
  });
}

export async function deleteTank(id: string) {
  return withErrorHandling(async () => {
    // Check if tank has associated pumps
    const pumpCount = await prisma.pump.count({
      where: {
        tankId: id
      }
    });
    
    if (pumpCount > 0) {
      throw new Error("Cannot delete tank with associated pumps. Remove pumps first.");
    }
    
    // Delete the tank
    await prisma.tank.delete({
      where: { id }
    });
    
    // Log audit entry
    await AuditLogger.log(
      "delete",
      "tanks",
      id,
      "system", // Replace with actual user ID if available
      {}
    );
    
    revalidatePath("/admin/tanks");
  });
}

