# Hardy Station Installation Guide

This guide provides step-by-step instructions for deploying the Hardy Station Gas Station Management System to Vercel.

## Prerequisites

Before you begin, ensure you have:

1. A [GitHub](https://github.com) account
2. A [Vercel](https://vercel.com) account
3. A [Neon](https://neon.tech) account for the PostgreSQL database

## Step 1: Set Up Neon Database

1. Log in to your Neon account and create a new project
2. Create a new database and note down the connection string
3. Set up the database schema by running the following SQL or use Prisma migrations:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'FINANCE', 'CASHIER', 'WORKER', 'DRIVER')),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

## Step 2: Clone and Configure the Project

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hardy-station.git
cd hardy-station
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with the following variables:
```env
# Database Configuration
DATABASE_URL=your_neon_database_url

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret # Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Application Settings
NEXT_PUBLIC_APP_NAME="Hardy Station Management"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Initialize Prisma and run migrations:
```bash
npx prisma generate
npx prisma db push
```

## Step 3: Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add the environment variables in Vercel's project settings:
   - DATABASE_URL
   - NEXTAUTH_URL (use your production URL)
   - NEXTAUTH_SECRET
   - NEXT_PUBLIC_APP_NAME
   - NEXT_PUBLIC_APP_URL (use your production URL)
4. Deploy the project

## Step 4: Create Initial Admin User

1. Access your application's registration page
2. Register a new company with admin user
3. The first user will automatically be assigned the COMPANY_ADMIN role

## Additional Configuration

### Email Service (Optional)
To enable email notifications, add these environment variables:
```env
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=noreply@hardystation.com
```

### File Upload (Optional)
To enable file uploads for receipts and documents, configure your preferred storage solution (e.g., AWS S3, Cloudinary) and add the relevant environment variables.

## Troubleshooting

Common issues and their solutions:

1. **Database Connection Issues**: 
   - Verify your Neon database URL is correct
   - Check that the database is accessible from your deployment region

2. **Authentication Issues**:
   - Ensure NEXTAUTH_SECRET is properly set
   - Verify NEXTAUTH_URL matches your deployment URL

3. **Deployment Problems**:
   - Check Vercel build logs for errors
   - Verify all environment variables are set correctly

## Support and Updates

For support:
- Email: support@hardystation.com
- Documentation: docs.hardystation.com
- Community forum: community.hardystation.com

