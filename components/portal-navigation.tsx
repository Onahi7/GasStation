"use client"

import { usePortalFeatures } from "@/hooks/use-portal-customization"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  GasPump,
  Users,
  CreditCard,
  Settings,
  FileText,
  Building2,
  DollarSign,
  Clock,
} from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: any
  feature?: string
}

const roleNavItems: Record<string, NavItem[]> = {
  admin: [
    { href: "/portal/admin", label: "Dashboard", icon: Home },
    { href: "/portal/admin/users", label: "Users", icon: Users, feature: "userManagement" },
    { href: "/portal/admin/tanks", label: "Tanks", icon: GasPump, feature: "systemMonitoring" },
    { href: "/portal/admin/settings", label: "Settings", icon: Settings, feature: "systemMonitoring" },
  ],
  manager: [
    { href: "/portal/manager", label: "Dashboard", icon: Home },
    { href: "/portal/manager/staff", label: "Staff", icon: Users, feature: "staffManagement" },
    { href: "/portal/manager/tanks", label: "Tanks", icon: GasPump, feature: "tankMonitoring" },
    { href: "/portal/manager/reports", label: "Reports", icon: FileText, feature: "reports" },
  ],
  cashier: [
    { href: "/portal/cashier", label: "Dashboard", icon: Home },
    { href: "/portal/cashier/submissions", label: "Cash", icon: DollarSign, feature: "cashManagement" },
    { href: "/portal/cashier/expenses", label: "Expenses", icon: CreditCard, feature: "expenses" },
    { href: "/portal/cashier/reports", label: "Reports", icon: FileText, feature: "reports" },
  ],
  worker: [
    { href: "/portal/worker", label: "Dashboard", icon: Home },
    { href: "/portal/worker/readings", label: "Readings", icon: GasPump, feature: "meterReadings" },
    { href: "/portal/worker/shifts", label: "Shifts", icon: Clock, feature: "shiftManagement" },
    { href: "/portal/worker/cash", label: "Cash", icon: DollarSign, feature: "cashSubmission" },
  ],
}

export function PortalNavigation() {
  const { user } = useAuth()
  const { enabledFeatures } = usePortalFeatures()
  const pathname = usePathname()

  const navItems = roleNavItems[user?.role || 'worker']

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="fixed hidden h-screen w-64 border-r bg-background lg:block">
        <div className="flex h-16 items-center px-4 border-b">
          <span className="font-semibold">Hardy Station</span>
        </div>
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            // Skip items for disabled features
            if (item.feature && !enabledFeatures.includes(item.feature)) {
              return null
            }

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Mobile header */}
      <header className="fixed top-0 z-50 w-full border-b bg-background lg:hidden">
        <div className="flex h-16 items-center gap-4 px-4">
          <span className="font-semibold">Hardy Station</span>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 z-50 w-full border-t bg-background lg:hidden">
        <div className="flex justify-around p-2">
          {navItems.map((item) => {
            if (item.feature && !enabledFeatures.includes(item.feature)) {
              return null
            }

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto py-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
