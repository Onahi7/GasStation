import { createServerClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import type { CookieOptions } from "@supabase/ssr"

export function getSupabaseServerClient(cookieStore?: {
  get: (name: string) => string | undefined
  set: (name: string, value: string, options: CookieOptions) => void
  remove: (name: string, options: CookieOptions) => void
}): SupabaseClient<Database> {
  // If no cookieStore is provided, create a default one
  if (!cookieStore) {
    cookieStore = {
      get: () => undefined,
      set: () => {},
      remove: () => {},
    }
    
    // Try to use next/headers in server components
    if (typeof process !== 'undefined' && process.env.NEXT_RUNTIME === 'nodejs') {
      try {
        // Only attempt to use cookies() in a server environment
        let nextCookies: any
        try {
          // Using require instead of dynamic import to avoid async complexity
          const { cookies } = require('next/headers')
          nextCookies = cookies()
        } catch (e) {
          console.warn('Failed to load next/headers:', e)
          return createServerClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
              cookies: {
                get: (name) => cookieStore!.get(name),
                set: (name, value, options) => cookieStore!.set(name, value, options),
                remove: (name, options) => cookieStore!.remove(name, options),
              },
            }
          )
        }

        if (nextCookies) {
          cookieStore = {
            get: (name) => {
              try {
                return nextCookies.get(name)?.value
              } catch (e) {
                console.warn('Failed to get cookie:', e)
                return undefined
              }
            },
            set: (name, value, options) => {
              try {
                nextCookies.set(name, value, options)
              } catch (e) {
                console.warn('Failed to set cookie:', e)
              }
            },
            remove: (name, options) => {
              try {
                nextCookies.set(name, "", { ...options, maxAge: 0 })
              } catch (e) {
                console.warn('Failed to remove cookie:', e)
              }
            },
          }
        }
      } catch (e) {
        console.warn("Could not access next/headers. Using cookie-less mode.")
      }
    }
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore!.get(name),
        set: (name, value, options) => cookieStore!.set(name, value, options),
        remove: (name, options) => cookieStore!.remove(name, options),
      },
    }
  )
}

