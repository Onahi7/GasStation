export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          role: "admin" | "manager" | "finance" | "worker" | "auditor"
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          phone?: string | null
          role?: "admin" | "manager" | "finance" | "worker" | "auditor"
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          role?: "admin" | "manager" | "finance" | "worker" | "auditor"
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tanks: {
        Row: {
          id: string
          name: string
          fuel_type: "petrol" | "diesel" | "kerosene"
          capacity: number
          current_volume: number
          min_volume: number
          location: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          fuel_type: "petrol" | "diesel" | "kerosene"
          capacity: number
          current_volume?: number
          min_volume?: number
          location?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          fuel_type?: "petrol" | "diesel" | "kerosene"
          capacity?: number
          current_volume?: number
          min_volume?: number
          location?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pumps: {
        Row: {
          id: string
          name: string
          tank_id: string
          fuel_type: "petrol" | "diesel" | "kerosene"
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          tank_id: string
          fuel_type: "petrol" | "diesel" | "kerosene"
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          tank_id?: string
          fuel_type?: "petrol" | "diesel" | "kerosene"
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      nozzles: {
        Row: {
          id: string
          pump_id: string
          number: number
          fuel_type: "petrol" | "diesel" | "kerosene"
          current_reading: number
          price_per_liter: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pump_id: string
          number: number
          fuel_type: "petrol" | "diesel" | "kerosene"
          current_reading?: number
          price_per_liter: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pump_id?: string
          number?: number
          fuel_type?: "petrol" | "diesel" | "kerosene"
          current_reading?: number
          price_per_liter?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      shifts: {
        Row: {
          id: string
          worker_id: string
          start_time: string
          end_time: string | null
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          start_time: string
          end_time?: string | null
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          start_time?: string
          end_time?: string | null
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meter_readings: {
        Row: {
          id: string
          shift_id: string
          nozzle_id: string
          reading_type: string
          reading_value: number
          recorded_by: string
          recorded_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shift_id: string
          nozzle_id: string
          reading_type: string
          reading_value: number
          recorded_by: string
          recorded_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shift_id?: string
          nozzle_id?: string
          reading_type?: string
          reading_value?: number
          recorded_by?: string
          recorded_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          transaction_type: "sale" | "purchase" | "adjustment" | "credit_payment"
          shift_id: string | null
          nozzle_id: string | null
          customer_id: string | null
          volume: number | null
          price_per_liter: number | null
          amount: number
          payment_method: "cash" | "credit" | "bank_transfer" | "mobile_money"
          reference_number: string | null
          processed_by: string
          transaction_date: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          transaction_type: "sale" | "purchase" | "adjustment" | "credit_payment"
          shift_id?: string | null
          nozzle_id?: string | null
          customer_id?: string | null
          volume?: number | null
          price_per_liter?: number | null
          amount: number
          payment_method: "cash" | "credit" | "bank_transfer" | "mobile_money"
          reference_number?: string | null
          processed_by: string
          transaction_date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          transaction_type?: "sale" | "purchase" | "adjustment" | "credit_payment"
          shift_id?: string | null
          nozzle_id?: string | null
          customer_id?: string | null
          volume?: number | null
          price_per_liter?: number | null
          amount?: number
          payment_method?: "cash" | "credit" | "bank_transfer" | "mobile_money"
          reference_number?: string | null
          processed_by?: string
          transaction_date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          contact_person: string | null
          phone: string | null
          email: string | null
          address: string | null
          credit_limit: number | null
          current_balance: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          contact_person?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          credit_limit?: number | null
          current_balance?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact_person?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          credit_limit?: number | null
          current_balance?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          terminal_id?: string
          user_id: string
          action: string
          entity_type: string
          entity_id: string
          details?: Json
          ip_address?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          terminal_id?: string
          user_id: string
          action: string
          entity_type: string
          entity_id: string
          details?: Json
          ip_address?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          terminal_id?: string
          user_id?: string
          action?: string
          entity_type?: string
          entity_id?: string
          details?: Json
          ip_address?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "manager" | "finance" | "worker" | "auditor"
      fuel_type: "petrol" | "diesel" | "kerosene"
      transaction_type: "sale" | "purchase" | "adjustment" | "credit_payment"
      payment_method: "cash" | "credit" | "bank_transfer" | "mobile_money"
    }
  }
}

