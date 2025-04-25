"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { roleThemes } from "@/lib/role-themes"
import type { ThemeConfig } from "@/types/theme"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
}

interface ThemeProviderState {
  theme: ThemeConfig
  setTheme: (theme: string) => void
}

const initialState: ThemeProviderState = {
  theme: roleThemes['worker'], // Default to worker theme
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme,
}: ThemeProviderProps) {
  const { user } = useAuth()
  const [theme, setTheme] = useState<ThemeConfig>(roleThemes[defaultTheme || 'worker'])

  useEffect(() => {
    // Update theme when user role changes
    if (user?.role) {
      setTheme(roleThemes[user.role])
    }
  }, [user?.role])

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setTheme: (role) => setTheme(roleThemes[role]),
      }}
    >
      <div className={theme.layout.maxWidth}>
        {children}
      </div>
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context.theme
}
