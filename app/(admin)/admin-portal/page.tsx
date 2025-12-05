/**
 * /app/(admin)/admin-portal/page.tsx
 * Admin portal entry page with auth guard
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/admin/auth-guard"
import { LoginForm } from "@/components/admin/login-form"

export default function AdminPortalPage() {
  const router = useRouter()
  const [loginKey, setLoginKey] = React.useState(0)

  const handleLoginSuccess = () => {
    // Force re-render of AuthGuard by changing key
    setLoginKey((k) => k + 1)
    // Also push to dashboard
    router.push("/admin-portal/dashboard")
  }

  return (
    <AuthGuard key={loginKey} fallback={<LoginForm onSuccess={handleLoginSuccess} />}>
      <RedirectToDashboard />
    </AuthGuard>
  )
}

function RedirectToDashboard() {
  const router = useRouter()

  React.useEffect(() => {
    router.push("/admin-portal/dashboard")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  )
}
