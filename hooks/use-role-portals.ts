import { usePortalData } from "@/hooks/use-portal-data"
import { useAuth } from "@/hooks/use-auth"

export function useWorkerPortal() {
  const { user } = useAuth()
  
  const { data: shiftData, refresh: refreshShift } = usePortalData({
    path: `/shifts/current/${user?.id}`,
  })

  const { data: readingsData, refresh: refreshReadings } = usePortalData({
    path: `/readings/today/${user?.id}`,
  })

  const { data: performanceData } = usePortalData({
    path: `/performance/${user?.id}`,
  })

  return {
    shift: shiftData,
    readings: readingsData,
    performance: performanceData,
    refreshShift,
    refreshReadings,
  }
}

export function useManagerPortal() {
  const { user } = useAuth()
  
  const { data: staffData, refresh: refreshStaff } = usePortalData({
    path: `/terminals/${user?.terminalId}/staff`,
  })

  const { data: salesData } = usePortalData({
    path: `/terminals/${user?.terminalId}/sales/today`,
  })

  const { data: tanksData, refresh: refreshTanks } = usePortalData({
    path: `/terminals/${user?.terminalId}/tanks`,
  })

  return {
    staff: staffData,
    sales: salesData,
    tanks: tanksData,
    refreshStaff,
    refreshTanks,
  }
}

export function useCashierPortal() {
  const { user } = useAuth()

  const { data: cashData, refresh: refreshCash } = usePortalData({
    path: `/cash-submissions/today`,
  })

  const { data: handoversData } = usePortalData({
    path: `/cash-handovers/pending`,
  })

  const { data: expensesData } = usePortalData({
    path: `/expenses/today`,
  })

  return {
    cash: cashData,
    handovers: handoversData,
    expenses: expensesData,
    refreshCash,
  }
}

export function useAdminPortal() {
  const { user } = useAuth()

  const { data: companiesData } = usePortalData({
    path: `/companies`,
  })

  const { data: terminalsData } = usePortalData({
    path: `/terminals`,
  })

  const { data: usersData, refresh: refreshUsers } = usePortalData({
    path: `/users`,
  })

  return {
    companies: companiesData,
    terminals: terminalsData,
    users: usersData,
    refreshUsers,
  }
}
