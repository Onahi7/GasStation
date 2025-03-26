"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Default to desktop during SSR to avoid hydration mismatch
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener("change", checkMobile)
    checkMobile() // Initial check

    return () => mql.removeEventListener("change", checkMobile)
  }, [])

  return isMobile
}
