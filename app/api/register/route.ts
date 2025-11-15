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

// Verify if email actually exists using Abstract API (100 free/month)
// Sign up at: https://app.abstractapi.com/api/email-validation/tester
const verifyEmailExists = async (email: string): Promise<{ valid: boolean; message: string }> => {
  try {
    // First, do basic domain validation
    if (!isRealEmail(email)) {
      return { valid: false, message: "Email domain is not from a trusted provider" }
    }

    const emailLocalPart = email.split('@')[0].toLowerCase()
    
    // EXPANDED - Block ALL fake email patterns
    const fakePatterns = [
      // Common fake prefixes
      /^test/i, /^fake/i, /^dummy/i, /^sample/i, /^demo/i,
      /^asdf/i, /^qwer/i, /^zxcv/i, /^1234/i, /^0000/i,
      /^temp/i, /^trash/i, /^spam/i, /^junk/i, /^random/i,
      /^xxx/i, /^aaa/i, /^bbb/i, /^abc123/i, /^user/i,
      /^admin$/i, /^info$/i, /^noreply$/i, /^no-reply$/i,
      // Keyboard patterns
      /qwert/i, /asdfg/i, /zxcvb/i, /poiuy/i, /lkjhg/i,
      // Sequential numbers
      /12345/i, /54321/i, /11111/i, /00000/i, /99999/i,
      // Common test patterns
      /testuser/i, /fakeuser/i, /tempuser/i, /demouser/i,
      /example/i, /testmail/i, /fakemail/i,
      // Repeated patterns
      /^(a+)$/, /^(1+)$/, /^[0-9]+$/, // Only letters or only numbers
      /^(.)\1{4,}/, // Same character repeated 5+ times
      /^(..)\1{2,}/, // Two characters repeated 3+ times (e.g., ababab)
      // Random gibberish patterns
      /^[a-z]{15,}$/i, // Very long single word without numbers
      /^[0-9]{5,}[a-z]*$/i, // Starts with 5+ numbers
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
    if (/abc|123|xyz|qwe|zxc|567|890|mno|pqr|stu|vwx/.test(emailLocalPart)) {
      return { 
        valid: false, 
        message: "This email contains suspicious patterns. Please use your real email address." 
      }
    }

    // Abstract API Email Validation - MANDATORY CHECK
    const abstractApiKey = '99b0f19622bc44008df7b05ebde6da28'
    
    try {
      const response = await fetch(
        `https://emailvalidation.abstractapi.com/v1/?api_key=${abstractApiKey}&email=${encodeURIComponent(email)}`,
        { 
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        
        console.log('Email verification response:', data) // Debug log
        
        // STRICT: Reject if not DELIVERABLE
        if (data.deliverability !== "DELIVERABLE") {
          return {
            valid: false,
            message: "This email address cannot be verified or does not exist. Please use a valid, active email address."
          }
        }
        
        // Block disposable emails
        if (data.is_disposable_email?.value === true) {
          return {
            valid: false,
            message: "Disposable email addresses are not allowed. Please use a permanent email address."
          }
        }
        
        // Block if it's not a valid format
        if (data.is_valid_format?.value === false) {
          return {
            valid: false,
            message: "Invalid email format. Please check your email address."
          }
        }
        
        // Block catch-all emails (often used for fake registrations)
        if (data.is_catchall_email?.value === true) {
          return {
            valid: false,
            message: "Catch-all email addresses are not allowed. Please use a specific email address."
          }
        }
        
        // Block if MX records don't exist
        if (data.is_mx_found?.value === false) {
          return {
            valid: false,
            message: "Email domain does not have valid mail servers. Please use a valid email provider."
          }
        }
        
        // Block if SMTP check fails
        if (data.is_smtp_valid?.value === false) {
          return {
          valid: false,
            message: "Email address failed SMTP verification. This email may not exist."
          }
        }
        
        // All checks passed
        return { valid: true, message: "Email verified successfully" }
      } else {
        // API call failed - REJECT for security
        return {
          valid: false,
          message: "Unable to verify email at this time. Please try again later or contact support."
        }
      }
    } catch (apiError) {
      // API error - REJECT for security (don't allow through)
      console.error('Email verification API error:', apiError)
      return {
        valid: false,
        message: "Email verification service unavailable. Please try again in a few minutes."
      }
    }
  } catch (error) {
    console.error('Email verification error:', error)
    return { 
      valid: false, 
      message: "Email validation failed. Please ensure you're using a valid email address." 
    }
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
    'outlook.com', 'hotmail.com', 'live.com', 'live.in', 'msn.com',
    'icloud.com', 'me.com', 'mac.com',
    'protonmail.com', 'proton.me', 'pm.me',
    'aol.com',
    'zoho.com', 'zohomail.com',
    'mail.com',
    // Indian providers
    'rediffmail.com', 'rediff.com',
  ]
  
  // Check if domain is an exact match with trusted providers
  const isTrusted = trustedDomains.includes(domain)
  
  // OR check if it's a valid educational/government domain
  const isEducational = domain.endsWith('.edu') || domain.endsWith('.ac.in') || 
                        domain.endsWith('.edu.in') || domain.endsWith('.edu.au') || 
                        domain.endsWith('.ac.uk') || domain.endsWith('.edu.sg')
  
  const isGovernment = domain.endsWith('.gov') || domain.endsWith('.gov.in') || 
                       domain.endsWith('.mil')
  
  // Accept ONLY if it's a trusted provider OR educational OR government
  const isDomainTrusted = isTrusted || isEducational || isGovernment
  
  // Domain must have at least one dot (e.g., gmail.com, not just .com)
  const hasProperStructure = domain.split('.').length >= 2 && domain.split('.').every(part => part.length > 0)
  
  // Domain must be at least 4 characters and not contain suspicious patterns
  const passesBasicChecks = domain.length >= 4 && !/^\d+\./.test(domain) && !/^test|fake|temp|trash|spam/.test(domain)
  
  return isDomainTrusted && hasProperStructure && passesBasicChecks
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
    let maxRetries = 10
    
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

