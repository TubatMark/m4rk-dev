/**
 * /app/(admin)/admin-portal/dashboard/projects/page.tsx
 * Projects management page
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
  ExternalLink,
  Github,
  GripVertical,
  Loader2,
  X,
} from "lucide-react"

interface ProjectFormData {
  title: string
  description: string
  tech: string[]
  image: string
  url: string
  repo: string
  featured: boolean
  order: number
}

const emptyForm: ProjectFormData = {
  title: "",
  description: "",
  tech: [],
  image: "",
  url: "",
  repo: "",
  featured: false,
  order: 0,
}

export default function ProjectsPage() {
  const projects = useQuery(api.projects.getAll)
  const createProject = useMutation(api.projects.create)
  const updateProject = useMutation(api.projects.update)
  const deleteProject = useMutation(api.projects.remove)

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<Id<"projects"> | null>(null)
  const [deletingId, setDeletingId] = React.useState<Id<"projects"> | null>(null)
  const [formData, setFormData] = React.useState<ProjectFormData>(emptyForm)
  const [techInput, setTechInput] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleCreate = () => {
    setEditingId(null)
    setFormData({ ...emptyForm, order: (projects?.length ?? 0) + 1 })
    setTechInput("")
    setIsDialogOpen(true)
  }

  const handleEdit = (project: NonNullable<typeof projects>[0]) => {
    setEditingId(project._id)
    setFormData({
      title: project.title,
      description: project.description,
      tech: project.tech,
      image: project.image ?? "",
      url: project.url ?? "",
      repo: project.repo ?? "",
      featured: project.featured ?? false,
      order: project.order ?? 0,
    })
    setTechInput("")
    setIsDialogOpen(true)
  }

  const handleDelete = (id: Id<"projects">) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteProject({ id: deletingId })
      setDeletingId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingId) {
        await updateProject({
          id: editingId,
          ...formData,
          image: formData.image || undefined,
          url: formData.url || undefined,
          repo: formData.repo || undefined,
        })
      } else {
        await createProject({
          ...formData,
          image: formData.image || undefined,
          url: formData.url || undefined,
          repo: formData.repo || undefined,
        })
      }
      setIsDialogOpen(false)
      setFormData(emptyForm)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTech = () => {
    if (techInput.trim() && !formData.tech.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tech: [...prev.tech, techInput.trim()],
      }))
      setTechInput("")
    }
  }

  const removeTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      tech: prev.tech.filter((t) => t !== tech),
    }))
  }

  return (
    <>
      <Header
        title="Projects"
        description="Manage your portfolio projects"
        action={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        }
      />

      <div className="p-6">
        {projects === undefined ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No projects yet</p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4" />
                Add Your First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Card key={project._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    <div className="cursor-grab text-muted-foreground">
                      <GripVertical className="h-5 w-5" />
                    </div>

                    {project.image && (
                      <div className="w-20 h-14 rounded overflow-hidden bg-muted shrink-0">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{project.title}</h3>
                        {project.featured && (
                          <Badge variant="default" className="shrink-0">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {project.description}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {project.tech.slice(0, 4).map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs">
                            {t}
                          </Badge>
                        ))}
                        {project.tech.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tech.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {project.repo && (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(project._id)}
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
              {editingId ? "Edit Project" : "Add Project"}
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
                placeholder="Project title"
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
                placeholder="Project description"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Technologies</Label>
              <div className="flex gap-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Add technology"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTech()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTech}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tech.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="ml-1 hover:bg-accent rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image: e.target.value }))
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="url">Live URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repo">Repository URL</Label>
                <Input
                  id="repo"
                  value={formData.repo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, repo: e.target.value }))
                  }
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="featured">Featured Project</Label>
                <p className="text-xs text-muted-foreground">
                  Show this project prominently
                </p>
              </div>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, featured: checked }))
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
                  "Update Project"
                ) : (
                  "Create Project"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={confirmDelete}
      />
    </>
  )
}
