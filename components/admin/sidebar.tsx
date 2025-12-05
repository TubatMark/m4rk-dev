/**
 * /components/admin/sidebar.tsx
 * Admin dashboard sidebar navigation
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Sparkles,
  User,
  Wrench,
  Code,
  BarChart3,
  Share2,
  Briefcase,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const menuItems = [
  { label: "Dashboard", href: "/admin-portal/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/admin-portal/dashboard/projects", icon: FolderKanban },
  { label: "Messages", href: "/admin-portal/dashboard/messages", icon: MessageSquare },
  { label: "Hero Section", href: "/admin-portal/dashboard/hero", icon: Sparkles },
  { label: "About", href: "/admin-portal/dashboard/about", icon: User },
  { label: "Skills", href: "/admin-portal/dashboard/skills", icon: Wrench },
  { label: "Technologies", href: "/admin-portal/dashboard/technologies", icon: Code },
  { label: "Stats", href: "/admin-portal/dashboard/stats", icon: BarChart3 },
  { label: "Social Links", href: "/admin-portal/dashboard/social", icon: Share2 },
  { label: "Experience", href: "/admin-portal/dashboard/experience", icon: Briefcase },
  { label: "Contact", href: "/admin-portal/dashboard/contact", icon: MessageSquare },
  { label: "Settings", href: "/admin-portal/dashboard/settings", icon: Settings },
]

interface SidebarProps {
  onLogout: () => void
}

export function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <Link href="/admin-portal/dashboard" className="text-xl font-bold">
              <span className="gradient-text">Admin</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(collapsed && "mx-auto")}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-2 space-y-2">
          <div className={cn("flex items-center", collapsed ? "justify-center" : "px-3")}>
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            onClick={onLogout}
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  )
}
