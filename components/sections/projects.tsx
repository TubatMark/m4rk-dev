/**
 * /components/sections/projects.tsx
 * Projects section with Convex integration
 * 
 * Usage:
 * import { Projects } from "@/components/sections/projects"
 * <Projects />
 */

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ProjectCard } from "@/components/project-card"
import { ProjectSkeleton } from "@/components/project-skeleton"
import { staggerContainer } from "@/lib/animations"

const DUMMY_PROJECTS = [
  {
    _id: "1",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce platform with real-time inventory management, secure payments via Stripe, and an admin dashboard for analytics.",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    url: "https://example.com/ecommerce",
    repo: "https://github.com/example/ecommerce",
    featured: true,
  },
  {
    _id: "2",
    title: "AI Content Generator",
    description: "An AI-powered content generation tool using OpenAI's GPT-4. Features include blog post generation, SEO optimization, and multi-language support.",
    tech: ["React", "Node.js", "OpenAI API", "MongoDB", "Redis", "Docker"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    url: "https://example.com/ai-content",
    repo: "https://github.com/example/ai-content",
    featured: true,
  },
  {
    _id: "3",
    title: "Real-Time Collaboration Tool",
    description: "A collaborative whiteboard application with real-time synchronization, video chat integration, and infinite canvas for creative teams.",
    tech: ["Next.js", "WebSocket", "Canvas API", "WebRTC", "Convex", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    url: "https://example.com/collab",
    repo: "https://github.com/example/collab",
    featured: true,
  },
  {
    _id: "4",
    title: "Fitness Tracking App",
    description: "A comprehensive fitness tracking mobile app with workout plans, nutrition logging, progress charts, and social features for accountability.",
    tech: ["React Native", "Expo", "Firebase", "TensorFlow.js", "Chart.js"],
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
    url: "https://example.com/fitness",
    repo: "https://github.com/example/fitness",
    featured: false,
  },
  {
    _id: "5",
    title: "DevOps Dashboard",
    description: "A unified DevOps monitoring dashboard aggregating metrics from multiple cloud providers, CI/CD pipelines, and application logs.",
    tech: ["Vue.js", "Go", "Prometheus", "Grafana", "Kubernetes", "AWS"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    url: "https://example.com/devops",
    repo: "https://github.com/example/devops",
    featured: false,
  },
  {
    _id: "6",
    title: "Blockchain Voting System",
    description: "A secure, transparent voting system built on Ethereum blockchain with smart contracts ensuring vote integrity and anonymity.",
    tech: ["Solidity", "Ethers.js", "React", "Hardhat", "IPFS", "The Graph"],
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
    url: "https://example.com/voting",
    repo: "https://github.com/example/voting",
    featured: false,
  },
]

export function Projects() {
  const convexProjects = useQuery(api.projects.getAll)
  
  const projects = convexProjects && convexProjects.length > 0 
    ? convexProjects 
    : DUMMY_PROJECTS

  const isLoading = convexProjects === undefined

  return (
    <section id="projects" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-muted-foreground">
              A selection of my recent work. Each project represents a unique
              challenge and showcases different aspects of my skills.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <ProjectSkeleton key={index} />
              ))
            : projects.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  project={project as typeof DUMMY_PROJECTS[0]}
                  index={index}
                />
              ))}
        </motion.div>
      </div>
    </section>
  )
}
