"use client"

import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export const useAuth = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const signIn = async (email: string, password: string) => {
    try {
      const result = await nextAuthSignIn("credentials", {
        email,
        password,
        redirect: false,
      })      if (result?.error) {
        throw new Error(result.error)
      }

      router.push("/portal")
      router.refresh()
      return { success: true }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const signOut = async () => {
    await nextAuthSignOut({ redirect: true, callbackUrl: "/login" })
  }

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    signIn,
    signOut,
  }
}

