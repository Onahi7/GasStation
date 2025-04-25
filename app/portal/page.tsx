"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PortalPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/portal/login')
      return
    }

    if (user?.role) {
      router.push(`/portal/${user.role.toLowerCase()}`)
    }
  }, [user, isLoading, router])

  // Show loading state
  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </Card>
    </div>
  )
}
