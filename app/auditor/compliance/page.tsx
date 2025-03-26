"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RefreshCw, ClipboardCheck } from "lucide-react"

export default function CompliancePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [openAudit, setOpenAudit] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // Sample data for charts
  const complianceData = [
    { name: "Compliant", value: 92, color: "#10b981" },
    { name: "Minor Issues", value: 6, color: "#f59e0b" },
    { name: "Non-Compliant", value: 2, color: "#ef4444" },
  ]

  const complianceTrendData = [
    { month: "Jan", score: 88 },
    { month: "Feb", score: 90 },
    { month: "Mar", score: 89 },
    { month: "Apr", score: 91 },
    { month: "May", score: 93 },
    { month: "Jun", score: 92 },
  ]

  return (
    <DashboardLayout role="auditor">
      <DashboardHeader title="Compliance Management" description="Monitor and enforce regulatory compliance">
        <div className="flex flex-col sm:flex-row gap-2">
          <DateRangePicker />
          <Button onClick={refreshData} disabled={isLoading} variant="outline">
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <Dialog open={openAudit} onOpenChange={setOpenAudit}>
            <DialogTrigger asChild>
              <Button>
                <ClipboardCheck className="mr-2 h-4 w-4" />
                New Audit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New Compliance Audit</DialogTitle>
                <DialogDescription>Create a new compliance audit record.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="auditType" className="text-right">
                    Audit Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select audit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regulatory">Regulatory Compliance</SelectItem>
                      <SelectItem value="financial">Financial Compliance</SelectItem>
                      <SelectItem value="operational">Operational Compliance</SelectItem>
                      <SelectItem value="safety">Safety Compliance</SelectItem>
                      <SelectItem value="environmental">Environmental Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="auditDate" className="text-right">
                    Audit Date
                  </Label>
                  <Input id="auditDate" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="auditor" className="text-right">
                    Auditor
                  </Label>
                  <Input id="auditor" defaultValue="Robert Brown" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="findings" className="text-right">
                    Findings
                  </Label>
                  <Textarea id="findings" placeholder="Enter audit findings" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compliant">Compliant</SelectItem>
                      <SelectItem value="minor">Minor Issues</SelectItem>
                      <SelectItem value="major">Major Issues</SelectItem>
                      <SelectItem value="noncompliant">Non-Compliant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="actions" className="text-right">
                    Required Actions
                  </Label>
                  <Textarea id="actions" placeholder="Enter required actions" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenAudit(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpenAudit(false)}>Save Audit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="operational">Operational</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">Station compliance score</p>
                  <div className="mt-2 flex items-center text-xs">
                    <span className="text-green-500 mr-1">↑ 2%</span>
                    <span className="text-muted-foreground">from last quarter</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">Compliance issues to address</p>
                  <div className="mt-2 flex items-center text-xs">
                    <span className="text-green-500 mr-1">↓ 3</span>
                    <span className="text-muted-foreground">from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Last Audit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7 days ago</div>
                  <p className="text-xs text-muted-foreground">Jun 8, 2023</p>
                  <div className="mt-2 flex items-center text-xs">
                    \

