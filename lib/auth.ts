import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import type { Session as NextAuthSession } from 'next-auth';
import { getServerSession as getNextAuthServerSession } from 'next-auth';
import type { UserRole } from '@prisma/client';
import type { NextAuthOptions as OriginalNextAuthOptions } from 'next-auth';

export type NextAuthOptions = OriginalNextAuthOptions;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: { signIn: '/login', error: '/login' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }        const user = await prisma.user.findUnique({ where: { email: credentials.email as string } });
        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }
        const isValid = await compare(credentials.password as string, user.password);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }
        return { id: user.id, email: user.email, name: user.name, role: user.role as UserRole, companyId: user.companyId };
      }
    })
  ],  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role;
        token.companyId = user.companyId;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as UserRole;
      session.user.companyId = token.companyId as string | null;
      return session;
    }
  }
};

// Extend NextAuth session type to include our user properties
export type Session = NextAuthSession & {
  user: NextAuthSession['user'] & {
    id: string;
    role: UserRole;
    companyId?: string | null;
  };
};

/**
 * Get the NextAuth session on the server.
 */
export const getSession = async (): Promise<Session | null> => {
  const session = await getNextAuthServerSession(authOptions);
  return session as Session | null;
};

/**
 * Get the current user object from the session.
 */
export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user;
};
