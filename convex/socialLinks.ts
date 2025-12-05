/**
 * /convex/socialLinks.ts
 * Social links queries and mutations
 */

import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const links = await ctx.db
      .query("socialLinks")
      .withIndex("by_order")
      .collect()

    if (links.length === 0) {
      return [
        { _id: "default-1", platform: "GitHub", url: "https://github.com", icon: "Github", order: 1, visible: true },
        { _id: "default-2", platform: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin", order: 2, visible: true },
        { _id: "default-3", platform: "Email", url: "mailto:hello@example.com", icon: "Mail", order: 3, visible: true },
      ]
    }

    return links
  },
})

export const getVisible = query({
  args: {},
  handler: async (ctx) => {
    const links = await ctx.db
      .query("socialLinks")
      .withIndex("by_order")
      .collect()

    if (links.length === 0) {
      return [
        { _id: "default-1", platform: "GitHub", url: "https://github.com", icon: "Github", order: 1, visible: true },
        { _id: "default-2", platform: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin", order: 2, visible: true },
        { _id: "default-3", platform: "Email", url: "mailto:hello@example.com", icon: "Mail", order: 3, visible: true },
      ]
    }

    return links.filter((link) => link.visible)
  },
})

export const create = mutation({
  args: {
    platform: v.string(),
    url: v.string(),
    icon: v.string(),
    order: v.number(),
    visible: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("socialLinks", args)
  },
})

export const update = mutation({
  args: {
    id: v.id("socialLinks"),
    platform: v.optional(v.string()),
    url: v.optional(v.string()),
    icon: v.optional(v.string()),
    order: v.optional(v.number()),
    visible: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    await ctx.db.patch(id, updates)
  },
})

export const remove = mutation({
  args: { id: v.id("socialLinks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const reorder = mutation({
  args: {
    items: v.array(v.object({
      id: v.id("socialLinks"),
      order: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      await ctx.db.patch(item.id, { order: item.order })
    }
  },
})
