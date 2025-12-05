/**
 * /components/project-card.tsx
 * Project card component with hover effects
 * 
 * Usage:
 * import { ProjectCard } from "@/components/project-card"
 * <ProjectCard project={project} index={0} />
 */

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { fadeInUp } from "@/lib/animations"

interface Project {
  _id: string
  title: string
  description: string
  tech: string[]
  image?: string
  url?: string
  repo?: string
  featured?: boolean
}

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {project.image ? (
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <span className="text-4xl font-bold text-primary/20">
                {project.title.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {project.featured && (
            <div className="absolute top-3 right-3">
              <Badge variant="default" className="bg-primary">
                Featured
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.tech.length > 4 && (
              <Badge variant="ghost" className="text-xs">
                +{project.tech.length - 4}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 gap-3">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "default", size: "sm" }), "flex-1")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Live Demo
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1")}
            >
              <Github className="h-4 w-4 mr-2" />
              Code
            </a>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
