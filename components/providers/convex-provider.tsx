/**
 * /components/providers/convex-provider.tsx
 * Convex client provider for React
 * 
 * Usage:
 * Wrap your app in layout.tsx:
 * import { ConvexClientProvider } from "@/components/providers/convex-provider"
 * <ConvexClientProvider>{children}</ConvexClientProvider>
 */

"use client"

import { ConvexProvider, ConvexReactClient } from "convex/react"
import { type ReactNode } from "react"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
