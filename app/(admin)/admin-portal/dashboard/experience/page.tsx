/**
 * /app/(admin)/admin-portal/dashboard/experience/page.tsx
 * Experience/timeline management page
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
import { Textarea } from "@/components/ui/textarea"
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
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Loader2,
  Briefcase,
  MapPin,
  Calendar,
} from "lucide-react"

interface ExperienceFormData {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  order: number
}

const emptyForm: ExperienceFormData = {
  title: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  order: 0,
}

export default function ExperiencePage() {
  const experiences = useQuery(api.experience.getAll)
  const createExp = useMutation(api.experience.create)
  const updateExp = useMutation(api.experience.update)
  const deleteExp = useMutation(api.experience.remove)

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<Id<"experience"> | null>(null)
  const [deletingId, setDeletingId] = React.useState<Id<"experience"> | null>(null)
  const [formData, setFormData] = React.useState<ExperienceFormData>(emptyForm)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleCreate = () => {
    setEditingId(null)
    setFormData({ ...emptyForm, order: (experiences?.length ?? 0) + 1 })
    setIsDialogOpen(true)
  }

  const handleEdit = (exp: NonNullable<typeof experiences>[0]) => {
    setEditingId(exp._id)
    setFormData({
      title: exp.title,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate ?? "",
      current: exp.current,
      description: exp.description,
      order: exp.order,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: Id<"experience">) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteExp({ id: deletingId })
      setDeletingId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingId) {
        await updateExp({
          id: editingId,
          ...formData,
          endDate: formData.current ? undefined : formData.endDate || undefined,
        })
      } else {
        await createExp({
          ...formData,
          endDate: formData.current ? undefined : formData.endDate || undefined,
        })
      }
      setIsDialogOpen(false)
      setFormData(emptyForm)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header
        title="Experience"
        description="Manage your work experience timeline"
        action={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Add Experience
          </Button>
        }
      />

      <div className="p-6">
        {experiences === undefined ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : experiences.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No experience entries yet</p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4" />
                Add Your First Experience
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <Card key={exp._id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="cursor-grab text-muted-foreground mt-1">
                      <GripVertical className="h-5 w-5" />
                    </div>

                    <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{exp.title}</h3>
                        {exp.current && (
                          <Badge variant="default" className="bg-green-500">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {exp.company}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {exp.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {exp.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(exp)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(exp._id)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent onClose={() => setIsDialogOpen(false)} className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Experience" : "Add Experience"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Senior Developer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, company: e.target.value }))
                  }
                  placeholder="Tech Corp"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="San Francisco, CA"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  placeholder="Jan 2022"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  placeholder="Dec 2023"
                  disabled={formData.current}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="current">Current Position</Label>
                <p className="text-xs text-muted-foreground">
                  I currently work here
                </p>
              </div>
              <Switch
                id="current"
                checked={formData.current}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, current: checked }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Describe your role and responsibilities..."
                rows={4}
                required
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
                  "Update Experience"
                ) : (
                  "Create Experience"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Experience"
        description="Are you sure you want to delete this experience entry?"
        onConfirm={confirmDelete}
      />
    </>
  )
}
