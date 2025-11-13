import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { z } from "zod"

// Use Edge Runtime to avoid serverless function size limits
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

// Function to validate if email domain is legitimate
const isValidEmailDomain = (email: string): boolean => {
  const domain = email.toLowerCase().split('@')[1]
  
  // List of fake/disposable email domains to block
  const blockedDomains = [
    'tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com',
    'mailinator.com', 'maildrop.cc', 'temp-mail.org', 'fakeinbox.com',
    'trashmail.com', 'yopmail.com', 'getnada.com', 'sharklasers.com',
    'guerrillamailblock.com', 'spam4.me', 'mintemail.com', 'emailondeck.com',
    'test.com', 'example.com', 'fake.com', 'dummy.com', 'xxx.com', 'sample.com'
  ]
  
  // Check if domain is blocked
  if (blockedDomains.some(blocked => domain === blocked || domain.endsWith('.' + blocked))) {
    return false
  }
  
  // List of known legitimate email providers
  const legitimateDomains = [
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com',
    'icloud.com', 'protonmail.com', 'zoho.com', 'aol.com', 'mail.com',
    'gmx.com', 'yandex.com', 'rediffmail.com', 'qq.com', '163.com',
    'edu', 'ac.in', 'edu.in', 'org', 'gov', 'co.in', 'in'
  ]
  
  // Check if it's a known legitimate domain or subdomain
  const isLegitimate = legitimateDomains.some(legit => 
    domain === legit || domain.endsWith('.' + legit)
  )
  
  // Must have at least one dot in domain (e.g., gmail.com not just com)
  const hasDot = domain.includes('.')
  
  // Domain must be at least 4 characters (e.g., a.co)
  const hasMinLength = domain.length >= 4
  
  return isLegitimate && hasDot && hasMinLength
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

    // Validate leader email domain
    if (!isValidEmailDomain(data.leader.email)) {
      return NextResponse.json({ 
        success: false, 
        message: "Please use a valid email address from a legitimate email provider (Gmail, Yahoo, Outlook, or educational/organizational email)" 
      }, { status: 400 })
    }

    // Validate member emails
    for (const member of data.members) {
      if (member.email && member.email.trim() && !isValidEmailDomain(member.email)) {
        return NextResponse.json({ 
          success: false, 
          message: "All team members must use valid email addresses from legitimate email providers" 
        }, { status: 400 })
      }
    }

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

    // Get current count to generate registration ID
    const { count, error: countError } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error("Supabase count error:", countError)
      throw new Error(`Database error: ${countError.message}. Make sure you've run the SQL migration in Supabase.`)
    }
    
    const regNum = (count || 0) + 1
    const regId = `H2H-2025-${String(regNum).padStart(4, "0")}`

    // Insert into Supabase
    const { data: insertedData, error } = await supabase
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
      console.error("Supabase insert error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({ success: true, regId })
  } catch (err) {
    console.error("/api/register error:", err)
    const errorMessage = err instanceof Error ? err.message : "Server error"
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}

