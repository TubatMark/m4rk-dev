/**
 * /convex/adminAuth.ts
 * Admin authentication queries and mutations
 */

import { query, mutation, action } from "./_generated/server"
import { v } from "convex/values"

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let token = ""
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

function simpleHash(password: string): string {
  let hash = 0
  const salt = "portfolio_admin_salt_2024"
  const salted = salt + password + salt
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(16, "0")
}

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first()

    if (!user) {
      throw new Error("Invalid credentials")
    }

    const passwordHash = simpleHash(args.password)
    if (user.passwordHash !== passwordHash) {
      throw new Error("Invalid credentials")
    }

    await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect()
      .then((sessions) => {
        sessions.forEach((session) => ctx.db.delete(session._id))
      })

    const token = generateToken()
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000

    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
      createdAt: Date.now(),
    })

    await ctx.db.patch(user._id, { lastLogin: Date.now() })

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  },
})

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first()

    if (session) {
      await ctx.db.delete(session._id)
    }

    return { success: true }
  },
})

export const validateSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    if (!args.token) return null

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first()

    if (!session) return null
    if (session.expiresAt < Date.now()) {
      return null
    }

    const user = await ctx.db.get(session.userId)
    if (!user) return null

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  },
})

export const createInitialAdmin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existingAdmins = await ctx.db.query("adminUsers").collect()
    if (existingAdmins.length > 0) {
      throw new Error("Admin already exists. Use the admin panel to create more users.")
    }

    const passwordHash = simpleHash(args.password)

    const userId = await ctx.db.insert("adminUsers", {
      email: args.email.toLowerCase(),
      passwordHash,
      name: args.name,
      role: "admin",
      createdAt: Date.now(),
    })

    return { userId, message: "Initial admin created successfully" }
  },
})

export const changePassword = mutation({
  args: {
    token: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first()

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Invalid session")
    }

    const user = await ctx.db.get(session.userId)
    if (!user) {
      throw new Error("User not found")
    }

    const currentHash = simpleHash(args.currentPassword)
    if (user.passwordHash !== currentHash) {
      throw new Error("Current password is incorrect")
    }

    const newHash = simpleHash(args.newPassword)
    await ctx.db.patch(user._id, { passwordHash: newHash })

    return { success: true }
  },
})

export const getAdminUsers = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first()

    if (!session || session.expiresAt < Date.now()) {
      return []
    }

    const currentUser = await ctx.db.get(session.userId)
    if (!currentUser || currentUser.role !== "admin") {
      return []
    }

    const users = await ctx.db.query("adminUsers").collect()
    return users.map((u) => ({
      id: u._id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
    }))
  },
})

export const checkAdminExists = query({
  args: {},
  handler: async (ctx) => {
    const admins = await ctx.db.query("adminUsers").collect()
    return {
      exists: admins.length > 0,
      count: admins.length,
      emails: admins.map((a) => a.email),
    }
  },
})
