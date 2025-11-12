import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

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

    // Remove id from update data if present
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...updateData } = body

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
