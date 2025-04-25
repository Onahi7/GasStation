-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'AUDITOR', 'FINANCE', 'CASHIER', 'WORKER', 'DRIVER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'WORKER',
    "companyId" TEXT,
    "terminalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Terminal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Terminal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pump" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "terminalId" TEXT NOT NULL,
    "tankId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pump_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tank" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "capacity" DOUBLE PRECISION NOT NULL,
    "terminalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeterReading" (
    "id" TEXT NOT NULL,
    "opening" DOUBLE PRECISION NOT NULL,
    "closing" DOUBLE PRECISION NOT NULL,
    "pumpId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "terminalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeterReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "terminalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashHandover" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "terminalId" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashHandover_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "terminalId" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectronicPayment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "referenceNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "userId" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "terminalId" TEXT NOT NULL,
    "verifiedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectronicPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashSubmission" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "terminalId" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "terminalId" TEXT,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "terminalId" TEXT NOT NULL,
    "position" TEXT,
    "hireDate" TIMESTAMP(3) NOT NULL,
    "terminationDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeSalary" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "baseSalary" DOUBLE PRECISION NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeSalary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryAdjustment" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "adjustmentType" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "referenceId" TEXT,
    "referenceType" TEXT,
    "adjustedBy" TEXT NOT NULL,
    "adjustmentDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_companyId_idx" ON "User"("companyId");

-- CreateIndex
CREATE INDEX "User_terminalId_idx" ON "User"("terminalId");

-- CreateIndex
CREATE INDEX "Terminal_companyId_idx" ON "Terminal"("companyId");

-- CreateIndex
CREATE INDEX "MeterReading_pumpId_idx" ON "MeterReading"("pumpId");

-- CreateIndex
CREATE INDEX "MeterReading_userId_idx" ON "MeterReading"("userId");

-- CreateIndex
CREATE INDEX "MeterReading_shiftId_idx" ON "MeterReading"("shiftId");

-- CreateIndex
CREATE INDEX "MeterReading_terminalId_idx" ON "MeterReading"("terminalId");

-- CreateIndex
CREATE INDEX "Shift_userId_idx" ON "Shift"("userId");

-- CreateIndex
CREATE INDEX "Shift_terminalId_idx" ON "Shift"("terminalId");

-- CreateIndex
CREATE INDEX "CashHandover_userId_idx" ON "CashHandover"("userId");

-- CreateIndex
CREATE INDEX "CashHandover_shiftId_idx" ON "CashHandover"("shiftId");

-- CreateIndex
CREATE INDEX "CashHandover_terminalId_idx" ON "CashHandover"("terminalId");

-- CreateIndex
CREATE INDEX "Expense_userId_idx" ON "Expense"("userId");

-- CreateIndex
CREATE INDEX "Expense_terminalId_idx" ON "Expense"("terminalId");

-- CreateIndex
CREATE UNIQUE INDEX "ElectronicPayment_referenceNumber_key" ON "ElectronicPayment"("referenceNumber");

-- CreateIndex
CREATE INDEX "ElectronicPayment_userId_idx" ON "ElectronicPayment"("userId");

-- CreateIndex
CREATE INDEX "ElectronicPayment_shiftId_idx" ON "ElectronicPayment"("shiftId");

-- CreateIndex
CREATE INDEX "ElectronicPayment_terminalId_idx" ON "ElectronicPayment"("terminalId");

-- CreateIndex
CREATE INDEX "CashSubmission_userId_idx" ON "CashSubmission"("userId");

-- CreateIndex
CREATE INDEX "CashSubmission_shiftId_idx" ON "CashSubmission"("shiftId");

-- CreateIndex
CREATE INDEX "CashSubmission_terminalId_idx" ON "CashSubmission"("terminalId");

-- CreateIndex
CREATE INDEX "AuditLog_performedBy_idx" ON "AuditLog"("performedBy");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");

-- CreateIndex
CREATE INDEX "Employee_userId_idx" ON "Employee"("userId");

-- CreateIndex
CREATE INDEX "Employee_terminalId_idx" ON "Employee"("terminalId");

-- CreateIndex
CREATE INDEX "EmployeeSalary_employeeId_idx" ON "EmployeeSalary"("employeeId");

-- CreateIndex
CREATE INDEX "SalaryAdjustment_employeeId_idx" ON "SalaryAdjustment"("employeeId");

-- CreateIndex
CREATE INDEX "SalaryAdjustment_adjustedBy_idx" ON "SalaryAdjustment"("adjustedBy");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_terminalId_fkey" FOREIGN KEY ("terminalId") REFERENCES "Terminal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Terminal" ADD CONSTRAINT "Terminal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pump" ADD CONSTRAINT "Pump_terminalId_fkey" FOREIGN KEY ("terminalId") REFERENCES "Terminal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pump" ADD CONSTRAINT "Pump_tankId_fkey" FOREIGN KEY ("tankId") REFERENCES "Tank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tank" ADD CONSTRAINT "Tank_terminalId_fkey" FOREIGN KEY ("terminalId") REFERENCES "Terminal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeterReading" ADD CONSTRAINT "MeterReading_pumpId_fkey" FOREIGN KEY ("pumpId") REFERENCES "Pump"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeterReading" ADD CONSTRAINT "MeterReading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeterReading" ADD CONSTRAINT "MeterReading_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeterReading" ADD CONSTRAINT "MeterReading_terminalId_fkey" FOREIGN KEY ("terminalId") REFERENCES "Terminal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_terminalId_fkey" FOREIGN KEY ("terminalId") REFERENCES "Terminal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashHandover" ADD CONSTRAINT "CashHandover_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashHandover" ADD CONSTRAINT "CashHandover_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashHandover" ADD CONSTRAINT "CashHandover_terminalId_fkey" FOREIGN KEY ("terminalId") REFERENCES "Terminal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_terminalId_fkey" FOREIGN KEY ("terminalId") REFERENCES "Terminal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectronicPayment" ADD CONSTRAINT "ElectronicPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectronicPayment" ADD CONSTRAINT "ElectronicPayment_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectronicPayment" ADD CONSTRAINT "ElectronicPayment_terminalId_fkey" FOREIGN KEY ("terminalId") REFERENCES "Terminal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashSubmission" ADD CONSTRAINT "CashSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashSubmission" ADD CONSTRAINT "CashSubmission_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashSubmission" ADD CONSTRAINT "CashSubmission_terminalId_fkey" FOREIGN KEY ("terminalId") REFERENCES "Terminal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_terminalId_fkey" FOREIGN KEY ("terminalId") REFERENCES "Terminal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_terminalId_fkey" FOREIGN KEY ("terminalId") REFERENCES "Terminal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSalary" ADD CONSTRAINT "EmployeeSalary_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryAdjustment" ADD CONSTRAINT "SalaryAdjustment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryAdjustment" ADD CONSTRAINT "SalaryAdjustment_adjustedBy_fkey" FOREIGN KEY ("adjustedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
