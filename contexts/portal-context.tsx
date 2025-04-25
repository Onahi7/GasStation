"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { useAuth } from "@/hooks/use-auth"
import { usePortalData } from "@/hooks/use-portal-data"

interface PortalContextType {
  notifications: any[]
  unreadCount: number
  companyData: any
  terminalData: any
  refreshData: () => void
}

const PortalContext = createContext<PortalContextType>({
  notifications: [],
  unreadCount: 0,
  companyData: null,
  terminalData: null,
  refreshData: () => {},
})

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch company data
  const { 
    data: companyData, 
    refresh: refreshCompany 
  } = usePortalData({
    path: `/companies/${user?.companyId}`,
  })

  // Fetch terminal data if user is assigned to a terminal
  const { 
    data: terminalData, 
    refresh: refreshTerminal 
  } = usePortalData({
    path: `/terminals/${user?.terminalId}`,
  })

  // Fetch notifications with real-time updates
  const {
    data: notifications,
    refresh: refreshNotifications,
  } = usePortalData({
    path: "/notifications",
    revalidateOnFocus: true,
  })

  // Update unread count when notifications change
  useEffect(() => {
    if (notifications) {
      setUnreadCount(notifications.filter((n: any) => !n.read).length)
    }
  }, [notifications])

  // Function to refresh all data
  const refreshData = () => {
    refreshCompany()
    refreshTerminal()
    refreshNotifications()
  }

  return (
    <PortalContext.Provider
      value={{
        notifications,
        unreadCount,
        companyData,
        terminalData,
        refreshData,
      }}
    >
      {children}
    </PortalContext.Provider>
  )
}

export const usePortal = () => useContext(PortalContext)
