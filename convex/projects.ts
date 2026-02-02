/**
 * /convex/projects.ts
 * Convex queries and mutations for projects
 * 
 * Usage in React:
 * import { api } from "@/convex/_generated/api"
 * import { useQuery, useMutation } from "convex/react"
 * 
 * const projects = useQuery(api.projects.getAll)
 * const createProject = useMutation(api.projects.create)
 */

import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .order("desc")
      .collect()
    
    const projectsWithUrls = await Promise.all(
      projects.map(async (project) => {
        let imageUrl = project.image
        if (project.image && !project.image.startsWith("http")) {
          imageUrl = await ctx.storage.getUrl(project.image) ?? undefined
        }
        return { ...project, imageUrl }
      })
    )
    
    return projectsWithUrls.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  },
})

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .collect()

    const projectsWithUrls = await Promise.all(
      projects.map(async (project) => {
        let imageUrl = project.image
        if (project.image && !project.image.startsWith("http")) {
          imageUrl = await ctx.storage.getUrl(project.image) ?? undefined
        }
        return { ...project, imageUrl }
      })
    )

    return projectsWithUrls.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  },
})

export const getById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id)
    if (!project) return null

    let imageUrl = project.image
    if (project.image && !project.image.startsWith("http")) {
      imageUrl = await ctx.storage.getUrl(project.image) ?? undefined
    }
    
    return { ...project, imageUrl }
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    tech: v.array(v.string()),
    image: v.optional(v.string()),
    url: v.optional(v.string()),
    repo: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      ...args,
      createdAt: Date.now(),
    })
    return projectId
  },
})

export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    tech: v.optional(v.array(v.string())),
    image: v.optional(v.string()),
    url: v.optional(v.string()),
    repo: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    await ctx.db.patch(id, updates)
  },
})

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existingProjects = await ctx.db.query("projects").collect()
    if (existingProjects.length > 0) {
      return { message: "Projects already seeded" }
    }

    const projects = [
      {
        title: "E-Commerce Platform",
        description: "A full-stack e-commerce platform with real-time inventory management, secure payments via Stripe, and an admin dashboard for analytics.",
        tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "Tailwind CSS"],
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
        url: "https://example.com/ecommerce",
        repo: "https://github.com/example/ecommerce",
        featured: true,
        order: 1,
      },
      {
        title: "AI Content Generator",
        description: "An AI-powered content generation tool using OpenAI's GPT-4. Features include blog post generation, SEO optimization, and multi-language support.",
        tech: ["React", "Node.js", "OpenAI API", "MongoDB", "Redis", "Docker"],
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
        url: "https://example.com/ai-content",
        repo: "https://github.com/example/ai-content",
        featured: true,
        order: 2,
      },
      {
        title: "Real-Time Collaboration Tool",
        description: "A collaborative whiteboard application with real-time synchronization, video chat integration, and infinite canvas for creative teams.",
        tech: ["Next.js", "WebSocket", "Canvas API", "WebRTC", "Convex", "Tailwind CSS"],
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
        url: "https://example.com/collab",
        repo: "https://github.com/example/collab",
        featured: true,
        order: 3,
      },
      {
        title: "Fitness Tracking App",
        description: "A comprehensive fitness tracking mobile app with workout plans, nutrition logging, progress charts, and social features for accountability.",
        tech: ["React Native", "Expo", "Firebase", "TensorFlow.js", "Chart.js"],
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
        url: "https://example.com/fitness",
        repo: "https://github.com/example/fitness",
        featured: false,
        order: 4,
      },
      {
        title: "DevOps Dashboard",
        description: "A unified DevOps monitoring dashboard aggregating metrics from multiple cloud providers, CI/CD pipelines, and application logs.",
        tech: ["Vue.js", "Go", "Prometheus", "Grafana", "Kubernetes", "AWS"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        url: "https://example.com/devops",
        repo: "https://github.com/example/devops",
        featured: false,
        order: 5,
      },
      {
        title: "Blockchain Voting System",
        description: "A secure, transparent voting system built on Ethereum blockchain with smart contracts ensuring vote integrity and anonymity.",
        tech: ["Solidity", "Ethers.js", "React", "Hardhat", "IPFS", "The Graph"],
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
        url: "https://example.com/voting",
        repo: "https://github.com/example/voting",
        featured: false,
        order: 6,
      },
    ]

    for (const project of projects) {
      await ctx.db.insert("projects", {
        ...project,
        createdAt: Date.now(),
      })
    }

    return { message: "Seeded 6 projects successfully" }
  },
})
