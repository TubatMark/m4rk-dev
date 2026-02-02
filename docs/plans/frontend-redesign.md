# Implementation Plan: Frontend Redesign

We will update the frontend to match the new design while maintaining Convex integration.

## Tasks

### Task 1: Global Setup & Assets
**Description:** Update layout, fonts, icons, and global styles.
**Requirements:**
- Update `app/layout.tsx`:
  - Load "Space Grotesk" and "Inter" fonts via `next/font/google`.
  - Add Material Icons Link: `<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet"/>`
- Update `app/globals.css`:
  - Define new color variables (primary: #6366f1, surface colors, etc.).
  - Add utility classes from the provided HTML (`glass-panel`, `text-glow`, custom scrollbar).
  - Ensure dark mode works via class strategy.
- Update `tailwind.config.ts` (if it exists) or `app/globals.css` theme config to match new colors.

### Task 2: Navigation & Footer
**Description:** Rebuild Navigation and Footer components.
**Requirements:**
- Update `components/navigation.tsx`:
  - Match the "Glass panel" design.
  - Implement "Mark." logo with indigo dot.
  - Links: Home, About, Experience, Projects, Contact.
  - Dark mode toggle with Material Icons.
- Update `components/footer.tsx`:
  - Match the provided design (clean, multi-column).
  - Dynamic social links if possible (check `convex/socialLinks.ts`), otherwise static match first.

### Task 3: Hero Section
**Description:** Rebuild the Hero section.
**Requirements:**
- Update `components/sections/hero.tsx`:
  - Implement "Available for work" badge with pulse.
  - "Hi, I'm Mark Anthony Tubat" headline with gradient text.
  - "View My Work" and "Get In Touch" buttons.
  - Right side: 3D knot image (use the URL provided) with floating glass cards ("code", "data_object").
  - Background blobs/gradients.
  - Fetch dynamic data from `convex/heroSection.ts` if applicable, but prioritize the new design structure.

### Task 4: About & Experience Sections
**Description:** Rebuild About and Experience sections.
**Requirements:**
- Update `components/sections/about.tsx`:
  - Add "Powering Next-Gen Applications" tech stack bar (React, Next.js, etc.).
  - "About Me" text and stats grid (Years Exp, Projects, etc.).
- Create `components/sections/experience.tsx`:
  - Implement the timeline/card layout for experience.
  - Fetch data from `convex/experience.ts`.
- Update `app/page.tsx`:
  - Add `<Experience />` component between About and Projects.

### Task 5: Projects Section
**Description:** Rebuild Projects section with placeholders.
**Requirements:**
- Update `components/sections/projects.tsx`:
  - Use the new card grid layout.
  - Fetch from `api.projects.getAll`.
- Update `components/project-card.tsx`:
  - Match the new design (Hover effects, gradient overlays).
  - **Placeholder Logic:** If no `image` or `imageUrl`, use a gradient placeholder or a default fallback image pattern as seen in the HTML (or a clean solid color with ID).
  - Display tags (Next.js, TypeScript, etc.).
  - Links to View Project and Code.

### Task 6: Contact Section
**Description:** Rebuild Contact section.
**Requirements:**
- Update `components/sections/contact.tsx`:
  - "Get In Touch" header.
  - Contact info cards (Email, Location, Quick Response).
  - Contact Form (Name, Email, Message).
  - **Integration:** Connect form submission to `api.messages.send` (or similar mutation in `convex/messages.ts`).

