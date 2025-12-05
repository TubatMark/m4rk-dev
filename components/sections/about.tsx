/**
 * /components/sections/about.tsx
 * About section with skills and experience
 * 
 * Usage:
 * import { About } from "@/components/sections/about"
 * <About />
 */

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Code2, Palette, Rocket, Users, Wrench, Zap, Globe, Shield, Database, Cpu, Cloud, Terminal } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { staggerContainer, fadeInUp } from "@/lib/animations"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Palette,
  Rocket,
  Users,
  Wrench,
  Zap,
  Globe,
  Shield,
  Database,
  Cpu,
  Cloud,
  Terminal,
}

export function About() {
  const aboutData = useQuery(api.aboutSection.get)
  const skillsData = useQuery(api.skills.getAll)
  const technologiesData = useQuery(api.technologies.getAll)
  const statsData = useQuery(api.stats.getAll)
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {aboutData?.title ?? "About Me"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {aboutData?.description ?? "I'm a full-stack developer with experience building web applications."}
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {skillsData?.map((skill) => {
            const IconComponent = iconMap[skill.icon] ?? Code2
            return (
              <motion.div
                key={skill._id}
                variants={fadeInUp}
                className="group p-6 rounded-2xl bg-card border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-4 p-3 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{skill.title}</h3>
                <p className="text-sm text-muted-foreground">{skill.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        <ScrollReveal delay={0.2}>
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-center mb-6">
              Technologies I Work With
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {technologiesData?.map((tech, idx) => (
                <motion.span
                  key={tech._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium cursor-default"
                >
                  {tech.name}
                </motion.span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {statsData?.map((stat, index) => (
              <motion.div
                key={stat._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
