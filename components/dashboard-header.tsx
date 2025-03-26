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
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b p-4 md:p-6",
        className,
      )}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

function OldDashboardHeader() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Determine the current section based on the pathname
  const getCurrentSection = () => {
    if (pathname?.startsWith("/admin")) return "Admin Dashboard"
    if (pathname?.startsWith("/manager")) return "Manager Dashboard"
    if (pathname?.startsWith("/finance")) return "Finance Dashboard"
    if (pathname?.startsWith("/worker")) return "Worker Dashboard"
    if (pathname?.startsWith("/auditor")) return "Auditor Dashboard"
    return "Dashboard"
  }

  // Navigation links based on user role
  const getNavLinks = () => {
    if (pathname?.startsWith("/admin")) {
      return [
        { href: "/admin", label: "Overview", icon: <HomeIcon className="h-5 w-5 mr-2" /> },
        { href: "/admin/users", label: "Users", icon: <UsersIcon className="h-5 w-5 mr-2" /> },
        { href: "/admin/tanks", label: "Tanks", icon: <DropletIcon className="h-5 w-5 mr-2" /> },
        { href: "/admin/pumps", label: "Pumps", icon: <GaugeIcon className="h-5 w-5 mr-2" /> },
        { href: "/admin/settings", label: "Settings", icon: <SettingsIcon className="h-5 w-5 mr-2" /> },
      ]
    }

    if (pathname?.startsWith("/manager")) {
      return [
        { href: "/manager", label: "Overview", icon: <HomeIcon className="h-5 w-5 mr-2" /> },
        { href: "/manager/direct-sales", label: "Direct Sales", icon: <DollarSignIcon className="h-5 w-5 mr-2" /> },
        { href: "/manager/creditors", label: "Creditors", icon: <UsersIcon className="h-5 w-5 mr-2" /> },
        { href: "/manager/reports", label: "Reports", icon: <FileTextIcon className="h-5 w-5 mr-2" /> },
      ]
    }

    if (pathname?.startsWith("/finance")) {
      return [
        { href: "/finance", label: "Overview", icon: <HomeIcon className="h-5 w-5 mr-2" /> },
        { href: "/finance/cash", label: "Cash Management", icon: <DollarSignIcon className="h-5 w-5 mr-2" /> },
        { href: "/finance/credit", label: "Credit Management", icon: <ClipboardIcon className="h-5 w-5 mr-2" /> },
        { href: "/finance/reports", label: "Reports", icon: <FileTextIcon className="h-5 w-5 mr-2" /> },
      ]
    }

    if (pathname?.startsWith("/worker")) {
      return [
        { href: "/worker", label: "Overview", icon: <HomeIcon className="h-5 w-5 mr-2" /> },
        { href: "/worker/readings", label: "Meter Readings", icon: <GaugeIcon className="h-5 w-5 mr-2" /> },
        { href: "/worker/sales", label: "Sales", icon: <DollarSignIcon className="h-5 w-5 mr-2" /> },
        { href: "/worker/performance", label: "Performance", icon: <BarChartIcon className="h-5 w-5 mr-2" /> },
      ]
    }

    if (pathname?.startsWith("/auditor")) {
      return [
        { href: "/auditor", label: "Overview", icon: <HomeIcon className="h-5 w-5 mr-2" /> },
        { href: "/auditor/transactions", label: "Transactions", icon: <ClipboardIcon className="h-5 w-5 mr-2" /> },
        {
          href: "/auditor/discrepancies",
          label: "Discrepancies",
          icon: <AlertTriangleIcon className="h-5 w-5 mr-2" />,
        },
        { href: "/auditor/compliance", label: "Compliance", icon: <FileTextIcon className="h-5 w-5 mr-2" /> },
      ]
    }

    return []
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 sm:max-w-xs">
          <SheetHeader>
            <SheetTitle>Gas Station Management</SheetTitle>
          </SheetHeader>
          <nav className="grid gap-2 py-6">
            {getNavLinks().map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
                  pathname === link.href
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <FuelIcon className="h-6 w-6" />
          <span className="hidden md:inline">Gas Station Management</span>
        </Link>
      </div>
      <div className="flex-1 flex justify-center">
        <h1 className="text-lg font-semibold">{getCurrentSection()}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
          <SearchIcon className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="outline" size="icon">
          <BellIcon className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <UserIcon className="h-5 w-5" />
              <span className="sr-only">User</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOutIcon className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

