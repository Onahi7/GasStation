# Hardy Station - Gas Station Management System

## Overview

Hardy Station is a comprehensive management system designed specifically for filling stations. It streamlines operations by providing tools for meter reading tracking, payment management, expense tracking, cash handovers, and financial reporting. The system is built with a role-based access control system that caters to different staff responsibilities within a filling station.

## System Architecture

### Tech Stack

- **Frontend**: Next.js 14 with App Router, React, Tailwind CSS, shadcn/ui
- **Backend**: Serverless functions via Next.js API routes and Server Actions
- **Database**: PostgreSQL via Neon Database
- **Authentication**: NextAuth.js with Prisma Adapter
- **Hosting**: Vercel

### Database Schema

The system uses the following core tables:

1. **companies** - Stores information about companies that own filling stations
2. **terminals** - Represents individual filling stations (a company can have multiple terminals)
3. **users** - Staff members with different roles (worker, cashier, finance, manager, admin)
4. **pumps** - Fuel dispensers at each terminal
5. **tanks** - Fuel storage tanks at each terminal
6. **meter_readings** - Records of pump meter readings taken by workers
7. **cash_submissions** - Cash collected and submitted by workers
8. **electronic_payments** - Records of electronic payments (POS, transfers)
9. **expenses** - Business expenses recorded by staff
10. **cash_handovers** - End-of-day cash balance records
11. **shifts** - Work shifts for staff members

### Role-Based Access Control

The system implements a comprehensive role-based access control system with the following roles:

1. **Company Admin** - Can manage company settings, terminals, and users
2. **Admin** - Terminal administrator with full access to all features
3. **Manager** - Oversees operations, approves expenses, and views reports
4. **Finance** - Handles financial aspects, reconciliations, and reporting
5. **Cashier** - Manages cash submissions and electronic payments
6. **Worker** - Records meter readings and submits cash collections

## Core Workflows

### Company and Terminal Setup

1. Company registration with initial terminal setup
2. Company admin can add additional terminals
3. Company admin can add and manage users

### User Authentication

1. Secure login with email and password
2. Role-based redirection to appropriate dashboard
3. Protected routes based on user roles

### Meter Reading Process

1. Workers record opening and closing meter readings for pumps
2. System calculates fuel dispensed and expected cash collection
3. Managers can view and verify readings

### Cash Management

1. Workers submit collected cash
2. System reconciles submitted cash against expected amounts from meter readings
3. Cashiers verify and process cash submissions
4. End-of-day cash handovers with verification

### Expense Tracking

1. Staff can record business expenses with receipts
2. Managers approve or reject expense claims
3. Finance staff process approved expenses

### Financial Reporting

1. Daily sales reports by product and payment method
2. Cash flow analysis
3. Expense reports
4. Profit and loss statements
5. Terminal performance comparisons

## Technical Implementation

### Authentication Flow

The system uses NextAuth.js with the Prisma adapter for secure authentication and session management. When a user logs in:

1. Credentials are verified against the database using bcrypt
2. User role and company information are added to the JWT session
3. Middleware redirects to the appropriate dashboard based on role
4. Protected routes check user role before rendering

### Data Flow

1. Client components capture user input
2. Server Actions process data and interact with the database through Prisma
3. Real-time updates via React Server Components and useOptimistic hooks
4. Server-side rendering for initial data loading

### Security Measures

1. Server-side validation of all inputs
2. Role-based access control at the middleware level
3. Secure password hashing with bcrypt
4. JWT-based session management with NextAuth.js
5. Audit logging for sensitive operations

## Additional Features

1. Dark mode support
2. Responsive design for mobile and desktop
3. Progressive Web App (PWA) capabilities
4. Export reports to PDF/Excel
5. Email notifications for important events

## Support and Maintenance

For support:
- Email: support@hardystation.com
- Documentation: docs.hardystation.com
- Community forum: community.hardystation.com

