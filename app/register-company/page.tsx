"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, ArrowRight } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

export default function RegisterCompanyPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Company information
  const [companyName, setCompanyName] = useState("")
  const [companyAddress, setCompanyAddress] = useState("")
  const [companyEmail, setCompanyEmail] = useState("")
  const [companyPhone, setCompanyPhone] = useState("")

  // Admin information
  const [adminName, setAdminName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Terminal information
  const [terminalName, setTerminalName] = useState("")
  const [terminalLocation, setTerminalLocation] = useState("")
  const [terminalAddress, setTerminalAddress] = useState("")

  // Create a Supabase client directly in the component
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!companyName || !companyEmail) {
        setError("Company name and email are required")
        return
      }
    } else if (currentStep === 2) {
      if (!adminName || !adminEmail || !adminPassword) {
        setError("All admin fields are required")
        return
      }
      if (adminPassword !== confirmPassword) {
        setError("Passwords do not match")
        return
      }
    }

    setError(null)
    setCurrentStep(currentStep + 1)
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // 1. Register the admin user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: {
            full_name: adminName,
          },
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (!authData.user) {
        setError("Failed to create user account")
        return
      }

      // 2. Create the company
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .insert([
          {
            name: companyName,
            address: companyAddress,
            contact_person: adminName,
            phone: companyPhone,
            email: companyEmail,
          },
        ])
        .select()
        .single()

      if (companyError) {
        setError(companyError.message)
        return
      }

      // 3. Create the terminal
      const { data: terminalData, error: terminalError } = await supabase
        .from("terminals")
        .insert([
          {
            company_id: companyData.id,
            name: terminalName,
            location: terminalLocation,
            address: terminalAddress,
          },
        ])
        .select()
        .single()

      if (terminalError) {
        setError(terminalError.message)
        return
      }

      // 4. Create the user record and link to company and terminal
      const { error: userError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          full_name: adminName,
          email: adminEmail,
          company_id: companyData.id,
          terminal_id: terminalData.id,
          role: "admin",
          is_company_admin: true,
        },
      ])

      if (userError) {
        setError(userError.message)
        return
      }

      toast({
        title: "Registration successful!",
        description: "Your company and terminal have been set up. You can now log in.",
      })

      // Redirect to login page
      router.push("/login?registered=true")
    } catch (err: any) {
      setError(err.message || "An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Register Your Company</CardTitle>
          <CardDescription>Set up your company and first terminal</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

          <div className="mb-6">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep === step
                        ? "bg-primary text-white"
                        : currentStep > step
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                  <span className="text-sm mt-1">{step === 1 ? "Company" : step === 2 ? "Admin" : "Terminal"}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-[10%] right-[10%] h-1 bg-gray-200">
                <div className="h-full bg-primary transition-all" style={{ width: `${(currentStep - 1) * 50}%` }}></div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Company Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <Textarea
                    id="companyAddress"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Company Email *</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Company Phone</Label>
                    <Input id="companyPhone" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Admin Account</h3>
                <div className="space-y-2">
                  <Label htmlFor="adminName">Full Name *</Label>
                  <Input id="adminName" value={adminName} onChange={(e) => setAdminName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Password *</Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Terminal Setup</h3>
                <div className="space-y-2">
                  <Label htmlFor="terminalName">Terminal Name *</Label>
                  <Input
                    id="terminalName"
                    value={terminalName}
                    onChange={(e) => setTerminalName(e.target.value)}
                    required
                    placeholder="Main Terminal"
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
                  />
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="outline">Already have an account? Login</Button>
            </Link>
          )}

          {currentStep < 3 ? (
            <Button onClick={handleNextStep}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Setting up..." : "Complete Setup"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

