import { useAuth } from "@/hooks/use-auth"
import { useFeaturePermissions } from "@/hooks/use-feature-permissions"
import { useTheme } from "@/components/theme-provider"
import { roleThemes } from "@/lib/role-themes"

interface PortalCustomization {
  theme: typeof roleThemes[keyof typeof roleThemes]
  features: {
    enabled: string[]
    preferences: Record<string, any>
  }
  layout: {
    showSidebar: boolean
    showHeader: boolean
    contentWidth: string
  }
  navigation: {
    showQuickActions: boolean
    showNotifications: boolean
    showUserMenu: boolean
  }
}

const roleDefaults: Record<string, Partial<PortalCustomization>> = {
  admin: {
    layout: {
      showSidebar: true,
      showHeader: true,
      contentWidth: 'max-w-[2000px]'
    },
    navigation: {
      showQuickActions: true,
      showNotifications: true,
      showUserMenu: true
    }
  },
  manager: {
    layout: {
      showSidebar: true,
      showHeader: true,
      contentWidth: 'max-w-[1800px]'
    },
    navigation: {
      showQuickActions: true,
      showNotifications: true,
      showUserMenu: true
    }
  },
  cashier: {
    layout: {
      showSidebar: true,
      showHeader: true,
      contentWidth: 'max-w-[1400px]'
    },
    navigation: {
      showQuickActions: true,
      showNotifications: false,
      showUserMenu: true
    }
  },
  worker: {
    layout: {
      showSidebar: false,
      showHeader: true,
      contentWidth: 'max-w-[1200px]'
    },
    navigation: {
      showQuickActions: true,
      showNotifications: false,
      showUserMenu: false
    }
  }
}

export function usePortalCustomization() {
  const { user } = useAuth()
  const theme = useTheme()
  const { getAllowedFeatures } = useFeaturePermissions()
  const role = user?.role || 'worker'

  const roleCustomization = roleDefaults[role] || roleDefaults.worker
  const allowedFeatures = getAllowedFeatures()

  return {
    theme,
    features: {
      enabled: allowedFeatures,
      preferences: user?.preferences || {}
    },
    layout: {
      ...roleCustomization.layout,
      // Allow overrides from user preferences
      ...user?.preferences?.layout
    },
    navigation: {
      ...roleCustomization.navigation,
      // Allow overrides from user preferences
      ...user?.preferences?.navigation
    }
  }
}
