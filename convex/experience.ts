/**
 * /convex/experience.ts
 * Experience/timeline queries and mutations
 */

import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const experiences = await ctx.db
      .query("experience")
      .withIndex("by_order")
      .collect()

    return experiences
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    company: v.string(),
    location: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    current: v.boolean(),
    description: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("experience", args)
  },
})

export const update = mutation({
  args: {
    id: v.id("experience"),
    title: v.optional(v.string()),
    company: v.optional(v.string()),
    location: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    current: v.optional(v.boolean()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    await ctx.db.patch(id, updates)
  },
})

export const remove = mutation({
  args: { id: v.id("experience") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const reorder = mutation({
  args: {
    items: v.array(v.object({
      id: v.id("experience"),
      order: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      await ctx.db.patch(item.id, { order: item.order })
    }
  },
})
