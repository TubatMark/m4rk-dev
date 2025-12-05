/**
 * /components/providers/theme-provider.tsx
 * Theme provider for dark/light mode support
 * 
 * Usage:
 * Wrap your app in layout.tsx:
 * import { ThemeProvider } from "@/components/providers/theme-provider"
 * <ThemeProvider>{children}</ThemeProvider>
 */

"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
