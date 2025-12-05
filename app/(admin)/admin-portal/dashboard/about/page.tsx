/**
 * /app/(admin)/admin-portal/dashboard/about/page.tsx
 * About section editor
 */

"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/admin/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, Eye } from "lucide-react"

export default function AboutPage() {
  const aboutData = useQuery(api.aboutSection.get)
  const upsertAbout = useMutation(api.aboutSection.upsert)

  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)

  React.useEffect(() => {
    if (aboutData) {
      setFormData({
        title: aboutData.title,
        description: aboutData.description,
      })
    }
  }, [aboutData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await upsertAbout(formData)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (aboutData === undefined) {
    return (
      <>
        <Header title="About Section" description="Edit your about section" />
        <div className="p-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    )
  }

  return (
    <>
      <Header
        title="About Section"
        description="Edit your about section"
        action={
          <Button onClick={() => window.open("/#about", "_blank")}>
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        }
      />

      <div className="p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="About Me"
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
                  placeholder="I'm a full-stack developer..."
                  rows={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Write a brief introduction about yourself
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isSaved ? (
                <>
                  <Save className="h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
