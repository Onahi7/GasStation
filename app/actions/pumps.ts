"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { withErrorHandling } from "@/lib/utils"
import { AuditLogger } from "@/lib/audit-logger"

export async function getPumps() {
  return withErrorHandling(async () => {
    const pumps = await prisma.pump.findMany({
      include: {
        tank: true
      },
      orderBy: {
        number: 'asc'
      }
    });
    
    return pumps;
  });
}

export async function getPumpById(id: string) {
  return withErrorHandling(async () => {
    const pump = await prisma.pump.findUnique({
      where: { id },
      include: {
        tank: true
      }
    });
    
    if (!pump) {
      throw new Error("Pump not found");
    }
    
    return pump;
  });
}

export async function createPump(formData: FormData) {
  return withErrorHandling(async () => {
    const number = parseInt(formData.get("number") as string);
    const tankId = formData.get("tankId") as string;
    const terminalId = formData.get("terminalId") as string;
    
    // Validate tank belongs to the terminal
    const tank = await prisma.tank.findFirst({
      where: {
        id: tankId,
        terminalId
      }
    });
    
    if (!tank) {
      throw new Error("Tank not found or does not belong to this terminal");
    }
    
    // Check if pump number already exists in this terminal
    const existingPump = await prisma.pump.findFirst({
      where: {
        number,
        terminalId
      }
    });
    
    if (existingPump) {
      throw new Error("Pump with this number already exists at this terminal");
    }
    
    const pump = await prisma.pump.create({
      data: {
        number,
        tankId,
        terminalId
      }
    });
    
    // Log audit entry
    await AuditLogger.log(
      "create",
      "pumps",
      pump.id,
      "system", // Replace with actual user ID if available
      { number, tankId, terminalId }
    );
    
    revalidatePath("/admin/pumps");
    return pump;
  });
}

export async function updatePump(id: string, formData: FormData) {
  return withErrorHandling(async () => {
    const tankId = formData.get("tankId") as string;
    
    // Validate pump exists
    const pump = await prisma.pump.findUnique({
      where: { id }
    });
    
    if (!pump) {
      throw new Error("Pump not found");
    }
    
    // Validate tank exists and belongs to same terminal
    const tank = await prisma.tank.findFirst({
      where: {
        id: tankId,
        terminalId: pump.terminalId
      }
    });
    
    if (!tank) {
      throw new Error("Tank not found or does not belong to this terminal");
    }
    
    const updatedPump = await prisma.pump.update({
      where: { id },
      data: {
        tankId
      }
    });
    
    // Log audit entry
    await AuditLogger.log(
      "update",
      "pumps",
      id,
      "system", // Replace with actual user ID if available
      { tankId }
    );
    
    revalidatePath("/admin/pumps");
    return updatedPump;
  });
}

export async function deletePump(id: string) {
  return withErrorHandling(async () => {
    // Check if pump has associated meter readings
    const readingCount = await prisma.meterReading.count({
      where: {
        pumpId: id
      }
    });
    
    if (readingCount > 0) {
      throw new Error("Cannot delete pump with associated meter readings.");
    }
    
    // Delete the pump
    await prisma.pump.delete({
      where: { id }
    });
    
    // Log audit entry
    await AuditLogger.log(
      "delete",
      "pumps",
      id,
      "system", // Replace with actual user ID if available
      {}
    );
    
    revalidatePath("/admin/pumps");
  });
}

