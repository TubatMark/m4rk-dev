/**
 * /convex/heroSection.ts
 * Hero section queries and mutations
 */

import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const get = query({
  args: {},
  handler: async (ctx) => {
    const hero = await ctx.db
      .query("heroSection")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first()

    if (!hero) {
      return {
        name: "Mark Developer",
        statusBadge: "Available for work",
        statusVisible: true,
        headline: "Hi, I'm",
        subheadline: "A passionate full-stack developer crafting beautiful, performant web experiences. Turning complex problems into elegant solutions.",
        ctaPrimaryText: "View My Work",
        ctaSecondaryText: "Get In Touch",
      }
    }

    return hero
  },
})

export const upsert = mutation({
  args: {
    name: v.string(),
    statusBadge: v.string(),
    statusVisible: v.boolean(),
    headline: v.string(),
    subheadline: v.string(),
    ctaPrimaryText: v.string(),
    ctaSecondaryText: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("heroSection")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, args)
      return existing._id
    }

    return await ctx.db.insert("heroSection", {
      key: "main",
      ...args,
    })
  },
})
