"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase"

type SupabaseContextType = {
  supabase: SupabaseClient
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabase] = useState(() => createClient(supabaseUrl, supabaseAnonKey))

  return <SupabaseContext.Provider value={{ supabase }}>{children}</SupabaseContext.Provider>
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}

