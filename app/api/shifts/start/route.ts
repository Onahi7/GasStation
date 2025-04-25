"use server"

import { NextResponse } from 'next/server'
import { startShift } from '@/app/actions/shifts'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const formData = await request.formData()
    
    // Override with authenticated user ID
    formData.set("userId", session.user.id)
    
    const result = await startShift(formData)
    return NextResponse.json({ shift: result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to start shift" }, { status: 500 })
  }
}
