/**
 * /convex/schema.ts
 * Convex database schema for the portfolio
 * 
 * This defines the structure of your database tables.
 * Run `npx convex dev` to sync the schema with Convex.
 */

import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // ============== EXISTING TABLES ==============
  
  projects: defineTable({
    title: v.string(),
    description: v.string(),
    tech: v.array(v.string()),
    image: v.optional(v.string()),
    url: v.optional(v.string()),
    repo: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    order: v.optional(v.number()),
    createdAt: v.optional(v.number()),
  })
    .index("by_featured", ["featured"])
    .index("by_order", ["order"]),

  messages: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    read: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_read", ["read"])
    .index("by_createdAt", ["createdAt"]),

  // ============== ADMIN & AUTH ==============

  adminUsers: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    name: v.string(),
    role: v.string(),
    createdAt: v.number(),
    lastLogin: v.optional(v.number()),
  })
    .index("by_email", ["email"]),

  sessions: defineTable({
    userId: v.id("adminUsers"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_userId", ["userId"]),

  // ============== SITE SETTINGS ==============

  siteSettings: defineTable({
    key: v.string(),
    siteName: v.string(),
    siteTitle: v.string(),
    siteDescription: v.string(),
    siteKeywords: v.array(v.string()),
    authorName: v.string(),
    logoText: v.string(),
    footerTagline: v.string(),
    copyrightName: v.string(),
    ogImage: v.optional(v.string()),
  })
    .index("by_key", ["key"]),

  // ============== HERO SECTION ==============

  heroSection: defineTable({
    key: v.string(),
    name: v.string(),
    statusBadge: v.string(),
    statusVisible: v.boolean(),
    headline: v.string(),
    subheadline: v.string(),
    ctaPrimaryText: v.string(),
    ctaSecondaryText: v.string(),
  })
    .index("by_key", ["key"]),

  // ============== ABOUT SECTION ==============

  aboutSection: defineTable({
    key: v.string(),
    title: v.string(),
    description: v.string(),
  })
    .index("by_key", ["key"]),

  // ============== SKILLS ==============

  skills: defineTable({
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    order: v.number(),
  })
    .index("by_order", ["order"]),

  // ============== TECHNOLOGIES ==============

  technologies: defineTable({
    name: v.string(),
    order: v.number(),
  })
    .index("by_order", ["order"]),

  // ============== STATS ==============

  stats: defineTable({
    value: v.string(),
    label: v.string(),
    order: v.number(),
  })
    .index("by_order", ["order"]),

  // ============== SOCIAL LINKS ==============

  socialLinks: defineTable({
    platform: v.string(),
    url: v.string(),
    icon: v.string(),
    order: v.number(),
    visible: v.boolean(),
  })
    .index("by_order", ["order"]),

  // ============== EXPERIENCE ==============

  experience: defineTable({
    title: v.string(),
    company: v.string(),
    location: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    current: v.boolean(),
    description: v.string(),
    order: v.number(),
  })
    .index("by_order", ["order"]),

  // ============== CONTACT SECTION ==============

  contactSection: defineTable({
    key: v.string(),
    title: v.string(),
    description: v.string(),
    email: v.string(),
    location: v.string(),
    responseTimeText: v.string(),
  })
    .index("by_key", ["key"]),
})
