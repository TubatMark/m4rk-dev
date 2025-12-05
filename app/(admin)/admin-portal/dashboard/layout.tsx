/**
 * /app/(admin)/admin-portal/dashboard/layout.tsx
 * Dashboard layout with sidebar
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { AuthGuard } from "@/components/admin/auth-guard"
import { LoginForm } from "@/components/admin/login-form"
import { Sidebar } from "@/components/admin/sidebar"
import { getToken, removeToken } from "@/lib/admin-auth"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const logout = useMutation(api.adminAuth.logout)

  const handleLogout = async () => {
    const token = getToken()
    if (token) {
      await logout({ token })
    }
    removeToken()
    router.push("/admin-portal")
  }

  const handleLoginSuccess = () => {
    router.refresh()
  }

  return (
    <AuthGuard fallback={<LoginForm onSuccess={handleLoginSuccess} />}>
      <div className="min-h-screen bg-muted/30">
        <Sidebar onLogout={handleLogout} />
        <main
          className={cn(
            "transition-all duration-300 min-h-screen",
            "ml-64"
          )}
        >
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
