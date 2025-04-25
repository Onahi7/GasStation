"use client"

import { PortalProvider } from "@/contexts/portal-context"
import { PortalLayout, PortalHeader, PortalSidebar } from "@/components/portal-layout"
import { PortalNavigation } from "@/components/portal-navigation"
import { usePortalCustomization } from "@/hooks/use-portal-customization"
import { useFeaturePermissions } from "@/hooks/use-feature-permissions"
import { ThemedCard } from "@/components/feature-guard"
import { useAuth } from "@/hooks/use-auth"

interface PortalLayoutProps {
  children: React.ReactNode
}

export default function RootPortalLayout({ children }: PortalLayoutProps) {
  const customization = usePortalCustomization()
  const { hasPermission } = useFeaturePermissions()
  const { user } = useAuth()
  
  return (
    <PortalProvider>
      <PortalLayout
        header={
          <PortalHeader>
            {/* Show role-specific header content */}
            {hasPermission('notifications') && (
              <ThemedCard variant="secondary" className="px-4 py-2">
                <span>Notifications</span>
              </ThemedCard>
            )}
          </PortalHeader>
        }
        sidebar={<PortalNavigation />}
      >
        <div className={customization.layout.maxWidth}>
          {children}
        </div>
      </PortalLayout>
    </PortalProvider>
  )
}
