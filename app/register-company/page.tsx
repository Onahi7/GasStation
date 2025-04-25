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
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { registerCompany } from "@/app/actions/auth"

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

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!companyName || !companyEmail) {
        setError("Company name and email are required")
        return
      }
      setCurrentStep(2)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep === 1) {
      handleNextStep()
      return
    }

    setIsLoading(true)
    setError(null)

    if (adminPassword !== confirmPassword) {
      setError("Passwords don't match")
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("name", adminName)
      formData.append("email", adminEmail)
      formData.append("password", adminPassword)
      formData.append("companyName", companyName)
      formData.append("address", companyAddress)
      formData.append("phone", companyPhone)

      const result = await registerCompany(formData)

      if (result?.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Registration successful",
        description: "Your company has been registered. You can now sign in.",
      })

      router.push("/login?registered=true")
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Register Your Company</CardTitle>
          <CardDescription>
            {currentStep === 1
              ? "Enter your company details"
              : "Create admin account for your company"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {currentStep === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Acme Corporation"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Company Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    placeholder="contact@company.com"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Phone Number</Label>
                  <Input
                    id="companyPhone"
                    placeholder="+1234567890"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Address</Label>
                  <Textarea
                    id="companyAddress"
                    placeholder="123 Business Street..."
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="adminName">Full Name</Label>
                  <Input
                    id="adminName"
                    placeholder="John Doe"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="admin@company.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : currentStep === 1
                ? "Next"
                : "Create Company"}
              {!isLoading && currentStep === 1 && (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
            <div className="text-center text-sm">
              Already registered?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

