import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { z } from "zod"

// Use Edge runtime for better performance
export const runtime = 'edge'

const personSchema = z.object({
  name: z.string().min(1).optional().or(z.literal("")),
  id: z.string().optional().or(z.literal("")),
  program: z.string().optional().or(z.literal("")),
  year: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
}).refine((data) => {
  // If name is provided, all fields must be provided
  if (data.name && data.name.trim()) {
    return (
      data.id && data.id.trim() &&
      data.program && data.program.trim() &&
      data.year && data.year.trim() &&
      data.email && data.email.trim() &&
      data.phone && data.phone.trim()
    )
  }
  return true
}, {
  message: "When member name is provided, all member fields are required"
})

const sanitize = (str: string | undefined): string => {
  if (typeof str !== "string") return ""
  return str.trim().replace(/[<>]/g, "")
}

const registrationSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
  domain: z.enum(["Blockchain", "AIML", "Open Innovation"]),
  leader: z.object({
    name: z.string().min(1, "Leader name is required"),
    id: z.string().min(1, "Leader student ID is required"),
    program: z.string().min(1, "Leader program is required"),
    year: z.string().min(1, "Leader year is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
  }),
  members: z.array(personSchema).max(3),
  ideaDescription: z.string().min(1, "Idea description is required"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate with Zod
    const validation = registrationSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map((e) => e.message).join(", ")
      return NextResponse.json({ success: false, message: errors }, { status: 400 })
    }

    const data = validation.data

    // Email validation removed - accepting all emails

    // Sanitize all inputs
    const sanitizedLeader = {
      name: sanitize(data.leader.name),
      id: sanitize(data.leader.id),
      program: sanitize(data.leader.program),
      year: sanitize(data.leader.year),
      email: sanitize(data.leader.email),
      phone: sanitize(data.leader.phone),
    }

    const sanitizedMembers = data.members
      .filter((m) => m.name && m.name.trim())
      .map((m) => ({
        name: sanitize(m.name || ""),
        id: sanitize(m.id || ""),
        program: sanitize(m.program || ""),
        year: sanitize(m.year || ""),
        email: sanitize(m.email || ""),
        phone: sanitize(m.phone || ""),
      }))

    // Generate unique registration ID with retry logic
    let regId = ""
    let insertedData = null
    const maxRetries = 10
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Generate a truly unique ID using timestamp and random values
        const timestamp = Date.now()
        const random = Math.floor(Math.random() * 10000)
        const attemptSuffix = attempt > 0 ? `-R${attempt}` : ''
        regId = `H2H-2025-${timestamp}-${String(random).padStart(4, "0")}${attemptSuffix}`

        // Insert into Supabase
        const { data: insertResult, error } = await supabase
          .from('registrations')
          .insert({
            reg_id: regId,
            team_name: sanitize(data.teamName),
            domain: data.domain,
            leader: sanitizedLeader,
            members: sanitizedMembers,
            idea_description: sanitize(data.ideaDescription),
            status: "pending",
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) {
          // If it's a duplicate key error, retry with a new ID
          if (error.code === '23505') {
            console.log(`Duplicate ID ${regId}, retrying... (attempt ${attempt + 1}/${maxRetries})`)
            await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1))) // Exponential backoff
            continue
          }
          // For other errors, throw immediately
          console.error("Supabase insert error:", error)
          throw new Error(`Database error: ${error.message}`)
        }

        // Success!
        insertedData = insertResult
        break
      } catch (err) {
        if (attempt === maxRetries - 1) {
          throw err
        }
      }
    }

    if (!insertedData) {
      throw new Error("Failed to generate unique registration ID after multiple attempts")
    }

    return NextResponse.json({ success: true, regId })
  } catch (err) {
    console.error("/api/register error:", err)
    const errorMessage = err instanceof Error ? err.message : "Server error"
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}

