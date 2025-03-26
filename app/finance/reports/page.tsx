"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart } from "@/components/charts/area-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { Download, FileText, RefreshCw, Printer, Mail, DollarSign, CreditCard, AlertTriangle } from "lucide-react"

export default function FinanceReportsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  const generateReport = () => {
    setIsGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  // Sample data for charts
  const revenueData = [
    { day: "Mon", revenue: 120000 },
    { day: "Tue", revenue: 150000 },
    { day: "Wed", revenue: 180000 },
    { day: "Thu", revenue: 140000 },
    { day: "Fri", revenue: 200000 },
    { day: "Sat", revenue: 250000 },
    { day: "Sun", revenue: 190000 },
  ]

  const discrepancyData = [
    { month: "Jan", amount: 12500 },
    { month: "Feb", amount: 9800 },
    { month: "Mar", amount: 15200 },
    { month: "Apr", amount: 8700 },
    { month: "May", amount: 11300 },
    { month: "Jun", amount: 9500 },
  ]

  const paymentData = [
    { name: "Cash", value: 70, color: "#10b981" },
    { name: "Credit", value: 25, color: "#6366f1" },
    { name: "Direct Tank", value: 5, color: "#f59e0b" },
  ]

  return (
    <DashboardLayout role="finance">
      <DashboardHeader title="Financial Reports" description="Generate and view financial performance reports">
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
          <Button onClick={generateReport} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="revenue">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="revenue">Revenue Reports</TabsTrigger>
              <TabsTrigger value="credit">Credit Reports</TabsTrigger>
              <TabsTrigger value="discrepancy">Discrepancy Reports</TabsTrigger>
              <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
          </div>

          <TabsContent value="revenue" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Payment Method</CardTitle>
                  <CardDescription>Distribution of revenue by payment type</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <PieChart data={paymentData} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Daily Revenue Trend</CardTitle>
                  <CardDescription>Revenue trend throughout the week</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <AreaChart data={revenueData} xKey="day" yKey="revenue" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Metrics</CardTitle>
                  <CardDescription>Key revenue performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Total Revenue",
                        value: "₦1,230,000",
                        change: "+12%",
                        icon: <DollarSign className="h-4 w-4" />,
                      },
                      {
                        label: "Average Daily Revenue",
                        value: "₦175,714",
                        change: "+8%",
                        icon: <DollarSign className="h-4 w-4" />,
                      },
                      {
                        label: "Credit Sales",
                        value: "₦307,500",
                        change: "+5%",
                        icon: <CreditCard className="h-4 w-4" />,
                      },
                      {
                        label: "Cash Collection Rate",
                        value: "98.5%",
                        change: "+1.5%",
                        icon: <DollarSign className="h-4 w-4" />,
                      },
                      {
                        label: "Discrepancy Rate",
                        value: "0.8%",
                        change: "-0.3%",
                        icon: <AlertTriangle className="h-4 w-4" />,
                      },
                    ].map((metric, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-primary/10 p-1">{metric.icon}</div>
                          <div className="font-medium">{metric.label}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{metric.value}</div>
                          <div
                            className={`text-xs ${metric.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                          >
                            {metric.change} from last period
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Summary</CardTitle>
                <CardDescription>Comprehensive revenue data for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Total Sales (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Cash Collected (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Credit Sales (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Discrepancy (₦)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {[
                        {
                          date: "Jun 15, 2023",
                          sales: "₦190,000",
                          cash: "₦187,500",
                          credit: "₦0",
                          discrepancy: "-₦2,500",
                        },
                        {
                          date: "Jun 14, 2023",
                          sales: "₦210,000",
                          cash: "₦160,000",
                          credit: "₦50,000",
                          discrepancy: "₦0",
                        },
                        {
                          date: "Jun 13, 2023",
                          sales: "₦180,000",
                          cash: "₦178,500",
                          credit: "₦0",
                          discrepancy: "-₦1,500",
                        },
                        {
                          date: "Jun 12, 2023",
                          sales: "₦175,000",
                          cash: "₦125,000",
                          credit: "₦50,000",
                          discrepancy: "₦0",
                        },
                        {
                          date: "Jun 11, 2023",
                          sales: "₦220,000",
                          cash: "₦170,000",
                          credit: "₦50,000",
                          discrepancy: "₦0",
                        },
                      ].map((day, i) => (
                        <tr
                          key={i}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">{day.date}</td>
                          <td className="p-4 align-middle">{day.sales}</td>
                          <td className="p-4 align-middle">{day.cash}</td>
                          <td className="p-4 align-middle">{day.credit}</td>
                          <td className="p-4 align-middle">
                            <span className={day.discrepancy === "₦0" ? "text-green-600" : "text-red-600"}>
                              {day.discrepancy}
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr className="font-medium bg-muted/50">
                        <td className="p-4 align-middle">Total</td>
                        <td className="p-4 align-middle">₦975,000</td>
                        <td className="p-4 align-middle">₦821,000</td>
                        <td className="p-4 align-middle">₦150,000</td>
                        <td className="p-4 align-middle">-₦4,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credit" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Credit Sales Trend</CardTitle>
                  <CardDescription>Monthly credit sales volume</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart
                    data={[
                      { month: "Jan", amount: 450000 },
                      { month: "Feb", amount: 380000 },
                      { month: "Mar", amount: 520000 },
                      { month: "Apr", amount: 490000 },
                      { month: "May", amount: 550000 },
                      { month: "Jun", amount: 480000 },
                    ]}
                    xKey="month"
                    yKey="amount"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Credit Recovery Rate</CardTitle>
                  <CardDescription>Monthly credit recovery performance</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <AreaChart
                    data={[
                      { month: "Jan", rate: 92 },
                      { month: "Feb", rate: 88 },
                      { month: "Mar", rate: 95 },
                      { month: "Apr", rate: 91 },
                      { month: "May", rate: 94 },
                      { month: "Jun", rate: 93 },
                    ]}
                    xKey="month"
                    yKey="rate"
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Credit Accounts Summary</CardTitle>
                <CardDescription>Status of all credit accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Creditor</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Credit Limit (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Current Balance (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Available Credit (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Last Payment
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {[
                        {
                          name: "XYZ Logistics",
                          limit: "₦500,000",
                          balance: "₦450,000",
                          available: "₦50,000",
                          status: "Good Standing",
                          lastPayment: "3 days ago",
                        },
                        {
                          name: "ABC Corporation",
                          limit: "₦300,000",
                          balance: "₦320,000",
                          available: "-₦20,000",
                          status: "Over Limit",
                          lastPayment: "1 week ago",
                        },
                        {
                          name: "City Transport",
                          limit: "₦200,000",
                          balance: "₦180,000",
                          available: "₦20,000",
                          status: "Good Standing",
                          lastPayment: "2 days ago",
                        },
                        {
                          name: "Quick Delivery",
                          limit: "₦250,000",
                          balance: "₦250,000",
                          available: "₦0",
                          status: "At Limit",
                          lastPayment: "5 days ago",
                        },
                        {
                          name: "Metro Logistics",
                          limit: "₦400,000",
                          balance: "₦0",
                          available: "₦400,000",
                          status: "Good Standing",
                          lastPayment: "1 day ago",
                        },
                      ].map((creditor, i) => (
                        <tr
                          key={i}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle font-medium">{creditor.name}</td>
                          <td className="p-4 align-middle">{creditor.limit}</td>
                          <td className="p-4 align-middle">{creditor.balance}</td>
                          <td className="p-4 align-middle">{creditor.available}</td>
                          <td className="p-4 align-middle">
                            <span
                              className={
                                creditor.status === "Good Standing"
                                  ? "text-green-600"
                                  : creditor.status === "At Limit"
                                    ? "text-amber-600"
                                    : "text-red-600"
                              }
                            >
                              {creditor.status}
                            </span>
                          </td>
                          <td className="p-4 align-middle">{creditor.lastPayment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discrepancy" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Discrepancy Trend</CardTitle>
                  <CardDescription>Monthly discrepancy amounts</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart data={discrepancyData} xKey="month" yKey="amount" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Discrepancy by Type</CardTitle>
                  <CardDescription>Distribution of discrepancies by category</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <PieChart
                    data={[
                      { name: "Cash Shortage", value: 65, color: "#ef4444" },
                      { name: "Cash Excess", value: 15, color: "#10b981" },
                      { name: "Stock Discrepancy", value: 20, color: "#f59e0b" },
                    ]}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Discrepancy Metrics</CardTitle>
                  <CardDescription>Key discrepancy indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Total Discrepancies", value: "₦67,000", change: "-12%", isPositive: true },
                      { label: "Average per Day", value: "₦2,233", change: "-8%", isPositive: true },
                      { label: "Largest Discrepancy", value: "₦5,000", change: "-15%", isPositive: true },
                      { label: "Discrepancy Rate", value: "0.8%", change: "-0.3%", isPositive: true },
                      { label: "Resolved Rate", value: "95%", change: "+5%", isPositive: true },
                    ].map((metric, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="font-medium">{metric.label}</div>
                        <div className="text-right">
                          <div className="font-bold">{metric.value}</div>
                          <div className={`text-xs ${metric.isPositive ? "text-green-500" : "text-red-500"}`}>
                            {metric.change} from last period
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Discrepancy Details</CardTitle>
                <CardDescription>Detailed record of all discrepancies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Worker/Source
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Amount (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Resolution
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {[
                        {
                          date: "Jun 15, 2023",
                          type: "Cash Shortage",
                          source: "John Doe (PMS1)",
                          amount: "₦2,500",
                          status: "Resolved",
                          resolution: "Charged to Worker",
                        },
                        {
                          date: "Jun 13, 2023",
                          type: "Cash Shortage",
                          source: "Sarah Williams (DPK1)",
                          amount: "₦1,500",
                          status: "Resolved",
                          resolution: "Charged to Worker",
                        },
                        {
                          date: "Jun 10, 2023",
                          type: "Stock Discrepancy",
                          source: "Tank 2 (AGO)",
                          amount: "₦120,000",
                          status: "Resolved",
                          resolution: "System Adjustment",
                        },
                        {
                          date: "Jun 8, 2023",
                          type: "Cash Excess",
                          source: "Mike Johnson (AGO1)",
                          amount: "₦1,500",
                          status: "Resolved",
                          resolution: "Added to Revenue",
                        },
                        {
                          date: "Jun 5, 2023",
                          type: "Cash Shortage",
                          source: "Jane Smith (PMS2)",
                          amount: "₦3,000",
                          status: "Resolved",
                          resolution: "Charged to Worker",
                        },
                      ].map((discrepancy, i) => (
                        <tr
                          key={i}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">{discrepancy.date}</td>
                          <td className="p-4 align-middle">{discrepancy.type}</td>
                          <td className="p-4 align-middle">{discrepancy.source}</td>
                          <td className="p-4 align-middle font-medium">
                            <span className={discrepancy.type === "Cash Excess" ? "text-green-600" : "text-red-600"}>
                              {discrepancy.amount}
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            <span className={discrepancy.status === "Resolved" ? "text-green-600" : "text-amber-600"}>
                              {discrepancy.status}
                            </span>
                          </td>
                          <td className="p-4 align-middle">{discrepancy.resolution}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reconciliation" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Reconciliation Status</CardTitle>
                  <CardDescription>Daily reconciliation status for the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        date: "Jun 15, 2023",
                        sales: "₦190,000",
                        collected: "₦187,500",
                        discrepancy: "-₦2,500",
                        status: "Approved with Discrepancy",
                      },
                      {
                        date: "Jun 14, 2023",
                        sales: "₦210,000",
                        collected: "₦210,000",
                        discrepancy: "₦0",
                        status: "Balanced",
                      },
                      {
                        date: "Jun 13, 2023",
                        sales: "₦180,000",
                        collected: "₦178,500",
                        discrepancy: "-₦1,500",
                        status: "Approved with Discrepancy",
                      },
                      {
                        date: "Jun 12, 2023",
                        sales: "₦175,000",
                        collected: "₦175,000",
                        discrepancy: "₦0",
                        status: "Balanced",
                      },
                      {
                        date: "Jun 11, 2023",
                        sales: "₦220,000",
                        collected: "₦220,000",
                        discrepancy: "₦0",
                        status: "Balanced",
                      },
                    ].map((day, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <div className="font-medium">{day.date}</div>
                          <div className="text-sm text-muted-foreground">
                            Expected: {day.sales} • Collected: {day.collected}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`px-2 py-1 rounded-full text-xs ${
                              day.status === "Balanced" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {day.status}
                          </div>
                          <div
                            className={`text-sm mt-1 ${day.discrepancy === "₦0" ? "text-green-600" : "text-red-600"}`}
                          >
                            {day.discrepancy}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Reconciliation Metrics</CardTitle>
                  <CardDescription>Key reconciliation performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Balanced Days", value: "22/30", percentage: 73 },
                      { label: "Days with Discrepancies", value: "8/30", percentage: 27 },
                      { label: "Average Discrepancy", value: "₦2,233", trend: "-8%" },
                      { label: "Largest Discrepancy", value: "₦5,000", trend: "-15%" },
                      { label: "Total Discrepancies", value: "₦67,000", trend: "-12%" },
                    ].map((metric, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between">
                          <div className="font-medium">{metric.label}</div>
                          <div className="font-bold">{metric.value}</div>
                        </div>
                        {metric.percentage !== undefined && (
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className={`h-2 rounded-full ${
                                metric.label === "Balanced Days" ? "bg-primary" : "bg-amber-500"
                              }`}
                              style={{ width: `${metric.percentage}%` }}
                            ></div>
                          </div>
                        )}
                        {metric.trend && (
                          <div className="text-xs text-green-500 text-right">{metric.trend} from last month</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Reconciliation Summary</CardTitle>
                <CardDescription>Comprehensive reconciliation data by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Month</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Total Sales (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Cash Collected (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Credit Sales (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Discrepancies (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Balanced Days
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {[
                        {
                          month: "June 2023",
                          sales: "₦5,250,000",
                          cash: "₦4,450,000",
                          credit: "₦780,000",
                          discrepancy: "₦20,000",
                          balancedDays: "22/30",
                        },
                        {
                          month: "May 2023",
                          sales: "₦5,100,000",
                          cash: "₦4,300,000",
                          credit: "₦750,000",
                          discrepancy: "₦50,000",
                          balancedDays: "20/31",
                        },
                        {
                          month: "April 2023",
                          sales: "₦4,800,000",
                          cash: "₦4,050,000",
                          credit: "₦720,000",
                          discrepancy: "₦30,000",
                          balancedDays: "21/30",
                        },
                        {
                          month: "March 2023",
                          sales: "₦5,000,000",
                          cash: "₦4,200,000",
                          credit: "₦760,000",
                          discrepancy: "₦40,000",
                          balancedDays: "19/31",
                        },
                        {
                          month: "February 2023",
                          sales: "₦4,500,000",
                          cash: "₦3,800,000",
                          credit: "₦680,000",
                          discrepancy: "₦20,000",
                          balancedDays: "20/28",
                        },
                      ].map((month, i) => (
                        <tr
                          key={i}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle font-medium">{month.month}</td>
                          <td className="p-4 align-middle">{month.sales}</td>
                          <td className="p-4 align-middle">{month.cash}</td>
                          <td className="p-4 align-middle">{month.credit}</td>
                          <td className="p-4 align-middle text-red-600">{month.discrepancy}</td>
                          <td className="p-4 align-middle">{month.balancedDays}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

