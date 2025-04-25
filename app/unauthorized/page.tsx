"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
          <CardDescription className="text-base">
            You don&apos;t have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-center text-muted-foreground">
            Please contact your administrator if you believe this is an error.
          </p>
          <div className="flex space-x-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild>
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}