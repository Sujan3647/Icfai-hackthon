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

// Verify if email actually exists using regex patterns for common fake emails
const verifyEmailExists = async (email: string): Promise<{ valid: boolean; message: string }> => {
  try {
    // First, do basic domain validation
    if (!isRealEmail(email)) {
      return { valid: false, message: "Email domain is not from a trusted provider" }
    }

    const emailLocalPart = email.split('@')[0].toLowerCase()
    
    // Block obviously fake email patterns
    const fakePatterns = [
      /^test/i, /^fake/i, /^dummy/i, /^sample/i, /^demo/i,
      /^asdf/i, /^qwer/i, /^zxcv/i, /^1234/i, /^0000/i,
      /^temp/i, /^trash/i, /^spam/i, /^junk/i, /^random/i,
      /^xxx/i, /^aaa/i, /^bbb/i, /^abc123/i, /^user/i,
      /^admin$/i, /^info$/i, /^noreply$/i, /^no-reply$/i,
      /^(a+)$/, /^(1+)$/, /^[0-9]+$/, // Only letters or only numbers
      /^(.)\1{4,}/, // Same character repeated 5+ times (e.g., aaaaa)
    ]
    
    // Check if email matches any fake pattern
    for (const pattern of fakePatterns) {
      if (pattern.test(emailLocalPart)) {
        return { 
          valid: false, 
          message: "This email appears to be fake or for testing purposes. Please use your real personal email address." 
        }
      }
    }
    
    // Check email length - too short is suspicious
    if (emailLocalPart.length < 3) {
      return { 
        valid: false, 
        message: "Email address is too short. Please use a valid personal email." 
      }
    }
    
    // Block sequential patterns like abc, 123
    if (/abc|123|xyz|qwe|zxc/.test(emailLocalPart)) {
      return { 
        valid: false, 
        message: "This email contains suspicious patterns. Please use your real email address." 
      }
    }

    return { valid: true, message: "Email passed validation" }
  } catch (error) {
    console.error('Email verification error:', error)
    return { valid: true, message: "Email passed basic validation" }
  }
}

// Comprehensive email validation - checks domain legitimacy
const isRealEmail = (email: string) => {
  const domain = email.toLowerCase().split('@')[1]
  
  if (!domain) return false
  
  // Extensive list of fake/disposable/temporary email domains
  const blockedDomains = [
    // Disposable email services
    'tempmail.com', 'temp-mail.org', 'temp-mail.io', 'temp-mail.de',
    'throwaway.email', '10minutemail.com', '10minutemail.net',
    'guerrillamail.com', 'guerrillamailblock.com', 'guerrillamail.net',
    'mailinator.com', 'mailinator2.com', 'mailinator.net',
    'maildrop.cc', 'maildrop.cf', 'maildrop.ga', 'maildrop.gq', 'maildrop.ml',
    'fakeinbox.com', 'fakeinbox.net', 'fake-mail.com', 'fakemail.net',
    'trashmail.com', 'trash-mail.com', 'trashmail.net', 'trash2.com',
    'yopmail.com', 'yopmail.net', 'yopmail.fr',
    'getnada.com', 'sharklasers.com', 'spamgourmet.com',
    'spam4.me', 'mintemail.com', 'emailondeck.com',
    'tempinbox.com', 'tmailor.com', 'tmailinator.com',
    'mytrashmail.com', 'dispostable.com', 'throwawaymail.com',
    'emailtemporanea.com', 'mohmal.com', 'harakirimail.com',
    // Test/example domains
    'test.com', 'example.com', 'fake.com', 'dummy.com', 'sample.com',
    'xxx.com', 'test.org', 'example.org', 'testing.com',
    // Obviously fake patterns
    'asdf.com', 'qwerty.com', '123.com', 'abc.com',
  ]
  
  // Check if domain is in blocked list
  if (blockedDomains.some(blocked => domain === blocked || domain.endsWith('.' + blocked))) {
    return false
  }
  
  // List of verified legitimate email providers ONLY
  const trustedDomains = [
    // Major email providers
    'gmail.com', 'googlemail.com',
    'yahoo.com', 'yahoo.co.in', 'yahoo.co.uk', 'ymail.com', 'rocketmail.com',
    'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
    'icloud.com', 'me.com', 'mac.com',
    'protonmail.com', 'proton.me', 'pm.me',
    'aol.com',
    'zoho.com', 'zohomail.com',
    'mail.com',
    // Indian providers
    'rediffmail.com', 'rediff.com',
    // Educational TLDs
    '.edu', '.ac.in', '.edu.in', '.edu.au', '.ac.uk', '.edu.sg',
    // Organizational
    '.gov', '.gov.in', '.mil',
    // Corporate/Business
    '.org', '.co.in', '.in', '.com', '.net',
  ]
  
  // Check if domain matches trusted patterns
  const isTrusted = trustedDomains.some(trusted => {
    if (trusted.startsWith('.')) {
      // TLD or suffix match
      return domain.endsWith(trusted) || domain === trusted.substring(1)
    }
    return domain === trusted || domain.endsWith('.' + trusted)
  })
  
  // Domain must have at least one dot (e.g., gmail.com, not just .com)
  const hasProperStructure = domain.split('.').length >= 2 && domain.split('.').every(part => part.length > 0)
  
  // Domain must be at least 4 characters and not contain suspicious patterns
  const passesBasicChecks = domain.length >= 4 && !/^\d+\./.test(domain) && !/^test|fake|temp|trash|spam/.test(domain)
  
  return isTrusted && hasProperStructure && passesBasicChecks
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

    // Verify leader email actually exists
    const leaderEmailCheck = await verifyEmailExists(data.leader.email)
    if (!leaderEmailCheck.valid) {
      return NextResponse.json({ 
        success: false, 
        message: `Leader email verification failed: ${leaderEmailCheck.message}` 
      }, { status: 400 })
    }

    // Verify member emails
    for (let i = 0; i < data.members.length; i++) {
      const member = data.members[i]
      if (member.email && member.email.trim()) {
        const memberEmailCheck = await verifyEmailExists(member.email)
        if (!memberEmailCheck.valid) {
          return NextResponse.json({ 
            success: false, 
            message: `Member ${i + 1} email verification failed: ${memberEmailCheck.message}` 
          }, { status: 400 })
        }
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

