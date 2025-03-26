# Hardy Station Installation Guide

This guide provides step-by-step instructions for deploying the Hardy Station Gas Station Management System to Vercel.

## Prerequisites

Before you begin, ensure you have:

1. A [GitHub](https://github.com) account
2. A [Vercel](https://vercel.com) account
3. A [Supabase](https://supabase.com) account

## Step 1: Set Up Supabase

1. Log in to your Supabase account and create a new project
2. Note down the following credentials (you'll need them later):
   - Supabase URL
   - Supabase Anon Key
   - Supabase Service Role Key

3. Set up the database schema by running the following SQL in the Supabase SQL Editor:

```sql
-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Terminals table
CREATE TABLE terminals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'finance', 'cashier', 'worker')),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  terminal_id UUID REFERENCES terminals(id) ON DELETE SET NULL,
  is_company_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tanks table
CREATE TABLE tanks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capacity NUMERIC NOT NULL,
  product TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pumps table
CREATE TABLE pumps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE,
  tank_id UUID REFERENCES tanks(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  product TEXT NOT NULL,
  price_per_liter NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shifts table
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meter readings table
CREATE TABLE meter_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE,
  pump_id UUID REFERENCES pumps(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
  opening_reading NUMERIC NOT NULL,
  closing_reading NUMERIC,
  liters_sold NUMERIC,
  expected_amount NUMERIC,
  reading_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'closed', 'verified')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cash submissions table
CREATE TABLE cash_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  submission_time TIMESTAMP WITH TIME ZONE NOT NULL,
  received_by UUID REFERENCES users(id) ON DELETE SET NULL,
  verification_status TEXT NOT NULL CHECK (verification_status IN ('pending', 'verified', 'discrepancy')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Electronic payments table
CREATE TABLE electronic_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('pos', 'transfer', 'other')),
  reference_number TEXT,
  payment_time TIMESTAMP WITH TIME ZONE NOT NULL,
  verification_status TEXT NOT NULL CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  receipt_url TEXT,
  expense_date TIMESTAMP WITH TIME ZONE NOT NULL,
  approval_status TEXT NOT NULL CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cash handovers table
CREATE TABLE cash_handovers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  handover_time TIMESTAMP WITH TIME ZONE NOT NULL,
  verification_status TEXT NOT NULL CHECK (verification_status IN ('pending', 'verified', 'discrepancy')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

