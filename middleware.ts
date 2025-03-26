import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const path = requestUrl.pathname

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register-company", "/forgot-password", "/reset-password"]

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(`${route}/`))

  // Skip middleware for static files and public assets
  if (path.startsWith("/_next") || path.startsWith("/api") || path.includes(".") || path.startsWith("/favicon")) {
    return NextResponse.next()
  }

  // Create a Supabase client - Fixed variable name from SUPABASE_ANON_KEY to NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({
          name,
          value,
          ...options,
        })
      },
      remove(name: string, options: any) {
        request.cookies.set({
          name,
          value: "",
          ...options,
        })
      },
    },
  })

  // Check if the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If the user is not authenticated and trying to access a protected route
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is authenticated and trying to access login or register-company
  if (user && (path === "/login" || path === "/register-company")) {
    // Get the user's role from the database
    const { data: userData, error } = await supabase.from("users").select("role, company_id").eq("id", user.id).single()

    if (error || !userData) {
      // If there's an error or no user data, sign out the user
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Redirect to the appropriate dashboard based on role
    return NextResponse.redirect(new URL(`/${userData.role}`, request.url))
  }

  // If the user is authenticated, check their role for role-based routing
  if (user && !isPublicRoute) {
    // Get the user's role from the database
    const { data: userData, error } = await supabase
      .from("users")
      .select("role, company_id, is_company_admin")
      .eq("id", user.id)
      .single()

    if (error || !userData) {
      // If there's an error or no user data, sign out the user
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const role = userData.role
    const isCompanyAdmin = userData.is_company_admin

    // Role-based routing checks
    const roleBasedPaths = {
      worker: ["/worker"],
      cashier: ["/cashier"],
      finance: ["/finance"],
      manager: ["/manager"],
      admin: ["/admin"],
    }

    // Company admin can access company admin routes
    if (isCompanyAdmin) {
      roleBasedPaths[role].push("/company-admin")
    }

    // Check if the user is trying to access a route they don't have permission for
    const hasAccess = Object.entries(roleBasedPaths).some(([userRole, paths]) => {
      if (role === userRole || role === "admin") {
        return paths.some((allowedPath) => path.startsWith(allowedPath))
      }
      return false
    })

    // If the user doesn't have access to the requested path, redirect to their dashboard
    if (!hasAccess) {
      return NextResponse.redirect(new URL(`/${role}`, request.url))
    }

    // Redirect to the appropriate dashboard if accessing /dashboard
    if (path === "/dashboard") {
      return NextResponse.redirect(new URL(`/${role}`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

