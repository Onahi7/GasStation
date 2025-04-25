"use server"

import { NextResponse } from 'next/server'
import { endShift } from '@/app/actions/shifts'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const formData = await request.formData()
    
    // Make sure the authenticated user is ending their own shift
    const shiftUserId = formData.get("userId") as string
    if (shiftUserId !== session.user.id) {
      return NextResponse.json({ error: "You can only end your own shifts" }, { status: 403 })
    }
    
    const result = await endShift(formData)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to end shift" }, { status: 500 })
  }
}
