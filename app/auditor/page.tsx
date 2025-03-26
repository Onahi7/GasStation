"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/date-range-picker"
import { AreaChart } from "@/components/charts/area-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart } from "@/components/charts/pie-chart"
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
import { AlertTriangle, FileText, Search, Download, CheckCircle, XCircle, RefreshCw } from "lucide-react"

export default function AuditorDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [openAudit, setOpenAudit] = useState(false)
  const [openInvestigate, setOpenInvestigate] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // Sample data for charts
  const discrepancyData = [
    { month: "Jan", amount: 12500 },
    { month: "Feb", amount: 9800 },
    { month: "Mar", amount: 15200 },
    { month: "Apr", amount: 8700 },
    { month: "May", amount: 11300 },
    { month: "Jun", amount: 9500 },
  ]

  const complianceData = [
    { name: "Compliant", value: 92, color: "#10b981" },
    { name: "Minor Issues", value: 6, color: "#f59e0b" },
    { name: "Non-Compliant", value: 2, color: "#ef4444" },
  ]

  return (
    <DashboardLayout role="auditor">
      <DashboardHeader
        title="Auditor Dashboard"
        description="Access logs for transactions, stock movements, and financial records"
      >
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
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-4 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Discrepancies"
            value="5"
            description="Issues requiring attention"
            icon={<AlertTriangle className="h-4 w-4" />}
            trend={{ value: 20, isPositive: false }}
          />
          <StatCard
            title="Compliance Score"
            value="92%"
            description="Overall compliance rating"
            icon={<CheckCircle className="h-4 w-4" />}
            trend={{ value: 3, isPositive: true }}
          />
          <StatCard
            title="Audit Logs"
            value="1,234"
            description="Total transactions reviewed"
            icon={<FileText className="h-4 w-4" />}
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Pending Reviews"
            value="8"
            description="Transactions awaiting review"
            icon={<Search className="h-4 w-4" />}
            trend={{ value: 10, isPositive: false }}
          />
        </div>

        <Tabs defaultValue="transactions">
          <TabsList>
            <TabsTrigger value="transactions">Transaction Logs</TabsTrigger>
            <TabsTrigger value="stock">Stock Movement</TabsTrigger>
            <TabsTrigger value="financial">Financial Records</TabsTrigger>
            <TabsTrigger value="discrepancies">Discrepancies</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Transaction Audit Log</CardTitle>
                  <CardDescription>Complete record of all transactions</CardDescription>
                </div>
                <Dialog open={openAudit} onOpenChange={setOpenAudit}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Search className="mr-2 h-4 w-4" />
                      Audit Transaction
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Audit Transaction</DialogTitle>
                      <DialogDescription>Enter transaction ID to perform an audit.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="transactionId" className="text-right">
                          Transaction ID
                        </Label>
                        <Input id="transactionId" placeholder="TRX-1234" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="auditType" className="text-right">
                          Audit Type
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select audit type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard Review</SelectItem>
                            <SelectItem value="detailed">Detailed Investigation</SelectItem>
                            <SelectItem value="compliance">Compliance Check</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                          Audit Notes
                        </Label>
                        <Textarea id="notes" placeholder="Enter audit notes and findings" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenAudit(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setOpenAudit(false)}>Begin Audit</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "TRX-1234",
                      type: "Cash Submission",
                      amount: "₦275,000",
                      user: "Sarah Williams",
                      time: "Today, 2:30 PM",
                      status: "Verified",
                    },
                    {
                      id: "TRX-1233",
                      type: "Credit Payment",
                      amount: "₦100,000",
                      user: "Finance Officer",
                      time: "Today, 12:15 PM",
                      status: "Verified",
                    },
                    {
                      id: "TRX-1232",
                      type: "Direct Tank Sale",
                      amount: "₦840,000",
                      user: "Station Manager",
                      time: "Today, 10:45 AM",
                      status: "Pending Review",
                    },
                    {
                      id: "TRX-1231",
                      type: "Stock Delivery",
                      amount: "5,000 L",
                      user: "Station Manager",
                      time: "Today, 8:20 AM",
                      status: "Verified",
                    },
                    {
                      id: "TRX-1230",
                      type: "Cash Submission",
                      amount: "₦348,500",
                      user: "John Doe",
                      time: "Yesterday, 8:05 PM",
                      status: "Discrepancy",
                    },
                  ].map((transaction, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">
                          {transaction.id}: {transaction.type}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.user} • {transaction.time}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{transaction.amount}</div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            transaction.status === "Verified"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "Pending Review"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status}
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button size="sm" variant="outline">
                          Audit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
                <CardDescription>Number of transactions by type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart
                  data={[
                    { type: "Cash Submission", count: 45 },
                    { type: "Credit Payment", count: 18 },
                    { type: "Direct Tank Sale", count: 12 },
                    { type: "Stock Delivery", count: 8 },
                    { type: "Reconciliation", count: 30 },
                  ]}
                  xKey="type"
                  yKey="count"
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="stock" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Stock Movement Audit</CardTitle>
                <CardDescription>Track all stock changes and movements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "STK-567",
                      type: "Stock Delivery",
                      tank: "Tank 1 (PMS)",
                      quantity: "+5,000 L",
                      time: "Today, 8:20 AM",
                      user: "Station Manager",
                      status: "Verified",
                    },
                    {
                      id: "STK-566",
                      type: "Pump Sales",
                      tank: "Tank 1 (PMS)",
                      quantity: "-450 L",
                      time: "Yesterday",
                      user: "System",
                      status: "Verified",
                    },
                    {
                      id: "STK-565",
                      type: "Direct Tank Sale",
                      tank: "Tank 2 (AGO)",
                      quantity: "-1,200 L",
                      time: "Yesterday",
                      user: "Station Manager",
                      status: "Verified",
                    },
                    {
                      id: "STK-564",
                      type: "Stock Adjustment",
                      tank: "Tank 2 (AGO)",
                      quantity: "-150 L",
                      time: "2 days ago",
                      user: "Station Manager",
                      status: "Flagged",
                    },
                    {
                      id: "STK-563",
                      type: "Stock Delivery",
                      tank: "Tank 3 (DPK)",
                      quantity: "+3,000 L",
                      time: "3 days ago",
                      user: "Station Manager",
                      status: "Verified",
                    },
                  ].map((movement, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">
                          {movement.id}: {movement.type}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {movement.tank} • {movement.time}
                        </div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`font-medium ${movement.quantity.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                        >
                          {movement.quantity}
                        </div>
                        <div className="text-sm text-muted-foreground">By: {movement.user}</div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            movement.status === "Verified" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {movement.status}
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Stock Discrepancy Trend</CardTitle>
                <CardDescription>Volume discrepancies over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <AreaChart
                  data={[
                    { month: "Jan", volume: 120 },
                    { month: "Feb", volume: 95 },
                    { month: "Mar", volume: 150 },
                    { month: "Apr", volume: 85 },
                    { month: "May", volume: 110 },
                    { month: "Jun", volume: 90 },
                  ]}
                  xKey="month"
                  yKey="volume"
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Records Audit</CardTitle>
                <CardDescription>Review of financial transactions and reconciliations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "FIN-789",
                      type: "Daily Reconciliation",
                      date: "Yesterday",
                      amount: "₦1,225,000",
                      status: "Balanced",
                    },
                    {
                      id: "FIN-788",
                      type: "Credit Payment",
                      date: "2 days ago",
                      amount: "₦100,000",
                      status: "Verified",
                    },
                    {
                      id: "FIN-787",
                      type: "Cash Shortage",
                      date: "2 days ago",
                      amount: "-₦1,500",
                      status: "Unresolved",
                    },
                    {
                      id: "FIN-786",
                      type: "Daily Reconciliation",
                      date: "3 days ago",
                      amount: "₦1,180,000",
                      status: "Balanced",
                    },
                    {
                      id: "FIN-785",
                      type: "Credit Extension",
                      date: "4 days ago",
                      amount: "₦200,000",
                      status: "Approved",
                    },
                  ].map((record, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">
                          {record.id}: {record.type}
                        </div>
                        <div className="text-sm text-muted-foreground">{record.date}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{record.amount}</div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            record.status === "Balanced" || record.status === "Verified" || record.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.status}
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Financial Discrepancy Trend</CardTitle>
                <CardDescription>Monthly financial discrepancies</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart data={discrepancyData} xKey="month" yKey="amount" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="discrepancies" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Discrepancy Report</CardTitle>
                  <CardDescription>Issues requiring investigation or resolution</CardDescription>
                </div>
                <Dialog open={openInvestigate} onOpenChange={setOpenInvestigate}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Investigate
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Investigate Discrepancy</DialogTitle>
                      <DialogDescription>Record investigation details for the selected discrepancy.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="discrepancyId" className="text-right">
                          Discrepancy ID
                        </Label>
                        <Input id="discrepancyId" placeholder="DSC-123" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="investigationType" className="text-right">
                          Investigation Type
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash Shortage</SelectItem>
                            <SelectItem value="stock">Stock Discrepancy</SelectItem>
                            <SelectItem value="price">Price Discrepancy</SelectItem>
                            <SelectItem value="credit">Credit Limit Breach</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="findings" className="text-right">
                          Findings
                        </Label>
                        <Textarea id="findings" placeholder="Enter investigation findings" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="resolution" className="text-right">
                          Resolution
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select resolution" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="resolved">Mark as Resolved</SelectItem>
                            <SelectItem value="pending">Further Investigation</SelectItem>
                            <SelectItem value="charge">Charge to Worker</SelectItem>
                            <SelectItem value="adjust">Adjust Records</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenInvestigate(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setOpenInvestigate(false)}>Submit Investigation</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "DSC-123",
                      type: "Cash Shortage",
                      details: "John Doe (PMS1)",
                      amount: "₦1,500",
                      date: "Yesterday",
                      status: "Pending",
                    },
                    {
                      id: "DSC-122",
                      type: "Stock Discrepancy",
                      details: "Tank 2 (AGO)",
                      amount: "150 L (₦120,000)",
                      date: "2 days ago",
                      status: "Investigating",
                    },
                    {
                      id: "DSC-121",
                      type: "Unauthorized Price Change",
                      details: "Pump AGO1",
                      amount: "₦50/L increase",
                      date: "3 days ago",
                      status: "Resolved",
                    },
                    {
                      id: "DSC-120",
                      type: "Missing Receipt",
                      details: "Direct Tank Sale",
                      amount: "₦840,000",
                      date: "5 days ago",
                      status: "Resolved",
                    },
                    {
                      id: "DSC-119",
                      type: "Credit Limit Breach",
                      details: "ABC Corporation",
                      amount: "₦20,000 over limit",
                      date: "1 week ago",
                      status: "Resolved",
                    },
                  ].map((discrepancy, i) => (
                    <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                      {discrepancy.status === "Resolved" ? (
                        <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="mt-0.5 h-5 w-5 text-red-500" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">
                          {discrepancy.id}: {discrepancy.type}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {discrepancy.details} • {discrepancy.date}
                        </div>
                        <div className="text-sm">
                          Amount: <span className="font-medium">{discrepancy.amount}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            discrepancy.status === "Resolved"
                              ? "bg-green-100 text-green-800"
                              : discrepancy.status === "Investigating"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {discrepancy.status}
                        </div>
                        <Button size="sm" variant="ghost" className="mt-2">
                          {discrepancy.status === "Resolved" ? "View Report" : "Investigate"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
                <CardDescription>Regulatory and operational compliance status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart data={complianceData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Report</CardTitle>
              <CardDescription>Regulatory and operational compliance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: "Regulatory Compliance", score: "95%", status: "Compliant", issues: "1 minor issue" },
                  { category: "Financial Accuracy", score: "92%", status: "Compliant", issues: "2 minor issues" },
                  {
                    category: "Stock Management",
                    score: "88%",
                    status: "Needs Improvement",
                    issues: "3 issues identified",
                  },
                  { category: "Safety Standards", score: "98%", status: "Compliant", issues: "No issues" },
                  { category: "Documentation", score: "90%", status: "Compliant", issues: "2 minor issues" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.category}</div>
                      <div className="text-sm text-muted-foreground">{item.issues}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{item.score}</div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "Compliant" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status}
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Button className="w-full">Generate Full Compliance Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Audit Schedule</CardTitle>
              <CardDescription>Upcoming and recent audit activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "Daily Reconciliation", date: "Today", status: "Pending", priority: "High" },
                  { type: "Stock Verification", date: "Tomorrow", status: "Scheduled", priority: "Medium" },
                  { type: "Credit Account Review", date: "In 2 days", status: "Scheduled", priority: "Medium" },
                  { type: "Quarterly Compliance", date: "Next week", status: "Scheduled", priority: "High" },
                  { type: "Financial Audit", date: "Yesterday", status: "Completed", priority: "High" },
                ].map((audit, i) => (
                  <div key={i} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">{audit.type}</div>
                      <div className="text-sm text-muted-foreground">{audit.date}</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`px-2 py-1 rounded-full text-xs ${
                          audit.priority === "High" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {audit.priority}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-2 py-1 rounded-full text-xs ${
                          audit.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : audit.status === "Pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {audit.status}
                      </div>
                      <Button size="sm" variant="ghost" className="mt-2">
                        {audit.status === "Completed" ? "View Report" : "Start Audit"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

