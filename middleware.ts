import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/register', '/register-company']
const ROLE_ROUTES = {
  admin: ['/admin'],
  manager: ['/manager'],
  worker: ['/worker'],
  finance: ['/finance'],
  auditor: ['/auditor'],
  cashier: ['/cashier'],
  'company-admin': ['/company-admin']
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Check session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  const path = req.nextUrl.pathname
  
  // Allow public routes
  if (PUBLIC_ROUTES.some(route => path.startsWith(route))) {
    // Redirect authenticated users away from auth pages
    if (session && (path === '/login' || path === '/register' || path === '/register-company')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return res
  }

  // Require authentication for all other routes
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Get user role
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role, is_active, company_id, terminal_id')
    .eq('id', session.user.id)
    .single()

  if (userError || !userData) {
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Check if user is active
  if (!userData.is_active) {
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/login?error=account-deactivated', req.url))
  }

  // Validate role-based access
  const userRole = userData.role
  const hasAccess = Object.entries(ROLE_ROUTES).some(([role, routes]) => {
    if (role === userRole) {
      return routes.some(route => path.startsWith(route))
    }
    return false
  })

  if (!hasAccess && path !== '/unauthorized' && path !== '/dashboard') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  // Add user context to request headers
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-user-role', userRole)
  requestHeaders.set('x-user-id', session.user.id)
  requestHeaders.set('x-company-id', userData.company_id || '')
  requestHeaders.set('x-terminal-id', userData.terminal_id || '')

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

