import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: registrations, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    // Map snake_case to camelCase for frontend
    const formattedRegistrations = registrations?.map(reg => ({
      id: reg.id,
      regId: reg.reg_id,
      teamName: reg.team_name,
      domain: reg.domain,
      leader: reg.leader,
      members: reg.members || [],
      ideaDescription: reg.idea_description,
      status: reg.status,
      createdAt: reg.created_at
    })) || []

    return NextResponse.json({
      success: true,
      registrations: formattedRegistrations
    })
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch registrations" },
      { status: 500 }
    )
  }
}
