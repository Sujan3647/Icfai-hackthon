import { db } from "@/lib/firebase"
import { NextResponse } from "next/server"
import { z } from "zod"

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

const sanitize = (str: any): string => {
  if (typeof str !== "string") return ""
  return str.trim().replace(/[<>]/g, "")
}

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

    // Sanitize all inputs
    const sanitizedData = {
      teamName: sanitize(data.teamName),
      domain: data.domain,
      leader: {
        name: sanitize(data.leader.name),
        id: sanitize(data.leader.id),
        program: sanitize(data.leader.program),
        year: sanitize(data.leader.year),
        email: sanitize(data.leader.email),
        phone: sanitize(data.leader.phone),
      },
      members: data.members
        .filter((m) => m.name && m.name.trim())
        .map((m) => ({
          name: sanitize(m.name || ""),
          id: sanitize(m.id || ""),
          program: sanitize(m.program || ""),
          year: sanitize(m.year || ""),
          email: sanitize(m.email || ""),
          phone: sanitize(m.phone || ""),
        })),
      ideaDescription: sanitize(data.ideaDescription),
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // Get registrations collection
    const registrations = db.collection("registrations")

    // Generate registration ID
    const snapshot = await registrations.count().get()
    const count = snapshot.data().count
    const regNum = count + 1
    const regId = `H2H-2025-${String(regNum).padStart(4, "0")}`

    const doc = {
      regId,
      ...sanitizedData,
    }

    await registrations.add(doc)

    return NextResponse.json({ success: true, regId })
  } catch (err: any) {
    console.error("/api/register error:", err)
    return NextResponse.json({ success: false, message: err?.message || "Server error" }, { status: 500 })
  }
}

