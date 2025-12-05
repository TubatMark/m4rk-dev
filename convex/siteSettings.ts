/**
 * /convex/siteSettings.ts
 * Site settings queries and mutations
 */

import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first()

    if (!settings) {
      return {
        siteName: "Portfolio",
        siteTitle: "Mark Developer | Full-Stack Developer Portfolio",
        siteDescription: "A passionate full-stack developer crafting beautiful, performant web experiences.",
        siteKeywords: ["developer", "portfolio", "full-stack", "react", "next.js"],
        authorName: "Mark Developer",
        logoText: "Portfolio",
        footerTagline: "Building beautiful, performant web experiences one project at a time.",
        copyrightName: "Mark Developer",
        ogImage: "",
      }
    }

    return settings
  },
})

export const upsert = mutation({
  args: {
    siteName: v.string(),
    siteTitle: v.string(),
    siteDescription: v.string(),
    siteKeywords: v.array(v.string()),
    authorName: v.string(),
    logoText: v.string(),
    footerTagline: v.string(),
    copyrightName: v.string(),
    ogImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, args)
      return existing._id
    }

    return await ctx.db.insert("siteSettings", {
      key: "main",
      ...args,
    })
  },
})
