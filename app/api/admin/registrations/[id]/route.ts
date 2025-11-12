import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const doc = await db
      .collection("registrations")
      .doc(id)
      .get()

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      registration: {
        id: doc.id,
        ...doc.data()
      }
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

    await db
      .collection("registrations")
      .doc(id)
      .update({
        ...updateData,
        updatedAt: new Date().toISOString()
      })

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
    
    await db
      .collection("registrations")
      .doc(id)
      .delete()

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
