import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Map old routes to new portal routes
const redirectMap = {
  "/dashboard": "/portal",
  "/admin": "/portal/admin",
  "/manager": "/portal/manager",
  "/cashier": "/portal/cashier",
  "/worker": "/portal/worker",
  "/login": "/portal/login",
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const path = url.pathname

  // Check if this path needs to be redirected
  const newPath = redirectMap[path]
  if (newPath) {
    url.pathname = newPath
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard',
    '/admin',
    '/manager',
    '/cashier',
    '/worker',
    '/login',
  ],
}
