import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isApiRoute = req.nextUrl.pathname.startsWith('/api/')
  const isPublicRoute = [
    '/api/auth',
    '/api/register',
    '/api/register-company'
  ].some(route => req.nextUrl.pathname.startsWith(route))

  // Allow public routes and authentication endpoints
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protect API routes
  if (isApiRoute && !token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  return NextResponse.next()
}
