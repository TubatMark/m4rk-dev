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
import { ArrowDown, Code, Database, Github, Linkedin, Mail, Twitter, Instagram, Youtube, Globe } from "lucide-react"
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10"
    >
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <motion.div
          className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8"
          >
            {/* Available for Work Badge */}
            <motion.div 
              variants={fadeIn}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-secondary/50 backdrop-blur-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-secondary-foreground">
                {heroData?.statusBadge ?? "Available for work"}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
            >
              <span className="block text-foreground">Hi, I&apos;m Mark Anthony Tubat</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-300% animate-gradient">
                Crafting the Future
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl lg:max-w-xl"
            >
              {heroData?.subheadline ?? "A passionate full-stack developer crafting beautiful, performant web experiences."}
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto text-base px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                onClick={scrollToProjects}
              >
                {heroData?.ctaPrimaryText ?? "View My Work"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base px-8 h-12 border-2 hover:bg-secondary/50"
                onClick={scrollToContact}
              >
                {heroData?.ctaSecondaryText ?? "Get In Touch"}
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-4 pt-4"
            >
              {socialLinksData?.map((social, index) => {
                const IconComponent = iconMap[social.icon] ?? Globe
                return (
                  <motion.a
                    key={social._id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-secondary/50 hover:bg-secondary hover:text-primary transition-all duration-300"
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

          {/* Right Column: 3D Visuals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block h-[600px] w-full"
          >
            {/* Main 3D Knot Image */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXCLoGJDBy5asfaxkyG3cKw0ky_8c_ZDa3YX5N51FF2ZV-y1iawayBUcb_UzNrGpZE8AJ88vCx0BvwjY9f300F91vkGtR2ZCp7q0T86VMnBeVLOc2dUKazpOTICgiSZ4lHt8TzMdGS8s8XiRu9C30QTXWgNSonHnpoBsKV-Cgc8BXZjm7q0q2oXGyY0xyGWCayBl2e6jcrv20or6Gt9SgVRjRXCvZRSYfYSMwxGEiXC5rWuCs7WCT8SF0T0G5OhDgpX6NkDYlc3ebt"
                alt="3D Abstract Shape"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* Floating Glass Cards */}
            <motion.div
              animate={{
                y: [0, 15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute top-20 right-20 glass-panel p-4 rounded-2xl shadow-xl backdrop-blur-md"
            >
              <Code className="w-8 h-8 text-indigo-500" />
            </motion.div>

            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute bottom-40 left-10 glass-panel p-4 rounded-2xl shadow-xl backdrop-blur-md"
            >
              <Database className="w-8 h-8 text-purple-500" />
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={floatingAnimation}
      >
        <button
          onClick={scrollToProjects}
          className="p-3 rounded-full bg-secondary/30 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
          aria-label="Scroll down"
        >
          <ArrowDown className="h-6 w-6" />
        </button>
      </motion.div>
    </section>
  )
}
