/**
 * /components/sections/contact.tsx
 * Contact section with form and Convex integration
 * 
 * Usage:
 * import { Contact } from "@/components/sections/contact"
 * <Contact />
 */

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Mail, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { fadeInUp, staggerContainer } from "@/lib/animations"

type FormStatus = "idle" | "loading" | "success" | "error"

export function Contact() {
  const contactData = useQuery(api.contactSection.get)

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: contactData?.email ?? "hello@example.com",
      href: `mailto:${contactData?.email ?? "hello@example.com"}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: contactData?.location ?? "San Francisco, CA",
    },
  ]
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    message: "",
  })
  const [status, setStatus] = React.useState<FormStatus>("idle")
  const [errorMessage, setErrorMessage] = React.useState("")

  const sendMessage = useMutation(api.messages.create)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      await sendMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      })
      setStatus("success")
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setStatus("idle"), 5000)
    } catch {
      setStatus("error")
      setErrorMessage("Failed to send message. Please try again.")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {contactData?.title ?? "Get In Touch"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {contactData?.description ?? "Have a project in mind or want to collaborate? I'd love to hear from you."}
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map((info) => (
              <motion.div key={info.label} variants={fadeInUp}>
                <Card className="group hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-medium">{info.value}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <motion.div variants={fadeInUp}>
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Quick Response</h3>
                  <p className="text-sm text-muted-foreground">
                    {contactData?.responseTimeText ?? "I typically respond within 24 hours. For urgent matters, don't hesitate to reach out directly via email."}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <Card>
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium leading-none"
                      >
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={status === "loading"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={status === "loading"}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell me about your project..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={status === "loading"}
                    />
                  </div>

                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-green-600 dark:text-green-400"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        Message sent successfully!
                      </span>
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-600 dark:text-red-400"
                    >
                      <AlertCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">{errorMessage}</span>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
