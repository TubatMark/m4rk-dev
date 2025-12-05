/**
 * /app/(admin)/admin-portal/dashboard/hero/page.tsx
 * Hero section editor
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
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, Eye } from "lucide-react"

export default function HeroPage() {
  const heroData = useQuery(api.heroSection.get)
  const upsertHero = useMutation(api.heroSection.upsert)

  const [formData, setFormData] = React.useState({
    name: "",
    statusBadge: "",
    statusVisible: true,
    headline: "",
    subheadline: "",
    ctaPrimaryText: "",
    ctaSecondaryText: "",
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)

  React.useEffect(() => {
    if (heroData) {
      setFormData({
        name: heroData.name,
        statusBadge: heroData.statusBadge,
        statusVisible: heroData.statusVisible,
        headline: heroData.headline,
        subheadline: heroData.subheadline,
        ctaPrimaryText: heroData.ctaPrimaryText,
        ctaSecondaryText: heroData.ctaSecondaryText,
      })
    }
  }, [heroData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await upsertHero(formData)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (heroData === undefined) {
    return (
      <>
        <Header title="Hero Section" description="Edit your landing section" />
        <div className="p-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    )
  }

  return (
    <>
      <Header
        title="Hero Section"
        description="Edit your landing section"
        action={
          <Button onClick={() => window.open("/", "_blank")}>
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        }
      />

      <div className="p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={formData.headline}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, headline: e.target.value }))
                  }
                  placeholder="Hi, I'm"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Text that appears before your name
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subheadline">Subheadline</Label>
                <Textarea
                  id="subheadline"
                  value={formData.subheadline}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subheadline: e.target.value }))
                  }
                  placeholder="A passionate developer..."
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Badge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="statusVisible">Show Status Badge</Label>
                  <p className="text-xs text-muted-foreground">
                    Display availability status on hero
                  </p>
                </div>
                <Switch
                  id="statusVisible"
                  checked={formData.statusVisible}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, statusVisible: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="statusBadge">Status Text</Label>
                <Input
                  id="statusBadge"
                  value={formData.statusBadge}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, statusBadge: e.target.value }))
                  }
                  placeholder="Available for work"
                  disabled={!formData.statusVisible}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call to Action Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ctaPrimaryText">Primary Button</Label>
                  <Input
                    id="ctaPrimaryText"
                    value={formData.ctaPrimaryText}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, ctaPrimaryText: e.target.value }))
                    }
                    placeholder="View My Work"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaSecondaryText">Secondary Button</Label>
                  <Input
                    id="ctaSecondaryText"
                    value={formData.ctaSecondaryText}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, ctaSecondaryText: e.target.value }))
                    }
                    placeholder="Get In Touch"
                    required
                  />
                </div>
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
