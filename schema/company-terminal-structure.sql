-- Create company table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  contact_person TEXT,
  phone TEXT,
  email TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create terminals table (gas stations)
CREATE TABLE terminals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  address TEXT,
  manager_id UUID REFERENCES users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(company_id, name)
);

-- Update users table to include company and terminal references
ALTER TABLE users ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE SET NULL;
ALTER TABLE users ADD COLUMN terminal_id UUID REFERENCES terminals(id) ON DELETE SET NULL;
ALTER TABLE users ADD COLUMN is_company_admin BOOLEAN DEFAULT false;

-- Update all existing tables to include terminal_id
ALTER TABLE tanks ADD COLUMN terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE;
ALTER TABLE pumps ADD COLUMN terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE;
ALTER TABLE nozzles ADD COLUMN terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE;
ALTER TABLE shifts ADD COLUMN terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE;
ALTER TABLE meter_readings ADD COLUMN terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE;
ALTER TABLE fuel_deliveries ADD COLUMN terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE;
ALTER TABLE customers ADD COLUMN terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE;
ALTER TABLE transactions ADD COLUMN terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE;
ALTER TABLE cash_submissions ADD COLUMN terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE;
ALTER TABLE credit_payments ADD COLUMN terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE;
ALTER TABLE price_changes ADD COLUMN terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE;
ALTER TABLE settings ADD COLUMN terminal_id UUID REFERENCES terminals(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_terminals_company_id ON terminals(company_id);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_terminal_id ON users(terminal_id);
CREATE INDEX idx_tanks_terminal_id ON tanks(terminal_id);
CREATE INDEX idx_pumps_terminal_id ON pumps(terminal_id);
CREATE INDEX idx_transactions_terminal_id ON transactions(terminal_id);

-- Create company_roles enum
CREATE TYPE company_role AS ENUM ('company_admin', 'company_viewer', 'terminal_admin', 'terminal_manager', 'terminal_finance', 'terminal_worker', 'terminal_auditor');

-- Update user_role to company_role
ALTER TABLE users ALTER COLUMN role TYPE company_role USING 
  CASE 
    WHEN role = 'admin' THEN 'terminal_admin'::company_role
    WHEN role = 'manager' THEN 'terminal_manager'::company_role
    WHEN role = 'finance' THEN 'terminal_finance'::company_role
    WHEN role = 'worker' THEN 'terminal_worker'::company_role
    WHEN role = 'auditor' THEN 'terminal_auditor'::company_role
    ELSE 'terminal_worker'::company_role
  END;

