/**
 * /app/(admin)/admin-portal/dashboard/contact/page.tsx
 * Contact section editor
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

export default function ContactSectionPage() {
  const contactData = useQuery(api.contactSection.get)
  const upsertContact = useMutation(api.contactSection.upsert)

  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    email: "",
    location: "",
    responseTimeText: "",
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)

  React.useEffect(() => {
    if (contactData) {
      setFormData({
        title: contactData.title,
        description: contactData.description,
        email: contactData.email,
        location: contactData.location,
        responseTimeText: contactData.responseTimeText,
      })
    }
  }, [contactData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await upsertContact(formData)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (contactData === undefined) {
    return (
      <>
        <Header title="Contact Section" description="Edit your contact section" />
        <div className="p-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    )
  }

  return (
    <>
      <Header
        title="Contact Section"
        description="Edit your contact section"
        action={
          <Button onClick={() => window.open("/#contact", "_blank")}>
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        }
      />

      <div className="p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Content</CardTitle>
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
                  placeholder="Get In Touch"
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
                  placeholder="Have a project in mind?..."
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="hello@example.com"
                  required
                />
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

              <div className="space-y-2">
                <Label htmlFor="responseTimeText">Response Time Message</Label>
                <Textarea
                  id="responseTimeText"
                  value={formData.responseTimeText}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, responseTimeText: e.target.value }))
                  }
                  placeholder="I typically respond within 24 hours..."
                  rows={2}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This appears in the Quick Response card
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
