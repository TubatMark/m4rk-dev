/**
 * /convex/technologies.ts
 * Technologies queries and mutations
 */

import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const technologies = await ctx.db
      .query("technologies")
      .withIndex("by_order")
      .collect()

    if (technologies.length === 0) {
      return [
        { _id: "default-1", name: "TypeScript", order: 1 },
        { _id: "default-2", name: "React", order: 2 },
        { _id: "default-3", name: "Next.js", order: 3 },
        { _id: "default-4", name: "Node.js", order: 4 },
        { _id: "default-5", name: "PostgreSQL", order: 5 },
        { _id: "default-6", name: "MongoDB", order: 6 },
        { _id: "default-7", name: "Convex", order: 7 },
        { _id: "default-8", name: "Tailwind CSS", order: 8 },
        { _id: "default-9", name: "Framer Motion", order: 9 },
        { _id: "default-10", name: "Docker", order: 10 },
        { _id: "default-11", name: "AWS", order: 11 },
        { _id: "default-12", name: "Git", order: 12 },
      ]
    }

    return technologies
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("technologies", args)
  },
})

export const update = mutation({
  args: {
    id: v.id("technologies"),
    name: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    await ctx.db.patch(id, updates)
  },
})

export const remove = mutation({
  args: { id: v.id("technologies") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const reorder = mutation({
  args: {
    items: v.array(v.object({
      id: v.id("technologies"),
      order: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      await ctx.db.patch(item.id, { order: item.order })
    }
  },
})
