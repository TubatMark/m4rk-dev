/**
 * /convex/messages.ts
 * Convex queries and mutations for contact form messages
 * 
 * Usage in React:
 * import { api } from "@/convex/_generated/api"
 * import { useMutation } from "convex/react"
 * 
 * const sendMessage = useMutation(api.messages.create)
 */

import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_createdAt")
      .order("desc")
      .collect()
  },
})

export const getUnread = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_read", (q) => q.eq("read", false))
      .collect()
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      ...args,
      read: false,
      createdAt: Date.now(),
    })
    return messageId
  },
})

export const markAsRead = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: true })
  },
})

export const remove = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
