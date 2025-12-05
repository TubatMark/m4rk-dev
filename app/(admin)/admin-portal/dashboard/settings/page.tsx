/**
 * /app/(admin)/admin-portal/dashboard/settings/page.tsx
 * Site settings editor
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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Save, X, Eye } from "lucide-react"

export default function SettingsPage() {
  const settingsData = useQuery(api.siteSettings.get)
  const upsertSettings = useMutation(api.siteSettings.upsert)

  const [formData, setFormData] = React.useState({
    siteName: "",
    siteTitle: "",
    siteDescription: "",
    siteKeywords: [] as string[],
    authorName: "",
    logoText: "",
    footerTagline: "",
    copyrightName: "",
    ogImage: "",
  })
  const [keywordInput, setKeywordInput] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)

  React.useEffect(() => {
    if (settingsData) {
      setFormData({
        siteName: settingsData.siteName,
        siteTitle: settingsData.siteTitle,
        siteDescription: settingsData.siteDescription,
        siteKeywords: settingsData.siteKeywords,
        authorName: settingsData.authorName,
        logoText: settingsData.logoText,
        footerTagline: settingsData.footerTagline,
        copyrightName: settingsData.copyrightName,
        ogImage: settingsData.ogImage ?? "",
      })
    }
  }, [settingsData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await upsertSettings({
        ...formData,
        ogImage: formData.ogImage || undefined,
      })
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.siteKeywords.includes(keywordInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        siteKeywords: [...prev.siteKeywords, keywordInput.trim()],
      }))
      setKeywordInput("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      siteKeywords: prev.siteKeywords.filter((k) => k !== keyword),
    }))
  }

  if (settingsData === undefined) {
    return (
      <>
        <Header title="Site Settings" description="Configure your site settings" />
        <div className="p-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    )
  }

  return (
    <>
      <Header
        title="Site Settings"
        description="Configure your site settings"
        action={
          <Button onClick={() => window.open("/", "_blank")}>
            <Eye className="h-4 w-4" />
            Preview Site
          </Button>
        }
      />

      <div className="p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>Basic site information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={formData.siteName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, siteName: e.target.value }))
                    }
                    placeholder="Portfolio"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authorName">Author Name</Label>
                  <Input
                    id="authorName"
                    value={formData.authorName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, authorName: e.target.value }))
                    }
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteTitle">Site Title (SEO)</Label>
                <Input
                  id="siteTitle"
                  value={formData.siteTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, siteTitle: e.target.value }))
                  }
                  placeholder="John Doe | Full-Stack Developer"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This appears in browser tabs and search results
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description (SEO)</Label>
                <Textarea
                  id="siteDescription"
                  value={formData.siteDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, siteDescription: e.target.value }))
                  }
                  placeholder="A passionate full-stack developer..."
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>SEO Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Add keyword"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addKeyword()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addKeyword}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.siteKeywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 hover:bg-accent rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Logo and visual identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoText">Logo Text</Label>
                <Input
                  id="logoText"
                  value={formData.logoText}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, logoText: e.target.value }))
                  }
                  placeholder="Portfolio"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Text displayed in the navigation logo
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">Open Graph Image URL</Label>
                <Input
                  id="ogImage"
                  value={formData.ogImage}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ogImage: e.target.value }))
                  }
                  placeholder="https://example.com/og-image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Image shown when sharing on social media (1200x630 recommended)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Footer</CardTitle>
              <CardDescription>Footer content settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footerTagline">Footer Tagline</Label>
                <Textarea
                  id="footerTagline"
                  value={formData.footerTagline}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, footerTagline: e.target.value }))
                  }
                  placeholder="Building beautiful, performant web experiences..."
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="copyrightName">Copyright Name</Label>
                <Input
                  id="copyrightName"
                  value={formData.copyrightName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, copyrightName: e.target.value }))
                  }
                  placeholder="John Doe"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Appears in the copyright notice
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
