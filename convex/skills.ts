/**
 * /convex/skills.ts
 * Skills queries and mutations
 */

import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const skills = await ctx.db
      .query("skills")
      .withIndex("by_order")
      .collect()

    if (skills.length === 0) {
      return [
        { _id: "default-1", title: "Full-Stack Development", description: "Building end-to-end solutions with React, Next.js, Node.js, and modern databases.", icon: "Code2", order: 1 },
        { _id: "default-2", title: "UI/UX Design", description: "Creating intuitive, beautiful interfaces that users love to interact with.", icon: "Palette", order: 2 },
        { _id: "default-3", title: "Performance", description: "Optimizing applications for speed, accessibility, and search engine visibility.", icon: "Rocket", order: 3 },
        { _id: "default-4", title: "Collaboration", description: "Working effectively in teams, communicating clearly, and delivering on time.", icon: "Users", order: 4 },
      ]
    }

    return skills
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("skills", args)
  },
})

export const update = mutation({
  args: {
    id: v.id("skills"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    await ctx.db.patch(id, updates)
  },
})

export const remove = mutation({
  args: { id: v.id("skills") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const reorder = mutation({
  args: {
    items: v.array(v.object({
      id: v.id("skills"),
      order: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      await ctx.db.patch(item.id, { order: item.order })
    }
  },
})
