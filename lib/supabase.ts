import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types
export type Registration = {
  id?: string
  reg_id: string
  team_name: string
  domain: 'Blockchain' | 'AIML' | 'Open Innovation'
  leader: {
    name: string
    id: string
    program: string
    year: string
    email: string
    phone: string
  }
  members: Array<{
    name: string
    id: string
    program: string
    year: string
    email: string
    phone: string
  }>
  idea_description: string
  status: string
  created_at: string
  updated_at?: string
}
