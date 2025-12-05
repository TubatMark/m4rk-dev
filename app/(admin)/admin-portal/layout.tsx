/**
 * /app/(admin)/admin-portal/layout.tsx
 * Admin portal layout with authentication
 */

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "Portfolio admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
