'use client'

import { useTheme } from "next-themes"
import { dark } from "@clerk/themes"

export function ClerkThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <div data-clerk-theme={theme === 'dark' ? dark : undefined}>
      {children}
    </div>
  )
}