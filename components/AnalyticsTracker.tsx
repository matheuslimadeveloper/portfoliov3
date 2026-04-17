"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Analytics system temporarily disabled due to blocked Blob Storage
    return

    // Não rastrear no admin
    if (pathname?.includes("/admin")) return

    const trackVisit = async () => {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: pathname || "/",
            userAgent: navigator.userAgent,
          }),
        })
      } catch (error) {
        console.error("[v0] Failed to track visit:", error)
      }
    }

    trackVisit()
  }, [pathname])

  return null
}
