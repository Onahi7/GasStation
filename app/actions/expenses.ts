"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { withErrorHandling } from "@/lib/utils"
import { AuditLogger } from "@/lib/audit-logger"

export async function getDailyExpenses(date?: string, terminalId?: string) {
  return withErrorHandling(async () => {
    const expenses = await prisma.expense.findMany({
      where: {
        ...(date && {
          createdAt: {
            gte: new Date(date),
            lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
          }
        }),
        ...(terminalId && { terminalId })
      },
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return expenses;
  });
}

export async function getDailyExpenseById(id: string) {
  return withErrorHandling(async () => {
    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        user: true
      }
    });
    
    if (!expense) {
      throw new Error("Expense not found");
    }
    
    return expense;
  });
}

export async function createDailyExpense(formData: FormData) {
  return withErrorHandling(async () => {
    const userId = formData.get("userId") as string;
    const terminalId = formData.get("terminalId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const description = formData.get("description") as string;
    
    // Validate the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new Error("User not found");
    }
    
    const expenseData = {
      userId,
      terminalId,
      amount,
      description,
      approved: false
    };
    
    const expense = await prisma.expense.create({
      data: expenseData
    });
    
    // Log audit entry
    await AuditLogger.log(
      "create",
      "expenses",
      expense.id,
      userId,
      { amount, description }
    );
    
    revalidatePath("/finance");
    return expense;
  });
}

export async function approveExpense(id: string, formData: FormData) {
  return withErrorHandling(async () => {
    const approverId = formData.get("approverId") as string;
    const notes = formData.get("notes") as string;
    
    // Validate the approver exists
    const approver = await prisma.user.findUnique({
      where: { id: approverId }
    });
    
    if (!approver) {
      throw new Error("Approver not found");
    }
    
    // Validate the expense exists
    const expense = await prisma.expense.findUnique({
      where: { id }
    });
    
    if (!expense) {
      throw new Error("Expense not found");
    }
    
    if (expense.approved) {
      throw new Error("Expense already approved");
    }
    
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        approved: true,
        approvedBy: approverId,
        description: notes ? `${expense.description}\n\nApproval notes: ${notes}` : expense.description
      }
    });
    
    // Log audit entry
    await AuditLogger.log(
      "approve",
      "expenses",
      id,
      approverId,
      { notes }
    );
    
    revalidatePath("/finance");
    redirect("/finance");
  });
}

export async function rejectExpense(id: string, formData: FormData) {
  return withErrorHandling(async () => {
    const reviewerId = formData.get("reviewerId") as string;
    const reason = formData.get("reason") as string;
    
    // Validate the expense exists
    const expense = await prisma.expense.findUnique({
      where: { id }
    });
    
    if (!expense) {
      throw new Error("Expense not found");
    }
    
    if (expense.approved) {
      throw new Error("Cannot reject an already approved expense");
    }
    
    // Delete the expense or mark it as rejected
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        description: `${expense.description}\n\nRejected: ${reason}`,
        // Consider adding a status field to the Expense model in Prisma schema
        // status: "rejected"
      }
    });
    
    // Log audit entry
    await AuditLogger.log(
      "reject",
      "expenses",
      id,
      reviewerId,
      { reason }
    );
    
    revalidatePath("/finance");
    redirect("/finance");
  });
}

