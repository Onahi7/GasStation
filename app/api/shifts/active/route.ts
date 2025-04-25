"use server"

import { NextResponse } from 'next/server'
import { getActiveShift } from '@/app/actions/shifts'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const userId = session.user.id
    const shift = await getActiveShift(userId)
    
    return NextResponse.json({ shift })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch active shift" }, { status: 500 })
  }
}
