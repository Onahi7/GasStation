// User types
export interface User {
  id: string
  full_name: string
  email: string
  role: "admin" | "manager" | "finance" | "cashier" | "worker"
  company_id: string
  terminal_id?: string
  is_company_admin: boolean
  created_at: string
  updated_at: string
}

// Company types
export interface Company {
  id: string
  name: string
  address?: string
  contact_person?: string
  phone?: string
  email?: string
  created_at: string
  updated_at: string
}

// Terminal types
export interface Terminal {
  id: string
  company_id: string
  name: string
  location?: string
  address?: string
  created_at: string
  updated_at: string
}

// Pump types
export interface Pump {
  id: string
  terminal_id: string
  tank_id?: string
  name: string
  product: string
  price_per_liter: number
  created_at: string
  updated_at: string
}

// Tank types
export interface Tank {
  id: string
  terminal_id: string
  name: string
  capacity: number
  product: string
  created_at: string
  updated_at: string
}

// Shift types
export interface Shift {
  id: string
  terminal_id: string
  user_id: string
  start_time: string
  end_time?: string
  status: "active" | "completed" | "cancelled"
  created_at: string
  updated_at: string
}

// Meter reading types
export interface MeterReading {
  id: string
  terminal_id: string
  pump_id: string
  user_id: string
  shift_id?: string
  opening_reading: number
  closing_reading?: number
  liters_sold?: number
  expected_amount?: number
  reading_time: string
  status: "open" | "closed" | "verified"
  created_at: string
  updated_at: string
}

// Cash submission types
export interface CashSubmission {
  id: string
  terminal_id: string
  user_id: string
  shift_id?: string
  amount: number
  submission_time: string
  received_by?: string
  verification_status: "pending" | "verified" | "discrepancy"
  notes?: string
  created_at: string
  updated_at: string
}

// Electronic payment types
export interface ElectronicPayment {
  id: string
  terminal_id: string
  user_id: string
  shift_id?: string
  amount: number
  payment_method: "pos" | "transfer" | "other"
  reference_number?: string
  payment_time: string
  verification_status: "pending" | "verified" | "rejected"
  notes?: string
  created_at: string
  updated_at: string
}

// Expense types
export interface Expense {
  id: string
  terminal_id: string
  user_id: string
  amount: number
  category: string
  description?: string
  receipt_url?: string
  expense_date: string
  approval_status: "pending" | "approved" | "rejected"
  approved_by?: string
  created_at: string
  updated_at: string
}

// Cash handover types
export interface CashHandover {
  id: string
  terminal_id: string
  from_user_id: string
  to_user_id: string
  amount: number
  handover_time: string
  verification_status: "pending" | "verified" | "discrepancy"
  notes?: string
  created_at: string
  updated_at: string
}

// Audit log types
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

// Dashboard stats types
export interface DashboardStats {
  totalSales: number
  totalExpenses: number
  netProfit: number
  fuelSold: number
}

// Chart data types
export interface ChartData {
  name: string
  total: number
}

export interface PieChartData {
  name: string
  value: number
}

