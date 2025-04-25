"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { withErrorHandling } from "@/lib/utils"
import { AuditLogger } from "@/lib/audit-logger"

export async function getDrivers(companyId: string) {
  return withErrorHandling(async () => {
    const drivers = await prisma.user.findMany({
      where: {
        companyId,
        role: "DRIVER"
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    
    return drivers;
  });
}

export async function createDeliveryWaybill(formData: FormData) {
  return withErrorHandling(async () => {
    const driverId = formData.get("driverId") as string;
    const terminalId = formData.get("terminalId") as string;
    const waybillNumber = formData.get("waybillNumber") as string;
    const expectedVolume = parseFloat(formData.get("expectedVolume") as string);
    
    // Validate driver exists
    const driver = await prisma.user.findUnique({
      where: {
        id: driverId,
        role: "DRIVER"
      }
    });
    
    if (!driver) {
      throw new Error("Driver not found");
    }
    
    // Validate terminal exists
    const terminal = await prisma.terminal.findUnique({
      where: { id: terminalId }
    });
    
    if (!terminal) {
      throw new Error("Terminal not found");
    }
    
    // Create delivery waybill record
    // Note: We need to add this model to Prisma schema
    const waybill = await prisma.deliveryWaybill.create({
      data: {
        driverId,
        terminalId,
        waybillNumber,
        expectedVolume,
        status: "pending"
      }
    });
    
    // Log audit entry
    await AuditLogger.log(
      "create",
      "delivery_waybills",
      waybill.id,
      driverId,
      { waybillNumber, expectedVolume, terminalId }
    );
    
    revalidatePath("/manager/deliveries");
    return waybill;
  });
}

export async function updateDeliveryStatus(id: string, formData: FormData) {
  return withErrorHandling(async () => {
    const status = formData.get("status") as string;
    const deliveredVolume = parseFloat(formData.get("deliveredVolume") as string);
    const reviewerId = formData.get("reviewerId") as string;
    
    // Validate waybill exists
    const waybill = await prisma.deliveryWaybill.findUnique({
      where: { id }
    });
    
    if (!waybill) {
      throw new Error("Delivery waybill not found");
    }
    
    // Update the waybill status
    const updatedWaybill = await prisma.deliveryWaybill.update({
      where: { id },
      data: {
        status,
        deliveredVolume: status === "delivered" ? deliveredVolume : undefined,
        arrivalTime: status === "delivered" ? new Date() : undefined
      }
    });
    
    // If there's a volume discrepancy, create a salary adjustment
    if (status === "delivered" && deliveredVolume) {
      const discrepancy = deliveredVolume - waybill.expectedVolume;
      if (Math.abs(discrepancy) > 0) {
        // Note: We need to add this model to Prisma schema
        await prisma.salaryAdjustment.create({
          data: {
            employeeId: waybill.driverId,
            amount: Math.abs(discrepancy),
            adjustmentType: discrepancy < 0 ? "shortage" : "excess",
            reason: `Volume ${discrepancy < 0 ? "shortage" : "excess"} for delivery ${id}`,
            referenceId: id,
            referenceType: "delivery",
            adjustedBy: reviewerId,
            adjustmentDate: new Date()
          }
        });
      }
    }
    
    // Log audit entry
    await AuditLogger.log(
      "update",
      "delivery_waybills",
      id,
      reviewerId,
      { status, deliveredVolume }
    );
    
    revalidatePath("/manager/deliveries");
    return updatedWaybill;
  });
}

export async function getDeliveryWaybills(companyId: string, status?: string) {
  return withErrorHandling(async () => {
    const waybills = await prisma.deliveryWaybill.findMany({
      where: {
        terminal: {
          companyId
        },
        ...(status && { status })
      },
      include: {
        driver: {
          select: {
            name: true
          }
        },
        terminal: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return waybills;
  });
}