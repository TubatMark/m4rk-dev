/**
 * /components/footer.tsx
 * Footer component with social links
 * 
 * Usage:
 * import { Footer } from "@/components/footer"
 * <Footer />
 */

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Github, Linkedin, Twitter, Heart, Mail, Instagram, Youtube, Globe, Facebook } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Instagram,
  Youtube,
  Globe,
  Facebook,
}

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
]

export function Footer() {
  const siteSettings = useQuery(api.siteSettings.get)
  const socialLinksData = useQuery(api.socialLinks.getVisible)
  const currentYear = new Date().getFullYear()

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <a
              href="#home"
              className="text-xl font-bold tracking-tight"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick("#home")
              }}
            >
              <span className="gradient-text">{siteSettings?.logoText ?? "Portfolio"}</span>
            </a>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
              {siteSettings?.footerTagline ?? "Building beautiful, performant web experiences one project at a time."}
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {socialLinksData?.map((social) => {
              const IconComponent = iconMap[social.icon] ?? Globe
              return (
                <motion.a
                  key={social._id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-secondary hover:bg-accent transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="sr-only">{social.platform}</span>
                </motion.a>
              )
            })}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            &copy; {currentYear} {siteSettings?.copyrightName ?? "Developer"}. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using Next.js & Convex
          </p>
        </div>
      </div>
    </footer>
  )
}
