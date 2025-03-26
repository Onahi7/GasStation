"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CreditCard,
  DollarSign,
  FileText,
  FuelIcon as GasPump,
  Home,
  LogOut,
  Settings,
  User,
  Users,
  Wallet,
  Clock,
  Building,
  Terminal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { signOut } from "@/app/actions/auth"

type DashboardLayoutProps = {
  children: React.ReactNode
  role?: "worker" | "cashier" | "finance" | "manager" | "admin" | "auditor"
}

export function DashboardLayout({ children, role = "worker" }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [userName, setUserName] = useState("User")
  const [userInitials, setUserInitials] = useState("U")
  const [userRole, setUserRole] = useState(role)
  const [companyName, setCompanyName] = useState("Hardy Station")
  const [terminalName, setTerminalName] = useState("Main Terminal")

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // This is just a placeholder
    setUserName("John Doe")
    setUserInitials("JD")
    setUserRole(role)
    setCompanyName("Hardy Station")
    setTerminalName("Main Terminal")
  }, [role])

  const getNavItems = () => {
    switch (userRole) {
      case "worker":
        return [
          { href: "/worker", label: "Dashboard", icon: Home },
          { href: "/worker/readings", label: "Meter Readings", icon: GasPump },
          { href: "/worker/payments", label: "Payments", icon: CreditCard },
          { href: "/worker/shifts", label: "Shifts", icon: Clock },
          { href: "/worker/profile", label: "Profile", icon: User },
        ]
      case "cashier":
        return [
          { href: "/cashier", label: "Dashboard", icon: Home },
          { href: "/cashier/cash", label: "Cash Submissions", icon: DollarSign },
          { href: "/cashier/expenses", label: "Expenses", icon: Wallet },
          { href: "/cashier/handovers", label: "Cash Handovers", icon: CreditCard },
          { href: "/cashier/reports", label: "Reports", icon: FileText },
          { href: "/cashier/profile", label: "Profile", icon: User },
        ]
      case "finance":
        return [
          { href: "/finance", label: "Dashboard", icon: Home },
          { href: "/finance/payments", label: "Payments", icon: CreditCard },
          { href: "/finance/expenses", label: "Expenses", icon: Wallet },
          { href: "/finance/handovers", label: "Cash Handovers", icon: DollarSign },
          { href: "/finance/reports", label: "Reports", icon: BarChart3 },
          { href: "/finance/profile", label: "Profile", icon: User },
        ]
      case "manager":
        return [
          { href: "/manager", label: "Dashboard", icon: Home },
          { href: "/manager/terminals", label: "Terminals", icon: Terminal },
          { href: "/manager/staff", label: "Staff", icon: Users },
          { href: "/manager/payments", label: "Payments", icon: CreditCard },
          { href: "/manager/expenses", label: "Expenses", icon: Wallet },
          { href: "/manager/reports", label: "Reports", icon: BarChart3 },
          { href: "/manager/settings", label: "Settings", icon: Settings },
          { href: "/manager/profile", label: "Profile", icon: User },
        ]
      case "admin":
        return [
          { href: "/admin", label: "Dashboard", icon: Home },
          { href: "/admin/companies", label: "Companies", icon: Building },
          { href: "/admin/terminals", label: "Terminals", icon: Terminal },
          { href: "/admin/users", label: "Users", icon: Users },
          { href: "/admin/reports", label: "Reports", icon: BarChart3 },
          { href: "/admin/settings", label: "Settings", icon: Settings },
          { href: "/admin/profile", label: "Profile", icon: User },
        ]
      default:
        return [
          { href: "/", label: "Dashboard", icon: Home },
          { href: "/profile", label: "Profile", icon: User },
        ]
    }
  }

  const navItems = getNavItems()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-2 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <GasPump className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{companyName}</span>
                <span className="text-xs text-muted-foreground">{terminalName}</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={userName} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{userName}</span>
                  <span className="text-xs capitalize text-muted-foreground">{userRole}</span>
                </div>
              </div>
              <form action={signOut}>
                <Button variant="ghost" size="icon" type="submit">
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Log out</span>
                </Button>
              </form>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 sm:px-6 lg:px-8">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-4">
              <Button variant="outline" size="sm">
                Help
              </Button>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

