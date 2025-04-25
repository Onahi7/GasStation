import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: 'ADMIN' | 'COMPANY_ADMIN' | 'MANAGER' | 'AUDITOR' | 'FINANCE' | 'CASHIER' | 'WORKER' | 'DRIVER';
    companyId?: string | null;
  }

  interface Session {
    user: User;
  }
}