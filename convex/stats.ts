/**
 * /convex/stats.ts
 * Stats queries and mutations
 */

import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const stats = await ctx.db
      .query("stats")
      .withIndex("by_order")
      .collect()

    if (stats.length === 0) {
      return [
        { _id: "default-1", value: "5+", label: "Years Experience", order: 1 },
        { _id: "default-2", value: "50+", label: "Projects Completed", order: 2 },
        { _id: "default-3", value: "30+", label: "Happy Clients", order: 3 },
        { _id: "default-4", value: "100%", label: "Satisfaction Rate", order: 4 },
      ]
    }

    return stats
  },
})

export const create = mutation({
  args: {
    value: v.string(),
    label: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("stats", args)
  },
})

export const update = mutation({
  args: {
    id: v.id("stats"),
    value: v.optional(v.string()),
    label: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    await ctx.db.patch(id, updates)
  },
})

export const remove = mutation({
  args: { id: v.id("stats") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const reorder = mutation({
  args: {
    items: v.array(v.object({
      id: v.id("stats"),
      order: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      await ctx.db.patch(item.id, { order: item.order })
    }
  },
})
