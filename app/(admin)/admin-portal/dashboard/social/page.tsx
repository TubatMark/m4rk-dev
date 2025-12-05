/**
 * /app/(admin)/admin-portal/dashboard/social/page.tsx
 * Social links management page
 */

"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Header } from "@/components/admin/header"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Loader2,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Globe,
  Facebook,
  ExternalLink,
} from "lucide-react"

const iconOptions = [
  { value: "Github", label: "GitHub", icon: Github },
  { value: "Linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "Twitter", label: "Twitter/X", icon: Twitter },
  { value: "Instagram", label: "Instagram", icon: Instagram },
  { value: "Youtube", label: "YouTube", icon: Youtube },
  { value: "Mail", label: "Email", icon: Mail },
  { value: "Globe", label: "Website", icon: Globe },
  { value: "Facebook", label: "Facebook", icon: Facebook },
]

const getIconComponent = (iconName: string) => {
  const found = iconOptions.find((opt) => opt.value === iconName)
  return found?.icon ?? Globe
}

interface SocialFormData {
  platform: string
  url: string
  icon: string
  order: number
  visible: boolean
}

const emptyForm: SocialFormData = {
  platform: "",
  url: "",
  icon: "Globe",
  order: 0,
  visible: true,
}

export default function SocialLinksPage() {
  const socialLinks = useQuery(api.socialLinks.getAll)
  const createLink = useMutation(api.socialLinks.create)
  const updateLink = useMutation(api.socialLinks.update)
  const deleteLink = useMutation(api.socialLinks.remove)

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<Id<"socialLinks"> | null>(null)
  const [deletingId, setDeletingId] = React.useState<Id<"socialLinks"> | null>(null)
  const [formData, setFormData] = React.useState<SocialFormData>(emptyForm)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isDefaultData = socialLinks?.[0]?._id?.toString().startsWith("default")

  const handleCreate = () => {
    setEditingId(null)
    const nextOrder = isDefaultData ? 1 : (socialLinks?.length ?? 0) + 1
    setFormData({ ...emptyForm, order: nextOrder })
    setIsDialogOpen(true)
  }

  const handleEdit = (link: NonNullable<typeof socialLinks>[0]) => {
    if (link._id.toString().startsWith("default")) return
    setEditingId(link._id as Id<"socialLinks">)
    setFormData({
      platform: link.platform,
      url: link.url,
      icon: link.icon,
      order: link.order,
      visible: link.visible,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: Id<"socialLinks">) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteLink({ id: deletingId })
      setDeletingId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingId) {
        await updateLink({
          id: editingId,
          ...formData,
        })
      } else {
        await createLink(formData)
      }
      setIsDialogOpen(false)
      setFormData(emptyForm)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleVisibility = async (link: NonNullable<typeof socialLinks>[0]) => {
    if (link._id.toString().startsWith("default")) return
    await updateLink({
      id: link._id as Id<"socialLinks">,
      visible: !link.visible,
    })
  }

  return (
    <>
      <Header
        title="Social Links"
        description="Manage your social media links"
        action={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Add Link
          </Button>
        }
      />

      <div className="p-6">
        {isDefaultData && (
          <div className="mb-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Showing default data. Add your own social links to customize.
            </p>
          </div>
        )}

        {socialLinks === undefined ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {socialLinks.map((link) => {
              const IconComponent = getIconComponent(link.icon)
              const isDefault = link._id.toString().startsWith("default")

              return (
                <Card key={link._id} className={isDefault ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {!isDefault && (
                        <div className="cursor-grab text-muted-foreground">
                          <GripVertical className="h-5 w-5" />
                        </div>
                      )}

                      <div className="p-2 rounded-lg bg-secondary">
                        <IconComponent className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{link.platform}</p>
                          {!link.visible && (
                            <Badge variant="outline" className="text-xs">
                              Hidden
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {link.url}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>

                        {!isDefault && (
                          <>
                            <Switch
                              checked={link.visible}
                              onCheckedChange={() => toggleVisibility(link)}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(link)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(link._id as Id<"socialLinks">)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent onClose={() => setIsDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Social Link" : "Add Social Link"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform Name</Label>
              <Input
                id="platform"
                value={formData.platform}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, platform: e.target.value }))
                }
                placeholder="GitHub"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="https://github.com/username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, icon: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="visible">Visible</Label>
                <p className="text-xs text-muted-foreground">
                  Show this link on your site
                </p>
              </div>
              <Switch
                id="visible"
                checked={formData.visible}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, visible: checked }))
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  "Update Link"
                ) : (
                  "Create Link"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Social Link"
        description="Are you sure you want to delete this social link?"
        onConfirm={confirmDelete}
      />
    </>
  )
}
