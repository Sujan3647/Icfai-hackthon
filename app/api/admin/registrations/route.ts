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

    return NextResponse.json({
      success: true,
      registrations
    })
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch registrations" },
      { status: 500 }
    )
  }
}
