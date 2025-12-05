/**
 * /components/scroll-reveal.tsx
 * Scroll reveal animation wrapper component
 * 
 * Usage:
 * import { ScrollReveal } from "@/components/scroll-reveal"
 * <ScrollReveal><YourContent /></ScrollReveal>
 */

"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { scrollReveal, fadeInUp, fadeInLeft, fadeInRight } from "@/lib/animations"

type AnimationVariant = "fadeUp" | "fadeLeft" | "fadeRight" | "scale"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  variant?: AnimationVariant
  delay?: number
  once?: boolean
  threshold?: number
}

const variants = {
  fadeUp: fadeInUp,
  fadeLeft: fadeInLeft,
  fadeRight: fadeInRight,
  scale: scrollReveal,
}

export function ScrollReveal({
  children,
  className,
  variant = "fadeUp",
  delay = 0,
  once = true,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
