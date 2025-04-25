"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/hooks/use-auth"
import { TerminalSelector } from "@/components/terminal-selector"
import {
  BellIcon,
  MenuIcon,
  UserIcon,
  LogOutIcon,
  HomeIcon,
  SettingsIcon,
  UsersIcon,
  DropletIcon,
  GaugeIcon,
  BarChartIcon,
  ClipboardIcon,
  DollarSignIcon,
  FileTextIcon,
  SearchIcon,
  AlertTriangleIcon,
  FuelIcon,
  TruckIcon,
  UploadIcon,
  WalletIcon,
} from "lucide-react"
import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function DashboardHeader({ title, description, children, className }: DashboardHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const navigation = {
    ADMIN: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Users", href: "/admin/users", icon: UsersIcon },
      { name: "Pumps", href: "/admin/pumps", icon: FuelIcon },
      { name: "Tanks", href: "/admin/tanks", icon: DropletIcon },
      { name: "Settings", href: "/admin/settings", icon: SettingsIcon },
    ],
    COMPANY_ADMIN: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Terminals", href: "/company-admin/terminals", icon: FuelIcon },
      { name: "Users", href: "/company-admin/users", icon: UsersIcon },
    ],
    MANAGER: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Staff", href: "/manager/staff", icon: UsersIcon },
      { name: "Deliveries", href: "/manager/deliveries", icon: TruckIcon },
      { name: "Reports", href: "/manager/reports", icon: FileTextIcon },
      { name: "Creditors", href: "/manager/creditors", icon: DollarSignIcon },
    ],
    AUDITOR: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Transactions", href: "/auditor/transactions", icon: ClipboardIcon },
      { name: "Compliance", href: "/auditor/compliance", icon: AlertTriangleIcon },
    ],
    FINANCE: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Reports", href: "/finance/reports", icon: BarChartIcon },
    ],
    CASHIER: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Transactions", href: "/cashier/transactions", icon: WalletIcon },
    ],
    WORKER: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Readings", href: "/worker/readings", icon: GaugeIcon },
      { name: "Performance", href: "/worker/performance", icon: BarChartIcon },
    ],
    DRIVER: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Deliveries", href: "/driver/deliveries", icon: TruckIcon },
      { name: "Reports", href: "/driver/reports", icon: FileTextIcon },
    ],
  }

  const roleNavigation = user?.role ? navigation[user.role as keyof typeof navigation] : []

  return (
    <div className={cn("border-b bg-background", className)}>
      <div className="flex h-16 items-center px-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader className="border-b pb-4">
              <SheetTitle>{process.env.NEXT_PUBLIC_APP_NAME}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2 py-4">
              {roleNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                      pathname === item.href ? "bg-accent" : "transparent"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <FuelIcon className="h-6 w-6" />
            <span className="font-semibold inline-block">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {/* Only show terminal selector for roles that might work with multiple terminals */}
          {user?.role && ['COMPANY_ADMIN', 'MANAGER', 'AUDITOR', 'FINANCE'].includes(user.role) && (
            <TerminalSelector />
          )}
          <Button variant="ghost" size="icon" className="text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
            <BellIcon className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserIcon className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => signOut()}
                className="text-red-600 focus:text-red-600"
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {(title || description) && (
        <div className="border-b px-4 py-3">
          {title && <h1 className="text-xl font-semibold">{title}</h1>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
    </div>
  )
}

