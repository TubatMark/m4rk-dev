/**
 * /components/sections/projects.tsx
 * Projects section with Convex integration
 * 
 * Usage:
 * import { Projects } from "@/components/sections/projects"
 * <Projects />
 */

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ProjectCard } from "@/components/project-card"
import { ProjectSkeleton } from "@/components/project-skeleton"
import { staggerContainer } from "@/lib/animations"

export function Projects() {
  const projects = useQuery(api.projects.getAll)
  const isLoading = projects === undefined

  return (
    <section id="projects" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-muted-foreground">
              A selection of my recent work. Each project represents a unique
              challenge and showcases different aspects of my skills.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <ProjectSkeleton key={index} />
            ))
          ) : projects && projects.length > 0 ? (
            projects.map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={index}
              />
            ))
          ) : (
             <div className="col-span-full text-center py-20">
                <p className="text-muted-foreground">No projects found. Check back later!</p>
             </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
