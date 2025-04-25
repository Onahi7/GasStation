"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { getDefaultRouteForRole } from "@/lib/route-guards"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && user) {
      // If user is logged in and trying to access root, redirect to their portal
      if (window.location.pathname === "/") {
        router.push(getDefaultRouteForRole(user.role))
      }
    }
  }, [user, isLoading, router])

  return <>{children}</>
}
