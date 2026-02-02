"use client"

import * as React from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Briefcase, Calendar, MapPin } from "lucide-react"

export function Experience() {
  const experiences = useQuery(api.experience.getAll)

  if (experiences === undefined) {
    return (
      <section id="experience" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <div className="h-10 w-48 bg-muted rounded-md mx-auto animate-pulse" />
            <div className="h-6 w-96 bg-muted/50 rounded-md mx-auto animate-pulse" />
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="glass-panel p-6 md:p-8 rounded-2xl relative h-48 animate-pulse bg-muted/10" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="experience" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Experience
            </h2>
            <p className="text-lg text-muted-foreground">
              My professional journey and career highlights.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto space-y-8">
          {experiences?.map((exp, index) => (
            <ScrollReveal key={exp._id} delay={index * 0.1}>
              <div className="glass-panel p-6 md:p-8 rounded-2xl relative group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Timeline connector (for visual flair) */}
                {index !== (experiences.length - 1) && (
                  <div className="absolute left-8 top-full h-8 w-0.5 bg-gradient-to-b from-primary/50 to-transparent hidden md:block" />
                )}
                
                <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Briefcase className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                      <h3 className="text-xl font-bold">{exp.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full w-fit">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-primary font-medium mb-4">
                      <span>{exp.company}</span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="text-muted-foreground text-sm flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {exp.location}
                      </span>
                    </div>
                    
                    <ul className="text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
                      {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                        <li key={i}>{line.replace(/^[•\-\*]\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
