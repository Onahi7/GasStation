import { type ThemeConfig } from "@/types/theme"

export interface PortalComponentProps {
  className?: string
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export interface PortalLayoutProps extends PortalComponentProps {
  header?: React.ReactNode
  sidebar?: React.ReactNode
  actions?: React.ReactNode
}

export function PortalContainer({ children, className, variant = 'primary' }: PortalComponentProps) {
  const theme = useTheme()
  
  return (
    <div className={cn(
      theme.layout.maxWidth,
      theme.layout.padding,
      variant === 'primary' && theme.colors.primary.background,
      variant === 'secondary' && theme.colors.secondary.background,
      'mx-auto rounded-lg',
      className
    )}>
      {children}
    </div>
  )
}

export function PortalHeader({ children, className }: PortalComponentProps) {
  const theme = useTheme()
  
  return (
    <header className={cn(
      theme.layout.headerHeight,
      'flex items-center justify-between px-4 border-b',
      className
    )}>
      {children}
    </header>
  )
}

export function PortalSidebar({ children, className }: PortalComponentProps) {
  const theme = useTheme()
  
  return (
    <aside className={cn(
      theme.layout.sidebarWidth,
      'fixed h-screen border-r bg-background',
      className
    )}>
      {children}
    </aside>
  )
}

export function PortalContent({ children, className }: PortalComponentProps) {
  const theme = useTheme()
  
  return (
    <main className={cn(
      'flex-1 overflow-auto',
      className
    )}>
      {children}
    </main>
  )
}

export function PortalLayout({ 
  children,
  header,
  sidebar,
  actions,
  className 
}: PortalLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {sidebar}
      <div className={cn(
        'flex flex-col min-h-screen',
        sidebar && 'lg:ml-64' // Offset for sidebar
      )}>
        {header}
        <PortalContent>
          {children}
        </PortalContent>
      </div>
    </div>
  )
}
