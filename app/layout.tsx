/**
 * /app/layout.tsx
 * Root layout with providers for Convex and theme
 * 
 * This file wraps the entire application with necessary providers:
 * - ConvexClientProvider: Enables Convex real-time database
 * - ThemeProvider: Enables dark/light theme switching
 */

import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ConvexClientProvider } from "@/components/providers/convex-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Mark Developer | Full-Stack Developer Portfolio",
  description:
    "A passionate full-stack developer crafting beautiful, performant web experiences. Specializing in React, Next.js, and modern web technologies.",
  keywords: [
    "developer",
    "portfolio",
    "full-stack",
    "react",
    "next.js",
    "typescript",
    "web development",
  ],
  authors: [{ name: "Mark Developer" }],
  creator: "Mark Developer",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://markdev.com",
    title: "Mark Developer | Full-Stack Developer Portfolio",
    description:
      "A passionate full-stack developer crafting beautiful, performant web experiences.",
    siteName: "Mark Developer Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mark Developer | Full-Stack Developer Portfolio",
    description:
      "A passionate full-stack developer crafting beautiful, performant web experiences.",
    creator: "@markdev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ConvexClientProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
