import { z } from "zod"

// Base schemas
export const IdSchema = z.string().uuid()
export const EmailSchema = z.string().email()
export const PhoneSchema = z.string().regex(/^(\+234|0)[789][01]\d{8}$/, "Invalid phone number")
export const DateSchema = z.coerce.date()
export const PriceSchema = z.number().positive().max(100000)
export const AmountSchema = z.number().positive().max(10000000)

// Enums
export const UserRole = z.enum(["admin", "manager", "finance", "worker", "auditor", "cashier"])
export const FuelType = z.enum(["PMS", "AGO", "DPK"])
export const TransactionType = z.enum(["sale", "purchase", "adjustment", "credit_payment"])
export const PaymentMethod = z.enum(["cash", "credit", "bank_transfer", "mobile_money"])
export const VerificationStatus = z.enum(["pending", "verified", "rejected", "discrepancy"])
export const ShiftStatus = z.enum(["active", "completed", "cancelled"])
export const AuditAction = z.enum([
  "create",
  "update",
  "delete",
  "login",
  "logout",
  "price_change",
  "cash_handover",
  "meter_reading",
  "cash_submission",
  "electronic_payment",
  "expense",
  "delivery",
  "shift_start",
  "shift_end"
])

// Entity Schemas
export const UserSchema = z.object({
  id: IdSchema,
  email: EmailSchema,
  full_name: z.string().min(2),
  phone: PhoneSchema,
  role: UserRole,
  terminal_id: IdSchema.optional(),
  company_id: IdSchema,
  status: z.enum(["active", "inactive", "suspended"]),
  last_login: DateSchema.optional(),
  created_at: DateSchema,
  updated_at: DateSchema,
})

export const CompanySchema = z.object({
  id: IdSchema,
  name: z.string().min(2),
  address: z.string().optional(),
  contact_person: z.string().optional(),
  phone: PhoneSchema.optional(),
  email: EmailSchema.optional(),
  created_at: DateSchema,
  updated_at: DateSchema,
})

export const TerminalSchema = z.object({
  id: IdSchema,
  name: z.string().min(2),
  company_id: IdSchema,
  location: z.string(),
  status: z.enum(["active", "inactive", "maintenance"]),
  manager_id: IdSchema.optional(),
  created_at: DateSchema,
  updated_at: DateSchema,
})

export const PumpSchema = z.object({
  id: IdSchema,
  terminal_id: IdSchema,
  name: z.string(),
  fuel_type: FuelType,
  tank_id: IdSchema,
  status: z.enum(["active", "inactive", "maintenance"]),
  created_at: DateSchema,
  updated_at: DateSchema,
})

export const TankSchema = z.object({
  id: IdSchema,
  terminal_id: IdSchema,
  name: z.string(),
  fuel_type: FuelType,
  capacity: z.number().positive(),
  minimum_level: z.number().positive(),
  current_level: z.number().positive(),
  status: z.enum(["active", "inactive", "maintenance"]),
  created_at: DateSchema,
  updated_at: DateSchema,
})

export const ShiftSchema = z.object({
  id: IdSchema,
  terminal_id: IdSchema,
  user_id: IdSchema,
  start_time: DateSchema,
  end_time: DateSchema.optional(),
  status: ShiftStatus,
  notes: z.string().optional(),
  created_at: DateSchema,
  updated_at: DateSchema,
})

export const MeterReadingSchema = z.object({
  id: IdSchema,
  terminal_id: IdSchema,
  pump_id: IdSchema,
  shift_id: IdSchema,
  user_id: IdSchema,
  opening_reading: z.number().positive(),
  closing_reading: z.number().positive(),
  liters_sold: z.number().positive(),
  price_per_liter: PriceSchema,
  expected_amount: AmountSchema,
  reading_time: DateSchema,
  status: z.enum(["pending", "verified", "disputed"]),
  notes: z.string().optional(),
  created_at: DateSchema,
  updated_at: DateSchema,
})

export const CashSubmissionSchema = z.object({
  id: IdSchema,
  terminal_id: IdSchema,
  user_id: IdSchema,
  shift_id: IdSchema,
  amount: AmountSchema,
  submission_time: DateSchema,
  verification_status: VerificationStatus,
  notes: z.string().optional(),
  created_at: DateSchema,
  updated_at: DateSchema,
})

export const CashHandoverSchema = z.object({
  id: IdSchema,
  terminal_id: IdSchema,
  from_user_id: IdSchema,
  to_user_id: IdSchema,
  amount: AmountSchema,
  handover_time: DateSchema,
  verification_status: VerificationStatus,
  notes: z.string().optional(),
  created_at: DateSchema,
  updated_at: DateSchema,
})

export const ElectronicPaymentSchema = z.object({
  id: IdSchema,
  terminal_id: IdSchema,
  user_id: IdSchema,
  shift_id: IdSchema,
  amount: AmountSchema,
  payment_method: z.enum(["pos", "transfer", "other"]),
  reference_number: z.string().optional(),
  payment_time: DateSchema,
  verification_status: VerificationStatus,
  notes: z.string().optional(),
  created_at: DateSchema,
  updated_at: DateSchema,
})

