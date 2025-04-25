import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, companyId: true }
        })
        if (dbUser) {
          session.user.role = dbUser.role
          session.user.companyId = dbUser.companyId
        }
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  }
})
