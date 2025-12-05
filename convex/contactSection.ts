/**
 * /convex/contactSection.ts
 * Contact section queries and mutations
 */

import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const get = query({
  args: {},
  handler: async (ctx) => {
    const contact = await ctx.db
      .query("contactSection")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first()

    if (!contact) {
      return {
        title: "Get In Touch",
        description: "Have a project in mind or want to collaborate? I'd love to hear from you. Let's create something amazing together.",
        email: "hello@example.com",
        location: "San Francisco, CA",
        responseTimeText: "I typically respond within 24 hours. For urgent matters, don't hesitate to reach out directly via email.",
      }
    }

    return contact
  },
})

export const upsert = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    email: v.string(),
    location: v.string(),
    responseTimeText: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("contactSection")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, args)
      return existing._id
    }

    return await ctx.db.insert("contactSection", {
      key: "main",
      ...args,
    })
  },
})