export const ExpenseSchema = z.object({
  id: IdSchema,
  terminal_id: IdSchema,
  user_id: IdSchema,
  amount: AmountSchema,
  category: z.enum([
    "maintenance",
    "utilities",
    "supplies",
    "salaries",
    "transportation",
    "other"
  ]),
  description: z.string(),
  expense_date: DateSchema,
  status: z.enum(["pending", "approved", "rejected"]),
  approved_by: IdSchema.optional(),
  notes: z.string().optional(),
  created_at: DateSchema,
  updated_at: DateSchema,
})

export const DeliverySchema = z.object({
  id: IdSchema,
  terminal_id: IdSchema,
  tank_id: IdSchema,
  supplier_id: IdSchema,
  quantity: z.number().positive(),
  unit_price: PriceSchema,
  total_amount: AmountSchema,
  delivery_date: DateSchema,
  received_by: IdSchema,
  verified_by: IdSchema.optional(),
  status: z.enum(["pending", "verified", "disputed"]),
  notes: z.string().optional(),
  created_at: DateSchema,
  updated_at: DateSchema,
})

export const PriceChangeSchema = z.object({
  id: IdSchema,
  terminal_id: IdSchema,
  fuel_type: FuelType,
  old_price: PriceSchema,
  new_price: PriceSchema,
  change_date: DateSchema,
  authorized_by: IdSchema,
  status: z.enum(["pending", "approved", "rejected"]),
  notes: z.string().optional(),
  created_at: DateSchema,
  updated_at: DateSchema,
})

// Create schemas (for insertion)
export const UserCreateSchema = UserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  last_login: true,
})

export const UserUpdateSchema = UserSchema.partial().omit({
  id: true,
  created_at: true,
})

export const TerminalCreateSchema = TerminalSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const PumpCreateSchema = PumpSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const TankCreateSchema = TankSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const ShiftCreateSchema = ShiftSchema.omit({
  id: true,
  end_time: true,
  created_at: true,
  updated_at: true,
})

export const MeterReadingCreateSchema = MeterReadingSchema.omit({
  id: true,
  liters_sold: true,
  expected_amount: true,
  created_at: true,
  updated_at: true,
})

export const CashSubmissionCreateSchema = CashSubmissionSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const CashHandoverCreateSchema = CashHandoverSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const ElectronicPaymentCreateSchema = ElectronicPaymentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const ExpenseCreateSchema = ExpenseSchema.omit({
  id: true,
  approved_by: true,
  created_at: true,
  updated_at: true,
})

export const DeliveryCreateSchema = DeliverySchema.omit({
  id: true,
  total_amount: true,
  verified_by: true,
  created_at: true,
  updated_at: true,
})

export const PriceChangeCreateSchema = PriceChangeSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

// Inferred Types
export type User = z.infer<typeof UserSchema>
export type Company = z.infer<typeof CompanySchema>
export type Terminal = z.infer<typeof TerminalSchema>
export type Pump = z.infer<typeof PumpSchema>
export type Tank = z.infer<typeof TankSchema>
export type Shift = z.infer<typeof ShiftSchema>
export type MeterReading = z.infer<typeof MeterReadingSchema>
export type CashSubmission = z.infer<typeof CashSubmissionSchema>
export type CashHandover = z.infer<typeof CashHandoverSchema>
export type ElectronicPayment = z.infer<typeof ElectronicPaymentSchema>
export type Expense = z.infer<typeof ExpenseSchema>
export type Delivery = z.infer<typeof DeliverySchema>
export type PriceChange = z.infer<typeof PriceChangeSchema>

// Other types
export interface AuditLog {
  id: string
  user_id?: string
  action: string
  entity_type: string
  entity_id?: string
  details?: any
  ip_address?: string
  created_at: string
}

export interface DashboardStats {
  totalSales: number
  totalExpenses: number
  netProfit: number
  fuelSold: number
}

export type DateRange = {
  startDate: Date
  endDate: Date
}

export type DailySummary = {
  date: Date
  totalSales: number
  totalExpenses: number
  netAmount: number
  cashSubmissions: number
  electronicPayments: number
  meterReadings: {
    totalLiters: number
    expectedAmount: number
  }
  expenses: {
    [key: string]: number
  }
}

export type ShiftSummary = {
  shiftId: string
  userId: string
  userName: string
  startTime: Date
  endTime?: Date
  meterReadings: {
    totalLiters: number
    expectedAmount: number
  }
  cashSubmissions: number
  electronicPayments: number
  expenses: number
  netAmount: number
}

// Component types
export type DataTableProps<TData> = {
  data: TData[]
  columns: any[]
  loading?: boolean
  error?: string
  onRowClick?: (row: TData) => void
  pagination?: {
    pageSize: number
    pageIndex: number
    totalPages: number
    onPageChange: (page: number) => void
  }
}

export type StatCardProps = {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    direction: "up" | "down"
  }
  loading?: boolean
}

