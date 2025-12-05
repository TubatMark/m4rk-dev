/**
 * /app/(admin)/admin-portal/dashboard/stats/page.tsx
 * Stats management page
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
} from "lucide-react"

interface StatFormData {
  value: string
  label: string
  order: number
}

const emptyForm: StatFormData = {
  value: "",
  label: "",
  order: 0,
}

export default function StatsPage() {
  const stats = useQuery(api.stats.getAll)
  const createStat = useMutation(api.stats.create)
  const updateStat = useMutation(api.stats.update)
  const deleteStat = useMutation(api.stats.remove)

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<Id<"stats"> | null>(null)
  const [deletingId, setDeletingId] = React.useState<Id<"stats"> | null>(null)
  const [formData, setFormData] = React.useState<StatFormData>(emptyForm)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isDefaultData = stats?.[0]?._id?.toString().startsWith("default")

  const handleCreate = () => {
    setEditingId(null)
    const nextOrder = isDefaultData ? 1 : (stats?.length ?? 0) + 1
    setFormData({ ...emptyForm, order: nextOrder })
    setIsDialogOpen(true)
  }

  const handleEdit = (stat: NonNullable<typeof stats>[0]) => {
    if (stat._id.toString().startsWith("default")) return
    setEditingId(stat._id as Id<"stats">)
    setFormData({
      value: stat.value,
      label: stat.label,
      order: stat.order,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: Id<"stats">) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteStat({ id: deletingId })
      setDeletingId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingId) {
        await updateStat({
          id: editingId,
          ...formData,
        })
      } else {
        await createStat(formData)
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
        title="Stats"
        description="Manage your achievement stats"
        action={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Add Stat
          </Button>
        }
      />

      <div className="p-6">
        {isDefaultData && (
          <div className="mb-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Showing default data. Add your own stats to customize this section.
            </p>
          </div>
        )}

        {stats === undefined ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const isDefault = stat._id.toString().startsWith("default")

              return (
                <Card key={stat._id} className={isDefault ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        {!isDefault && (
                          <div className="cursor-grab text-muted-foreground mt-1">
                            <GripVertical className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <p className="text-2xl font-bold gradient-text">
                            {stat.value}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {stat.label}
                          </p>
                        </div>
                      </div>

                      {!isDefault && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(stat)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(stat._id as Id<"stats">)}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
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
              {editingId ? "Edit Stat" : "Add Stat"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={formData.value}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, value: e.target.value }))
                }
                placeholder="50+"
                required
              />
              <p className="text-xs text-muted-foreground">
                e.g., 5+, 100%, 50+
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, label: e.target.value }))
                }
                placeholder="Projects Completed"
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
                  "Update Stat"
                ) : (
                  "Create Stat"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Stat"
        description="Are you sure you want to delete this stat?"
        onConfirm={confirmDelete}
      />
    </>
  )
}
