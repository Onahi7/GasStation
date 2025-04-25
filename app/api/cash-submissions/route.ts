"use server"

import { NextResponse } from 'next/server'
import { submitCash, getCashSubmissions } from '@/app/actions/cash-submissions'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await auth()
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const shiftId = searchParams.get('shiftId')
    const verified = searchParams.has('verified') 
      ? searchParams.get('verified') === 'true' 
      : undefined
    
    const options: any = {}
    if (userId) options.userId = userId
    if (shiftId) options.shiftId = shiftId
    if (verified !== undefined) options.verified = verified
    
    // If user is a worker, restrict to their own submissions
    if (session.user.role === 'WORKER') {
      options.userId = session.user.id
    }
    
    const submissions = await getCashSubmissions(options)
    return NextResponse.json({ submissions })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch cash submissions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const formData = await request.formData()
    
    // Ensure the userId matches the authenticated user if they're a worker
    if (session.user.role === 'WORKER') {
      formData.set("userId", session.user.id)
    }
    
    const submission = await submitCash(formData)
    return NextResponse.json(submission)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit cash" }, { status: 500 })
  }
}
