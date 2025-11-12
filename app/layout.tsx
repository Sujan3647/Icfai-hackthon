import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HACK-TO-HIRE Ideathon 2025 | ICFAI University Tripura",
  description: "From Concept to Creation — Hack It Out! Register for HACK-TO-HIRE Ideathon organized by Startup Incubation Center, IIC, ICFAI University Tripura",
  keywords: "hackathon, ideathon, ICFAI University, Tripura, blockchain, AIML, innovation, coding competition",
  authors: [{ name: "ICFAI University Tripura" }],
  openGraph: {
    title: "HACK-TO-HIRE Ideathon 2025",
    description: "From Concept to Creation — Hack It Out!",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <div className="relative min-h-screen">
          {/* Animated Grid Background */}
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
