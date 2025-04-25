"use client"

import { Suspense } from "react"
import AdminDashboard from "@/app/admin/page"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FeatureGuard, ThemedCard } from "@/components/feature-guard"

export default function AdminPortalPage() {
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
        <FeatureGuard featureId="systemMonitoring" requiredAction="configure">
          <ThemedCard variant="primary" className="p-4">
            <h2 className="text-lg font-semibold mb-4">System Configuration</h2>
            <AdminDashboard />
          </ThemedCard>
        </FeatureGuard>
      </Suspense>
    </div>
  )
}
