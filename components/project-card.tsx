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
import Image from "next/image"
import { motion } from "framer-motion"
import { ExternalLink, Github, Code2 } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { fadeInUp } from "@/lib/animations"
import { Doc } from "@/convex/_generated/dataModel"

interface ProjectWithUrl extends Doc<"projects"> {
  imageUrl?: string
}

interface ProjectCardProps {
  project: ProjectWithUrl
  index: number
}

// Deterministic gradient generator based on string input
const getGradient = (str: string) => {
  const gradients = [
    "from-pink-500 via-red-500 to-yellow-500",
    "from-blue-400 via-indigo-500 to-purple-500",
    "from-green-400 via-emerald-500 to-teal-500",
    "from-orange-400 via-amber-500 to-yellow-500",
    "from-indigo-400 via-purple-500 to-pink-500",
    "from-teal-400 via-cyan-500 to-blue-500",
  ]
  
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const index = Math.abs(hash) % gradients.length
  return gradients[index]
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const hasImage = !!(project.imageUrl || project.image)
  const displayImage = project.imageUrl || project.image
  const gradientClass = React.useMemo(() => getGradient(project._id || project.title), [project._id, project.title])

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="group h-full flex flex-col overflow-hidden border-muted-foreground/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {hasImage && displayImage ? (
            <div className="relative w-full h-full">
              <Image
                src={displayImage}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className={cn("w-full h-full flex items-center justify-center bg-gradient-to-br", gradientClass)}>
              <Code2 className="w-16 h-16 text-white/50" />
            </div>
          )}
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px] z-10">
            {project.url && (
              <motion.a
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ scale: 1.1 }}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "rounded-full h-12 w-12")}
                title="View Project"
              >
                <ExternalLink className="h-5 w-5" />
              </motion.a>
            )}
            {project.repo && (
              <motion.a
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ scale: 1.1 }}
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "rounded-full h-12 w-12")}
                title="View Code"
              >
                <Github className="h-5 w-5" />
              </motion.a>
            )}
          </div>

          {project.featured && (
            <div className="absolute top-3 right-3 z-20">
              <Badge variant="default" className="bg-primary/90 hover:bg-primary shadow-lg backdrop-blur-md">
                Featured
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="flex-grow p-6">
          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tech.slice(0, 4).map((tech) => (
              <Badge 
                key={tech} 
                variant="outline" 
                className="bg-primary/5 hover:bg-primary/10 transition-colors border-primary/10 text-xs py-1"
              >
                {tech}
              </Badge>
            ))}
            {project.tech.length > 4 && (
              <Badge variant="ghost" className="text-xs py-1">
                +{project.tech.length - 4}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 mt-auto border-t border-border/40 bg-muted/5">
           <div className="w-full flex items-center justify-between text-xs text-muted-foreground pt-4">
              <span>{project.tech[0] || 'Development'}</span>
           </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
