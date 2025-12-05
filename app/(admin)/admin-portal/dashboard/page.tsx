/**
 * /app/(admin)/admin-portal/dashboard/page.tsx
 * Dashboard overview page
 */

"use client"

import * as React from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/admin/header"
import { StatsCard } from "@/components/admin/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FolderKanban,
  MessageSquare,
  Mail,
  TrendingUp,
  Clock,
} from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function DashboardPage() {
  const projects = useQuery(api.projects.getAll)
  const messages = useQuery(api.messages.getAll)
  const unreadMessages = useQuery(api.messages.getUnread)

  const projectCount = projects?.length ?? 0
  const messageCount = messages?.length ?? 0
  const unreadCount = unreadMessages?.length ?? 0
  const featuredCount = projects?.filter((p) => p.featured).length ?? 0

  const recentMessages = messages?.slice(0, 5) ?? []

  return (
    <>
      <Header
        title="Dashboard"
        description="Welcome to your portfolio admin dashboard"
      />

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Projects"
            value={projectCount}
            description={`${featuredCount} featured`}
            icon={FolderKanban}
          />
          <StatsCard
            title="Total Messages"
            value={messageCount}
            icon={MessageSquare}
          />
          <StatsCard
            title="Unread Messages"
            value={unreadCount}
            description="Needs attention"
            icon={Mail}
          />
          <StatsCard
            title="Featured Projects"
            value={featuredCount}
            icon={TrendingUp}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages yet</p>
              ) : (
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <div
                      key={message._id}
                      className="flex items-start justify-between gap-4 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">
                            {message.name}
                          </p>
                          {!message.read && (
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {message.email}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {message.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <Clock className="h-3 w-3" />
                        {formatDate(new Date(message.createdAt))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                Recent Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projects?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects yet</p>
              ) : (
                <div className="space-y-4">
                  {projects?.slice(0, 5).map((project) => (
                    <div
                      key={project._id}
                      className="flex items-center justify-between gap-4 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">
                            {project.title}
                          </p>
                          {project.featured && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {project.tech.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="text-xs bg-secondary px-2 py-0.5 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
