/**
 * /app/(admin)/admin-portal/dashboard/skills/page.tsx
 * Skills management page
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
import { Card, CardContent } from "@/components/ui/card"
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
  Code2,
  Palette,
  Rocket,
  Users,
  Wrench,
  Zap,
  Globe,
  Shield,
  Database,
  Cpu,
  Cloud,
  Terminal,
} from "lucide-react"

const iconOptions = [
  { value: "Code2", label: "Code", icon: Code2 },
  { value: "Palette", label: "Palette", icon: Palette },
  { value: "Rocket", label: "Rocket", icon: Rocket },
  { value: "Users", label: "Users", icon: Users },
  { value: "Wrench", label: "Wrench", icon: Wrench },
  { value: "Zap", label: "Zap", icon: Zap },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Shield", label: "Shield", icon: Shield },
  { value: "Database", label: "Database", icon: Database },
  { value: "Cpu", label: "CPU", icon: Cpu },
  { value: "Cloud", label: "Cloud", icon: Cloud },
  { value: "Terminal", label: "Terminal", icon: Terminal },
]

const getIconComponent = (iconName: string) => {
  const found = iconOptions.find((opt) => opt.value === iconName)
  return found?.icon ?? Code2
}

interface SkillFormData {
  title: string
  description: string
  icon: string
  order: number
}

const emptyForm: SkillFormData = {
  title: "",
  description: "",
  icon: "Code2",
  order: 0,
}

export default function SkillsPage() {
  const skills = useQuery(api.skills.getAll)
  const createSkill = useMutation(api.skills.create)
  const updateSkill = useMutation(api.skills.update)
  const deleteSkill = useMutation(api.skills.remove)

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<Id<"skills"> | null>(null)
  const [deletingId, setDeletingId] = React.useState<Id<"skills"> | null>(null)
  const [formData, setFormData] = React.useState<SkillFormData>(emptyForm)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isDefaultData = skills?.[0]?._id?.toString().startsWith("default")

  const handleCreate = () => {
    setEditingId(null)
    const nextOrder = isDefaultData ? 1 : (skills?.length ?? 0) + 1
    setFormData({ ...emptyForm, order: nextOrder })
    setIsDialogOpen(true)
  }

  const handleEdit = (skill: NonNullable<typeof skills>[0]) => {
    if (skill._id.toString().startsWith("default")) return
    setEditingId(skill._id as Id<"skills">)
    setFormData({
      title: skill.title,
      description: skill.description,
      icon: skill.icon,
      order: skill.order,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: Id<"skills">) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteSkill({ id: deletingId })
      setDeletingId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingId) {
        await updateSkill({
          id: editingId,
          ...formData,
        })
      } else {
        await createSkill(formData)
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
        title="Skills"
        description="Manage your skill cards"
        action={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        }
      />

      <div className="p-6">
        {isDefaultData && (
          <div className="mb-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Showing default data. Add your own skills to customize this section.
            </p>
          </div>
        )}

        {skills === undefined ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {skills.map((skill) => {
              const IconComponent = getIconComponent(skill.icon)
              const isDefault = skill._id.toString().startsWith("default")

              return (
                <Card key={skill._id} className={isDefault ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {!isDefault && (
                        <div className="cursor-grab text-muted-foreground mt-1">
                          <GripVertical className="h-5 w-5" />
                        </div>
                      )}

                      <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{skill.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {skill.description}
                        </p>
                      </div>

                      {!isDefault && (
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(skill)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(skill._id as Id<"skills">)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      )}
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
              {editingId ? "Edit Skill" : "Add Skill"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Full-Stack Development"
                required
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
                placeholder="Building end-to-end solutions..."
                rows={3}
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
                  "Update Skill"
                ) : (
                  "Create Skill"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Skill"
        description="Are you sure you want to delete this skill? This action cannot be undone."
        onConfirm={confirmDelete}
      />
    </>
  )
}
