import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  try {
    const snapshot = await db
      .collection("registrations")
      .orderBy("createdAt", "desc")
      .get()

    const registrations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

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
