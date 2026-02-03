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
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Zap, Code, Layers, Database as Storage, Palette, Terminal, Cpu, Database, Layout, Globe, Rocket, Users, Shield, Cpu as IconCpu } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { motion } from "framer-motion"

const iconMap: Record<string, any> = {
  code: Code,
  layers: Layers,
  storage: Storage,
  palette: Palette,
  terminal: Terminal,
  cpu: Cpu,
  database: Database,
  layout: Layout,
  globe: Globe,
  rocket: Rocket,
  users: Users,
  shield: Shield,
  Code2: Code,
  Palette: Palette,
  Rocket: Rocket,
  Users: Users,
}

export function About() {
  const aboutData = useQuery(api.aboutSection.get)
  const statsData = useQuery(api.stats.getAll)
  const technologiesData = useQuery(api.technologies.getAll)
  const skillsData = useQuery(api.skills.getAll)
  const projectsData = useQuery(api.projects.getAll)
  
  // Loading state prevents layout shifts
  if (aboutData === undefined || technologiesData === undefined || skillsData === undefined || projectsData === undefined) {
    return (
      <section id="about" className="py-24 md:py-32 relative overflow-hidden">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
               <div className="h-12 w-48 bg-muted rounded-md mx-auto md:mx-0"></div>
               <div className="h-32 w-full max-w-2xl bg-muted rounded-md"></div>
            </div>
         </div>
      </section>
    )
  }

  // Double the data for infinite scroll effect
  const carouselItems = [...technologiesData, ...technologiesData]

  // Process stats to include real project count
  const processedStats = statsData?.map(stat => {
    if (stat.label.toLowerCase().includes("project")) {
      return {
        ...stat,
        value: `${projectsData.length}+`
      }
    }
    return stat
  })

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-border" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                {aboutData?.title ?? "About Me"}
              </h2>
              <div className="prose prose-lg dark:prose-invert text-muted-foreground">
                <p>
                  {aboutData?.description ?? 
                    "I'm a full-stack developer with experience building web applications. I specialize in modern technologies and best practices to deliver high-quality software."}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                {processedStats?.map((stat) => (
                  <div key={stat._id} className="glass-panel p-4 rounded-xl border-l-4 border-l-primary">
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="glass-panel p-8 rounded-2xl relative">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Zap className="text-primary" />
                  Technical Expertise
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {skillsData.map((skill) => {
                    const Icon = iconMap[skill.icon] || Code
                    return (
                      <div key={skill._id} className="p-4 rounded-xl bg-secondary/30 border border-secondary/50 hover:border-primary/50 transition-all group">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                            <Icon size={20} />
                          </div>
                          <h4 className="font-bold text-sm">{skill.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{skill.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Technologies Carousel */}
        <ScrollReveal delay={0.2}>
          <div className="relative mt-20">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Powering Next-Gen Applications With</p>
              <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
            </div>

            <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
              <motion.div 
                className="flex gap-8 py-4 whitespace-nowrap"
                animate={{
                  x: ["0%", "-50%"],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {carouselItems.map((tech, idx) => (
                  <div 
                    key={`${tech._id}-${idx}`}
                    className="flex items-center gap-3 px-6 py-3 glass-panel rounded-full border border-primary/10 hover:border-primary/50 transition-colors group cursor-default"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Cpu size={16} />
                    </div>
                    <span className="font-display font-medium text-foreground">{tech.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
