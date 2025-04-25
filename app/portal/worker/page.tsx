"use client"

import { Suspense } from "react"
import WorkerDashboard from "@/app/worker/page"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FeatureGuard, ThemedCard, ThemedButton } from "@/components/feature-guard"
import { useFeaturePermissions } from "@/hooks/use-feature-permissions"
import { PortalContainer } from "@/components/portal-layout"

export default function WorkerPortalPage() {
  const { hasPermission } = useFeaturePermissions()
  
  return (
    <PortalContainer className="space-y-6">
      <Suspense 
        fallback={
          <Card className="p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        }
      >
        <FeatureGuard 
          featureId="shiftManagement" 
          requiredAction="start-end"
          fallback={
            <ThemedCard variant="secondary" className="p-4">
              <p>You don't have permission to manage shifts.</p>
            </ThemedCard>
          }
        >
          <ThemedCard variant="primary" className="p-4">
            <WorkerDashboard />
            
            {/* Quick Actions */}
            {hasPermission('meterReadings', 'record') && (
              <div className="mt-4 flex gap-2">
                <ThemedButton variant="secondary">
                  Record Meter Reading
                </ThemedButton>
              </div>
            )}
          </ThemedCard>
        </FeatureGuard>
      </Suspense>
    </PortalContainer>
  )
}
