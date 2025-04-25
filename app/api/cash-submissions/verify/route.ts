"use server"

import { NextResponse } from 'next/server'
import { verifyCashSubmission } from '@/app/actions/cash-submissions'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // Check if user has cashier permissions
  if (session.user.role !== 'CASHIER' && 
      session.user.role !== 'MANAGER' && 
      session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: "You are not authorized to verify cash submissions" }, { status: 403 })
  }
  
  try {
    const formData = await request.formData()
    
    // Set verifier to authenticated user
    formData.set("verifierId", session.user.id)
    
    const result = await verifyCashSubmission(formData)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to verify cash submission" }, { status: 500 })
  }
}
