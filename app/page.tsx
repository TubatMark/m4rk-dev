/**
 * /app/page.tsx
 * Main portfolio page with all sections
 * 
 * This page imports and composes all the section components:
 * - Navigation (fixed header)
 * - Hero (landing section)
 * - About (skills and experience)
 * - Projects (portfolio showcase)
 * - Contact (contact form)
 * - Footer
 */

import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Experience } from "@/components/sections/experience"
import { Projects } from "@/components/sections/projects"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
