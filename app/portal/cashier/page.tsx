"use client"

import { Suspense } from "react"
import CashierDashboard from "@/app/cashier/page"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CashierPortalPage() {
  return (
    <div className="space-y-6">
      <Suspense 
        fallback={
          <Card className="p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        }
      >
        <CashierDashboard />
      </Suspense>
    </div>
  )
}
