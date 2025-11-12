import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Use Edge Runtime to avoid serverless function size limits
export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { data: registration, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      registration
    })
  } catch (error) {
    console.error("Error fetching registration:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch registration" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Map camelCase from frontend to snake_case for database
    const updateData: Record<string, unknown> = {}
    
    if (body.teamName !== undefined) updateData.team_name = body.teamName
    if (body.ideaDescription !== undefined) updateData.idea_description = body.ideaDescription
    if (body.status !== undefined) updateData.status = body.status
    if (body.leader !== undefined) updateData.leader = body.leader
    if (body.members !== undefined) updateData.members = body.members

    const { error } = await supabase
      .from("registrations")
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      success: true,
      message: "Registration updated successfully"
    })
  } catch (error) {
    console.error("Error updating registration:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update registration" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", id)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      success: true,
      message: "Registration deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting registration:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete registration" },
      { status: 500 }
    )
  }
}
