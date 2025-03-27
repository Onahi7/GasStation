"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User, AuthError } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null; data: any }>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  refreshSession: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      if (error) throw error
      if (session) {
        setSession(session)
        setUser(session.user)
      }
    } catch (error: any) {
      console.error("Error refreshing session:", error)
      await signOut()
    }
  }

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (session) {
          // Verify user is still active
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('is_active')
            .eq('id', session.user.id)
            .single()

          if (userError || !userData?.is_active) {
            throw new Error('Account is inactive or not found')
          }

          setSession(session)
          setUser(session.user)
        }
      } catch (error) {
        console.error("Session error:", error)
        await signOut()
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setSession(session)
        setUser(session?.user ?? null)
        router.refresh()
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        router.push('/login')
      } else if (event === 'TOKEN_REFRESHED') {
        setSession(session)
        setUser(session?.user ?? null)
      }
    })

    // Set up session refresh interval
    const refreshInterval = setInterval(refreshSession, 1000 * 60 * 30) // 30 minutes

    return () => {
      subscription.unsubscribe()
      clearInterval(refreshInterval)
    }
  }, [router, supabase.auth])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        })
      }

      return { error }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      return { error }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (!error && data.user) {
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          full_name: fullName,
          email: email,
          role: "worker",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (profileError) {
          // Cleanup: delete auth user if profile creation fails
          await supabase.auth.admin.deleteUser(data.user.id)
          throw profileError
        }

        toast({
          title: "Success",
          description: "Your account has been created successfully",
        })
      }

      if (error) {
        toast({
          title: "Error creating account",
          description: error.message,
          variant: "destructive",
        })
      }

      return { error, data }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
      return { error, data: null }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
      router.push("/login")
    } catch (error: any) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out properly",
        variant: "destructive",
      })
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

