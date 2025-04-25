"use client"

import { useFeaturePermissions } from "@/hooks/use-feature-permissions"
import { roleThemes } from "@/lib/role-themes"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

interface FeatureGuardProps {
  featureId: string
  requiredAction?: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureGuard({ 
  featureId, 
  requiredAction, 
  children, 
  fallback 
}: FeatureGuardProps) {
  const { hasPermission } = useFeaturePermissions()
  
  if (!hasPermission(featureId, requiredAction)) {
    return fallback || null
  }
  
  return children
}

interface ThemedComponentProps {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
}

export function ThemedCard({ 
  children, 
  className, 
  variant = 'primary' 
}: ThemedComponentProps) {
  const { user } = useAuth()
  const theme = roleThemes[user?.role || 'worker']
  
  return (
    <div className={cn(
      theme.components.card.base,
      variant === 'primary' && theme.colors.primary.border,
      variant === 'secondary' && theme.colors.secondary.border,
      className
    )}>
      {children}
    </div>
  )
}

export function ThemedButton({ 
  children, 
  className, 
  variant = 'primary' 
}: ThemedComponentProps) {
  const { user } = useAuth()
  const theme = roleThemes[user?.role || 'worker']
  
  return (
    <button className={cn(
      theme.components.button.base,
      variant === 'primary' && theme.components.button.primary,
      variant === 'secondary' && theme.components.button.secondary,
      className
    )}>
      {children}
    </button>
  )
}
