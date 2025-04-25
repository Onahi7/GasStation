"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { createTerminal } from "@/app/actions/terminals"

export default function NewTerminalPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [terminalName, setTerminalName] = useState("")
  const [terminalLocation, setTerminalLocation] = useState("")
  const [terminalAddress, setTerminalAddress] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { user: currentUser } = useAuth()

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

    if (!currentUser?.companyId) {
      toast({
        title: "Error",
        description: "Company ID not found",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const terminal = await createTerminal({
        name: terminalName,
        location: terminalLocation,
        address: terminalAddress,
        companyId: currentUser.companyId
      })

      toast({
        title: "Success",
        description: "Terminal has been created successfully",
      })

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
    <DashboardLayout role="company-admin">
      <DashboardHeader 
        title="New Terminal" 
        description="Create a new terminal for your company"
      />

      <div className="p-4 md:p-6">
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Terminal Name</Label>
                <Input
                  id="name"
                  value={terminalName}
                  onChange={(e) => setTerminalName(e.target.value)}
                  placeholder="Main Station"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={terminalLocation}
                  onChange={(e) => setTerminalLocation(e.target.value)}
                  placeholder="City, State"
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={terminalAddress}
                  onChange={(e) => setTerminalAddress(e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Terminal"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

