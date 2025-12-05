/**
 * /components/sections/hero.tsx
 * Animated hero section with call-to-action
 * 
 * Usage:
 * import { Hero } from "@/components/sections/hero"
 * <Hero />
 */

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ArrowDown, Github, Linkedin, Mail, Twitter, Instagram, Youtube, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { staggerContainer, fadeInUp, fadeIn, floatingAnimation } from "@/lib/animations"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Instagram,
  Youtube,
  Globe,
}

export function Hero() {
  const heroData = useQuery(api.heroSection.get)
  const socialLinksData = useQuery(api.socialLinks.getVisible)
  const scrollToProjects = () => {
    const element = document.querySelector("#projects")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToContact = () => {
    const element = document.querySelector("#contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {heroData?.statusVisible && (
            <motion.div variants={fadeIn} className="mb-6">
              <span className="inline-block px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                {heroData?.statusBadge ?? "Available for work"}
              </span>
            </motion.div>
          )}

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="block">{heroData?.headline ?? "Hi, I'm"}</span>
            <span className="block mt-2 gradient-text">{heroData?.name ?? "Developer"}</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            {heroData?.subheadline ?? "A passionate full-stack developer crafting beautiful, performant web experiences."}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={scrollToProjects}
            >
              {heroData?.ctaPrimaryText ?? "View My Work"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={scrollToContact}
            >
              {heroData?.ctaSecondaryText ?? "Get In Touch"}
            </Button>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-4"
          >
            {socialLinksData?.map((social, index) => {
              const IconComponent = iconMap[social.icon] ?? Globe
              return (
                <motion.a
                  key={social._id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-secondary hover:bg-accent transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="sr-only">{social.platform}</span>
                </motion.a>
              )
            })}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={floatingAnimation}
      >
        <button
          onClick={scrollToProjects}
          className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Scroll down"
        >
          <ArrowDown className="h-6 w-6" />
        </button>
      </motion.div>
    </section>
  )
}
