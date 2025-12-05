/**
 * /app/(admin)/admin-portal/dashboard/technologies/page.tsx
 * Technologies management page
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
  GripVertical,
  Loader2,
  X,
} from "lucide-react"

interface TechFormData {
  name: string
  order: number
}

const emptyForm: TechFormData = {
  name: "",
  order: 0,
}

export default function TechnologiesPage() {
  const technologies = useQuery(api.technologies.getAll)
  const createTech = useMutation(api.technologies.create)
  const updateTech = useMutation(api.technologies.update)
  const deleteTech = useMutation(api.technologies.remove)

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<Id<"technologies"> | null>(null)
  const [deletingId, setDeletingId] = React.useState<Id<"technologies"> | null>(null)
  const [formData, setFormData] = React.useState<TechFormData>(emptyForm)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [quickAdd, setQuickAdd] = React.useState("")

  const isDefaultData = technologies?.[0]?._id?.toString().startsWith("default")

  const handleCreate = () => {
    setEditingId(null)
    const nextOrder = isDefaultData ? 1 : (technologies?.length ?? 0) + 1
    setFormData({ ...emptyForm, order: nextOrder })
    setIsDialogOpen(true)
  }

  const handleEdit = (tech: NonNullable<typeof technologies>[0]) => {
    if (tech._id.toString().startsWith("default")) return
    setEditingId(tech._id as Id<"technologies">)
    setFormData({
      name: tech.name,
      order: tech.order,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: Id<"technologies">) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteTech({ id: deletingId })
      setDeletingId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingId) {
        await updateTech({
          id: editingId,
          ...formData,
        })
      } else {
        await createTech(formData)
      }
      setIsDialogOpen(false)
      setFormData(emptyForm)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickAdd = async () => {
    if (!quickAdd.trim()) return

    const nextOrder = isDefaultData ? 1 : (technologies?.length ?? 0) + 1
    await createTech({
      name: quickAdd.trim(),
      order: nextOrder,
    })
    setQuickAdd("")
  }

  return (
    <>
      <Header
        title="Technologies"
        description="Manage your technology stack"
        action={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Add Technology
          </Button>
        }
      />

      <div className="p-6">
        {isDefaultData && (
          <div className="mb-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Showing default data. Add your own technologies to customize this section.
            </p>
          </div>
        )}

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Quick add technology..."
                value={quickAdd}
                onChange={(e) => setQuickAdd(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleQuickAdd()
                  }
                }}
              />
              <Button onClick={handleQuickAdd} disabled={!quickAdd.trim()}>
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {technologies === undefined ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => {
                  const isDefault = tech._id.toString().startsWith("default")

                  return (
                    <Badge
                      key={tech._id}
                      variant="secondary"
                      className={`text-sm py-2 px-3 gap-2 ${
                        isDefault ? "opacity-60" : "cursor-pointer hover:bg-accent"
                      }`}
                    >
                      {!isDefault && (
                        <GripVertical className="h-3 w-3 text-muted-foreground cursor-grab" />
                      )}
                      {tech.name}
                      {!isDefault && (
                        <div className="flex items-center gap-1 ml-1">
                          <button
                            onClick={() => handleEdit(tech)}
                            className="hover:text-primary"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(tech._id as Id<"technologies">)}
                            className="hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </Badge>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent onClose={() => setIsDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Technology" : "Add Technology"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="React"
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
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Technology"
        description="Are you sure you want to delete this technology?"
        onConfirm={confirmDelete}
      />
    </>
  )
}
