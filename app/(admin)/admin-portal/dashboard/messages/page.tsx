/**
 * /app/(admin)/admin-portal/dashboard/messages/page.tsx
 * Messages management page
 */

"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Header } from "@/components/admin/header"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Mail,
  MailOpen,
  Trash2,
  Clock,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function MessagesPage() {
  const messages = useQuery(api.messages.getAll)
  const markAsRead = useMutation(api.messages.markAsRead)
  const deleteMessage = useMutation(api.messages.remove)

  const [selectedMessage, setSelectedMessage] = React.useState<NonNullable<typeof messages>[0] | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<Id<"messages"> | null>(null)

  const handleView = async (message: NonNullable<typeof messages>[0]) => {
    setSelectedMessage(message)
    if (!message.read) {
      await markAsRead({ id: message._id })
    }
  }

  const handleDelete = (id: Id<"messages">) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteMessage({ id: deletingId })
      setDeletingId(null)
      if (selectedMessage?._id === deletingId) {
        setSelectedMessage(null)
      }
    }
  }

  const unreadCount = messages?.filter((m) => !m.read).length ?? 0

  return (
    <>
      <Header
        title="Messages"
        description={`${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`}
      />

      <div className="p-6">
        {messages === undefined ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Messages from your contact form will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <Card
                key={message._id}
                className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                  !message.read ? "border-l-4 border-l-blue-500" : ""
                }`}
                onClick={() => handleView(message)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-full bg-secondary shrink-0">
                        {message.read ? (
                          <MailOpen className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Mail className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-medium truncate ${!message.read ? "text-foreground" : "text-muted-foreground"}`}>
                            {message.name}
                          </p>
                          {!message.read && (
                            <Badge variant="default" className="bg-blue-500 text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {message.email}
                        </p>
                        <p className={`text-sm mt-1 line-clamp-2 ${!message.read ? "text-foreground" : "text-muted-foreground"}`}>
                          {message.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(new Date(message.createdAt))}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(message._id)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent onClose={() => setSelectedMessage(null)} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">From</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {formatDate(new Date(selectedMessage.createdAt))}
                  </p>
                </div>
              </div>

              <div className="text-sm">
                <p className="text-muted-foreground mb-1">Email</p>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                >
                  {selectedMessage.email}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedMessage._id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Mail className="h-4 w-4" />
                  Reply
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
        onConfirm={confirmDelete}
      />
    </>
  )
}
