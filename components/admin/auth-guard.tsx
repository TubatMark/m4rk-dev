/**
 * /components/admin/auth-guard.tsx
 * Authentication guard for admin routes
 */

"use client"

import * as React from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { getToken } from "@/lib/admin-auth"

interface AuthGuardProps {
  children: React.ReactNode
  fallback: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [token, setToken] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const storedToken = getToken()
    setToken(storedToken)
    setIsLoading(false)
  }, [])

  const user = useQuery(
    api.adminAuth.validateSession,
    token ? { token } : "skip"
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!token || user === null) {
    return <>{fallback}</>
  }

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return <>{children}</>
}
