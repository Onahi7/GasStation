"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"
import { Building2 } from "lucide-react"

export default function NewTerminalPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [terminalName, setTerminalName] = useState("")
  const [terminalLocation, setTerminalLocation] = useState("")
  const [terminalAddress, setTerminalAddress] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Create a Supabase client
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!terminalName) {
      toast({
        title: "Error",
        description: "Terminal name is required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Get current user to get company_id
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      // Get user details including company_id
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("company_id")
        .eq("id", user.id)
        .single()

      if (userError || !userData) {
        throw new Error("Error fetching company data")
      }

      // Create the terminal
      const { data: terminal, error: terminalError } = await supabase
        .from("terminals")
        .insert([
          {
            company_id: userData.company_id,
            name: terminalName,
            location: terminalLocation,
            address: terminalAddress,
          },
        ])
        .select()
        .single()

      if (terminalError) {
        throw new Error(terminalError.message)
      }

      toast({
        title: "Success",
        description: "Terminal has been created successfully",
      })

      // Redirect to the terminal details page
      router.push(`/company-admin/terminals/${terminal.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create terminal",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout role="admin">
      <DashboardHeader title="Add New Terminal" description="Set up a new filling station for your company" />

      <div className="p-4 md:p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-full bg-primary/10 p-2">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Terminal Details</CardTitle>
            </div>
            <CardDescription>Enter the details for your new filling station terminal</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="terminalName">Terminal Name *</Label>
                <Input
                  id="terminalName"
                  value={terminalName}
                  onChange={(e) => setTerminalName(e.target.value)}
                  placeholder="Main Terminal"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terminalLocation">Location</Label>
                <Input
                  id="terminalLocation"
                  value={terminalLocation}
                  onChange={(e) => setTerminalLocation(e.target.value)}
                  placeholder="City, State"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terminalAddress">Address</Label>
                <Textarea
                  id="terminalAddress"
                  value={terminalAddress}
                  onChange={(e) => setTerminalAddress(e.target.value)}
                  placeholder="Full address of the terminal"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/company-admin")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Terminal"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}

