import type { UserRole } from "@prisma/client"

export const roleAccess: Record<string, UserRole[]> = {
  "/portal/admin": ["ADMIN"],
  "/portal/manager": ["MANAGER", "ADMIN"],
  "/portal/cashier": ["CASHIER", "ADMIN"],
  "/portal/worker": ["WORKER", "ADMIN"],
}

export function canAccessRoute(userRole: UserRole, path: string): boolean {
  const baseRoute = `/${path.split("/")[1]}/${path.split("/")[2]}`
  const allowedRoles = roleAccess[baseRoute]
  return !allowedRoles || allowedRoles.includes(userRole)
}

export function getDefaultRouteForRole(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/portal/admin"
    case "MANAGER":
      return "/portal/manager"
    case "CASHIER":
      return "/portal/cashier"
    case "WORKER":
      return "/portal/worker"
    default:
      return "/portal/login"
  }
}
