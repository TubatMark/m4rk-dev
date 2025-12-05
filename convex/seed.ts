/**
 * /convex/seed.ts
 * Seed all default data for the portfolio
 */

import { mutation } from "./_generated/server"

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const results: string[] = []

    // Seed site settings
    const existingSettings = await ctx.db.query("siteSettings").first()
    if (!existingSettings) {
      await ctx.db.insert("siteSettings", {
        key: "main",
        siteName: "Portfolio",
        siteTitle: "Mark Developer | Full-Stack Developer Portfolio",
        siteDescription: "A passionate full-stack developer crafting beautiful, performant web experiences.",
        siteKeywords: ["developer", "portfolio", "full-stack", "react", "next.js", "typescript"],
        authorName: "Mark Developer",
        logoText: "Portfolio",
        footerTagline: "Building beautiful, performant web experiences one project at a time.",
        copyrightName: "Mark Developer",
      })
      results.push("Site settings seeded")
    }

    // Seed hero section
    const existingHero = await ctx.db.query("heroSection").first()
    if (!existingHero) {
      await ctx.db.insert("heroSection", {
        key: "main",
        name: "Mark Developer",
        statusBadge: "Available for work",
        statusVisible: true,
        headline: "Hi, I'm",
        subheadline: "A passionate full-stack developer crafting beautiful, performant web experiences. Turning complex problems into elegant solutions.",
        ctaPrimaryText: "View My Work",
        ctaSecondaryText: "Get In Touch",
      })
      results.push("Hero section seeded")
    }

    // Seed about section
    const existingAbout = await ctx.db.query("aboutSection").first()
    if (!existingAbout) {
      await ctx.db.insert("aboutSection", {
        key: "main",
        title: "About Me",
        description: "I'm a full-stack developer with 5+ years of experience building web applications. I love creating products that make a difference and learning new technologies along the way.",
      })
      results.push("About section seeded")
    }

    // Seed skills
    const existingSkills = await ctx.db.query("skills").first()
    if (!existingSkills) {
      const skills = [
        { title: "Full-Stack Development", description: "Building end-to-end solutions with React, Next.js, Node.js, and modern databases.", icon: "Code2", order: 1 },
        { title: "UI/UX Design", description: "Creating intuitive, beautiful interfaces that users love to interact with.", icon: "Palette", order: 2 },
        { title: "Performance", description: "Optimizing applications for speed, accessibility, and search engine visibility.", icon: "Rocket", order: 3 },
        { title: "Collaboration", description: "Working effectively in teams, communicating clearly, and delivering on time.", icon: "Users", order: 4 },
      ]
      for (const skill of skills) {
        await ctx.db.insert("skills", skill)
      }
      results.push("Skills seeded")
    }

    // Seed technologies
    const existingTech = await ctx.db.query("technologies").first()
    if (!existingTech) {
      const technologies = [
        "TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "MongoDB",
        "Convex", "Tailwind CSS", "Framer Motion", "Docker", "AWS", "Git"
      ]
      for (let i = 0; i < technologies.length; i++) {
        await ctx.db.insert("technologies", { name: technologies[i], order: i + 1 })
      }
      results.push("Technologies seeded")
    }

    // Seed stats
    const existingStats = await ctx.db.query("stats").first()
    if (!existingStats) {
      const stats = [
        { value: "5+", label: "Years Experience", order: 1 },
        { value: "50+", label: "Projects Completed", order: 2 },
        { value: "30+", label: "Happy Clients", order: 3 },
        { value: "100%", label: "Satisfaction Rate", order: 4 },
      ]
      for (const stat of stats) {
        await ctx.db.insert("stats", stat)
      }
      results.push("Stats seeded")
    }

    // Seed social links
    const existingSocial = await ctx.db.query("socialLinks").first()
    if (!existingSocial) {
      const socialLinks = [
        { platform: "GitHub", url: "https://github.com", icon: "Github", order: 1, visible: true },
        { platform: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin", order: 2, visible: true },
        { platform: "Email", url: "mailto:hello@example.com", icon: "Mail", order: 3, visible: true },
      ]
      for (const link of socialLinks) {
        await ctx.db.insert("socialLinks", link)
      }
      results.push("Social links seeded")
    }

    // Seed contact section
    const existingContact = await ctx.db.query("contactSection").first()
    if (!existingContact) {
      await ctx.db.insert("contactSection", {
        key: "main",
        title: "Get In Touch",
        description: "Have a project in mind or want to collaborate? I'd love to hear from you. Let's create something amazing together.",
        email: "hello@example.com",
        location: "San Francisco, CA",
        responseTimeText: "I typically respond within 24 hours. For urgent matters, don't hesitate to reach out directly via email.",
      })
      results.push("Contact section seeded")
    }

    return { message: results.length > 0 ? results.join(", ") : "All data already seeded" }
  },
})
