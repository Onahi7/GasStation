import { useAuth } from "@/hooks/use-auth"

export interface FeatureFlag {
  id: string
  name: string
  description: string
  requiresPermission: boolean
  defaultEnabled: boolean
}

export interface FeaturePermission {
  canView: boolean
  canEdit: boolean
  canDelete: boolean
  customActions: string[]
}

// Define all available features with granular permissions
export const features: Record<string, FeatureFlag> = {
  systemMonitoring: {
    id: "systemMonitoring",
    name: "System Monitoring",
    description: "Monitor system-wide metrics and performance",
    requiresPermission: true,
    defaultEnabled: false
  },
  userManagement: {
    id: "userManagement",
    name: "User Management",
    description: "Manage user accounts and permissions",
    requiresPermission: true,
    defaultEnabled: false
  },
  tankMonitoring: {
    id: "tankMonitoring",
    name: "Tank Monitoring",
    description: "Monitor fuel tank levels and operations",
    requiresPermission: true,
    defaultEnabled: false
  },
  cashManagement: {
    id: "cashManagement",
    name: "Cash Management",
    description: "Handle cash transactions and reconciliation",
    requiresPermission: true,
    defaultEnabled: false
  },
  staffManagement: {
    id: "staffManagement",
    name: "Staff Management",
    description: "Manage staff schedules and performance",
    requiresPermission: true,
    defaultEnabled: false
  },
  reports: {
    id: "reports",
    name: "Reports",
    description: "Generate and view reports",
    requiresPermission: true,
    defaultEnabled: false
  },
  expenses: {
    id: "expenses",
    name: "Expenses",
    description: "Record and manage expenses",
    requiresPermission: true,
    defaultEnabled: false
  },
  meterReadings: {
    id: "meterReadings",
    name: "Meter Readings",
    description: "Record and view meter readings",
    requiresPermission: true,
    defaultEnabled: false
  },
  shiftManagement: {
    id: "shiftManagement",
    name: "Shift Management",
    description: "Manage work shifts",
    requiresPermission: true,
    defaultEnabled: false
  }
}

// Define role-based permissions
const rolePermissions: Record<string, Record<string, FeaturePermission>> = {
  admin: {
    systemMonitoring: { canView: true, canEdit: true, canDelete: true, customActions: ['configure', 'audit'] },
    userManagement: { canView: true, canEdit: true, canDelete: true, customActions: ['assign-roles'] },
    tankMonitoring: { canView: true, canEdit: true, canDelete: true, customActions: ['calibrate'] },
    reports: { canView: true, canEdit: true, canDelete: true, customActions: ['export', 'schedule'] }
  },
  manager: {
    tankMonitoring: { canView: true, canEdit: true, canDelete: false, customActions: ['alert'] },
    staffManagement: { canView: true, canEdit: true, canDelete: false, customActions: ['schedule'] },
    reports: { canView: true, canEdit: false, canDelete: false, customActions: ['export'] }
  },
  cashier: {
    cashManagement: { canView: true, canEdit: true, canDelete: false, customActions: ['verify'] },
    expenses: { canView: true, canEdit: true, canDelete: false, customActions: ['record'] },
    reports: { canView: true, canEdit: false, canDelete: false, customActions: ['daily-summary'] }
  },
  worker: {
    meterReadings: { canView: true, canEdit: true, canDelete: false, customActions: ['record'] },
    shiftManagement: { canView: true, canEdit: false, canDelete: false, customActions: ['start-end'] }
  }
}

export function useFeaturePermissions() {
  const { user } = useAuth()
  const role = user?.role || 'worker'

  return {
    hasPermission: (featureId: string, action?: keyof FeaturePermission | string) => {
      const rolePerms = rolePermissions[role]
      if (!rolePerms || !rolePerms[featureId]) return false

      if (!action) return true // Just checking if feature is available
      
      const perms = rolePerms[featureId]
      if (action in perms) {
        return perms[action as keyof FeaturePermission]
      }
      
      return perms.customActions.includes(action)
    },

    getFeaturePermissions: (featureId: string) => {
      return rolePermissions[role]?.[featureId] || null
    },

    getAllowedFeatures: () => {
      return Object.keys(rolePermissions[role] || {})
    }
  }
}
