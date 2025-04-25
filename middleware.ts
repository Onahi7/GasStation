import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { UserRole } from "@prisma/client";

// Define role-based route access
const roleAccess: Record<string, UserRole[]> = {
  "/portal/admin": ["ADMIN"],
  "/portal/manager": ["MANAGER", "ADMIN"],
  "/portal/cashier": ["CASHIER", "ADMIN"],
  "/portal/worker": ["WORKER", "ADMIN"],
};

export async function middleware(req) {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  // Public paths that don't require authentication
  if (
    path === "/" || 
    path === "/portal/login" || 
    path === "/register" || 
    path === "/register-company"
  ) {
    return NextResponse.next();
  }

  // Verify session token
  const token = await getToken({ req });

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/portal/login", req.url));
  }

  // For portal routes, check role-based access
  if (path.startsWith("/portal/")) {
    const userRole = token.role as UserRole;
    const baseRoute = `/${path.split("/")[1]}/${path.split("/")[2]}`;
    
    // Check if user has required role for this route
    const allowedRoles = roleAccess[baseRoute];
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
