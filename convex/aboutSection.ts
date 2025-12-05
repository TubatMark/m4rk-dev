/**
 * /convex/aboutSection.ts
 * About section queries and mutations
 */

import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const get = query({
  args: {},
  handler: async (ctx) => {
    const about = await ctx.db
      .query("aboutSection")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first()

    if (!about) {
      return {
        title: "About Me",
        description: "I'm a full-stack developer with 5+ years of experience building web applications. I love creating products that make a difference and learning new technologies along the way.",
      }
    }

    return about
  },
})

export const upsert = mutation({
  args: {
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("aboutSection")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, args)
      return existing._id
    }

    return await ctx.db.insert("aboutSection", {
      key: "main",
      ...args,
    })
  },
})
