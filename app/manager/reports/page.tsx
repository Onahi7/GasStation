"use client"

import { Label } from "@/components/ui/label"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, RefreshCw, Printer, Mail } from "lucide-react"

export default function ReportsPage() {
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
  const salesData = [
    { day: "Mon", sales: 120000 },
    { day: "Tue", sales: 150000 },
    { day: "Wed", sales: 180000 },
    { day: "Thu", sales: 140000 },
    { day: "Fri", sales: 200000 },
    { day: "Sat", sales: 250000 },
    { day: "Sun", sales: 190000 },
  ]

  const productData = [
    { name: "PMS (Petrol)", value: 65, color: "#4f46e5" },
    { name: "AGO (Diesel)", value: 25, color: "#0ea5e9" },
    { name: "DPK (Kerosene)", value: 10, color: "#f59e0b" },
  ]

  const tankSalesData = [
    { month: "Jan", pms: 12000, ago: 8000, dpk: 3000 },
    { month: "Feb", pms: 14000, ago: 7500, dpk: 2800 },
    { month: "Mar", pms: 15000, ago: 9000, dpk: 3200 },
    { month: "Apr", pms: 13500, ago: 8200, dpk: 2900 },
    { month: "May", pms: 16000, ago: 9500, dpk: 3500 },
    { month: "Jun", pms: 17500, ago: 10000, dpk: 3800 },
  ]

  return (
    <DashboardLayout role="manager">
      <DashboardHeader title="Reports" description="Generate and view station performance reports">
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
        <Tabs defaultValue="sales">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="sales">Sales Reports</TabsTrigger>
              <TabsTrigger value="stock">Stock Reports</TabsTrigger>
              <TabsTrigger value="financial">Financial Reports</TabsTrigger>
              <TabsTrigger value="custom">Custom Reports</TabsTrigger>
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

          <TabsContent value="sales" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Product</CardTitle>
                  <CardDescription>Distribution of sales across different fuel types</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <PieChart data={productData} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Daily Sales Trend</CardTitle>
                  <CardDescription>Sales revenue throughout the week</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <AreaChart data={salesData} xKey="day" yKey="sales" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Customers</CardTitle>
                  <CardDescription>Customers with highest purchase volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "City Power", volume: "5,500 L", amount: "₦4,400,000", product: "AGO" },
                      { name: "Golden Transport", volume: "4,200 L", amount: "₦2,940,000", product: "PMS" },
                      { name: "Farm Fresh Ltd", volume: "3,800 L", amount: "₦3,040,000", product: "AGO" },
                      { name: "Metro Logistics", volume: "3,250 L", amount: "₦2,275,000", product: "PMS" },
                      { name: "Rural Farmers Coop", volume: "2,500 L", amount: "₦1,875,000", product: "DPK" },
                    ].map((customer, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {customer.product} • {customer.volume}
                          </div>
                        </div>
                        <div className="text-right font-medium">{customer.amount}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sales Summary</CardTitle>
                <CardDescription>Comprehensive sales data for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Volume (L)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Revenue (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Transactions
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Avg. Price (₦/L)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium">PMS (Petrol)</td>
                        <td className="p-4 align-middle">15,250</td>
                        <td className="p-4 align-middle">₦10,675,000</td>
                        <td className="p-4 align-middle">425</td>
                        <td className="p-4 align-middle">₦700</td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium">AGO (Diesel)</td>
                        <td className="p-4 align-middle">8,750</td>
                        <td className="p-4 align-middle">₦7,000,000</td>
                        <td className="p-4 align-middle">210</td>
                        <td className="p-4 align-middle">₦800</td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium">DPK (Kerosene)</td>
                        <td className="p-4 align-middle">3,500</td>
                        <td className="p-4 align-middle">₦2,625,000</td>
                        <td className="p-4 align-middle">95</td>
                        <td className="p-4 align-middle">₦750</td>
                      </tr>
                      <tr className="font-medium bg-muted/50">
                        <td className="p-4 align-middle">Total</td>
                        <td className="p-4 align-middle">27,500</td>
                        <td className="p-4 align-middle">₦20,300,000</td>
                        <td className="p-4 align-middle">730</td>
                        <td className="p-4 align-middle">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Movement</CardTitle>
                  <CardDescription>Monthly stock movement by product</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart data={tankSalesData} xKey="month" yKey="pms" color="#4f46e5" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Current Stock Levels</CardTitle>
                  <CardDescription>Current stock levels across all tanks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Tank 1 (PMS)", capacity: "10,000 L", current: "8,500 L", percentage: 85 },
                      { name: "Tank 2 (AGO)", capacity: "8,000 L", current: "5,600 L", percentage: 70 },
                      { name: "Tank 3 (DPK)", capacity: "5,000 L", current: "1,000 L", percentage: 20 },
                      { name: "Tank 4 (PMS)", capacity: "12,000 L", current: "9,800 L", percentage: 82 },
                      { name: "Tank 5 (AGO)", capacity: "7,000 L", current: "500 L", percentage: 7 },
                    ].map((tank, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between">
                          <div className="font-medium">{tank.name}</div>
                          <div>
                            {tank.current} / {tank.capacity}
                          </div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className={`h-2 rounded-full ${
                              tank.percentage < 20 ? "bg-red-500" : tank.percentage < 40 ? "bg-amber-500" : "bg-primary"
                            }`}
                            style={{ width: `${tank.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Stock Movement History</CardTitle>
                <CardDescription>Record of all stock deliveries and sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tank</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Quantity (L)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Reference
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {[
                        {
                          date: "Jun 15, 2023",
                          type: "Delivery",
                          tank: "Tank 1 (PMS)",
                          quantity: "+5,000",
                          reference: "DEL-2023-0078",
                        },
                        {
                          date: "Jun 14, 2023",
                          type: "Direct Sale",
                          tank: "Tank 2 (AGO)",
                          quantity: "-1,200",
                          reference: "Golden Transport",
                        },
                        {
                          date: "Jun 13, 2023",
                          type: "Pump Sales",
                          tank: "Tank 1 (PMS)",
                          quantity: "-450",
                          reference: "Daily Sales",
                        },
                        {
                          date: "Jun 12, 2023",
                          type: "Delivery",
                          tank: "Tank 3 (DPK)",
                          quantity: "+3,000",
                          reference: "DEL-2023-0077",
                        },
                        {
                          date: "Jun 11, 2023",
                          type: "Adjustment",
                          tank: "Tank 2 (AGO)",
                          quantity: "-150",
                          reference: "Stock Reconciliation",
                        },
                      ].map((movement, i) => (
                        <tr
                          key={i}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">{movement.date}</td>
                          <td className="p-4 align-middle">{movement.type}</td>
                          <td className="p-4 align-middle">{movement.tank}</td>
                          <td className="p-4 align-middle font-medium">
                            <span className={movement.quantity.startsWith("+") ? "text-green-600" : "text-red-600"}>
                              {movement.quantity}
                            </span>
                          </td>
                          <td className="p-4 align-middle">{movement.reference}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Revenue by payment method</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <PieChart
                    data={[
                      { name: "Cash", value: 70, color: "#10b981" },
                      { name: "Credit", value: 25, color: "#6366f1" },
                      { name: "Direct Tank", value: 5, color: "#f59e0b" },
                    ]}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                  <CardDescription>Revenue trend over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <AreaChart
                    data={[
                      { month: "Jan", revenue: 15000000 },
                      { month: "Feb", revenue: 17500000 },
                      { month: "Mar", revenue: 19000000 },
                      { month: "Apr", revenue: 18500000 },
                      { month: "May", revenue: 20000000 },
                      { month: "Jun", revenue: 22500000 },
                    ]}
                    xKey="month"
                    yKey="revenue"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Credit Status</CardTitle>
                  <CardDescription>Outstanding credit and payment status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "XYZ Logistics", balance: "₦450,000", status: "Good Standing" },
                      { name: "ABC Corporation", balance: "₦320,000", status: "Over Limit" },
                      { name: "City Transport", balance: "₦180,000", status: "Good Standing" },
                      { name: "Quick Delivery", balance: "₦250,000", status: "At Limit" },
                      { name: "Metro Logistics", balance: "₦0", status: "Paid" },
                    ].map((creditor, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                        <div className="font-medium">{creditor.name}</div>
                        <div className="text-right">
                          <div className="font-medium">{creditor.balance}</div>
                          <div
                            className={`text-xs ${
                              creditor.status === "Good Standing" || creditor.status === "Paid"
                                ? "text-green-500"
                                : creditor.status === "At Limit"
                                  ? "text-amber-500"
                                  : "text-red-500"
                            }`}
                          >
                            {creditor.status}
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
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Comprehensive financial data for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Amount (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          % of Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium">Total Revenue</td>
                        <td className="p-4 align-middle">₦20,300,000</td>
                        <td className="p-4 align-middle">100%</td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium pl-8">- Pump Sales</td>
                        <td className="p-4 align-middle">₦18,500,000</td>
                        <td className="p-4 align-middle">91.1%</td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium pl-8">- Direct Tank Sales</td>
                        <td className="p-4 align-middle">₦1,800,000</td>
                        <td className="p-4 align-middle">8.9%</td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium">Cost of Goods Sold</td>
                        <td className="p-4 align-middle">₦17,255,000</td>
                        <td className="p-4 align-middle">85%</td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium">Gross Profit</td>
                        <td className="p-4 align-middle">₦3,045,000</td>
                        <td className="p-4 align-middle">15%</td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium">Operating Expenses</td>
                        <td className="p-4 align-middle">₦1,218,000</td>
                        <td className="p-4 align-middle">6%</td>
                      </tr>
                      <tr className="font-medium bg-muted/50">
                        <td className="p-4 align-middle">Net Profit</td>
                        <td className="p-4 align-middle">₦1,827,000</td>
                        <td className="p-4 align-middle">9%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Custom Report Generator</CardTitle>
                <CardDescription>Create customized reports based on specific criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reportType">Report Type</Label>
                      <Select defaultValue="sales">
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Sales Report</SelectItem>
                          <SelectItem value="stock">Stock Report</SelectItem>
                          <SelectItem value="financial">Financial Report</SelectItem>
                          <SelectItem value="performance">Performance Report</SelectItem>
                          <SelectItem value="customer">Customer Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateRange">Date Range</Label>
                      <DateRangePicker />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="products">Products</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Select products" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Products</SelectItem>
                          <SelectItem value="pms">PMS (Petrol) Only</SelectItem>
                          <SelectItem value="ago">AGO (Diesel) Only</SelectItem>
                          <SelectItem value="dpk">DPK (Kerosene) Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="groupBy">Group By</Label>
                      <Select defaultValue="day">
                        <SelectTrigger>
                          <SelectValue placeholder="Select grouping" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Day</SelectItem>
                          <SelectItem value="week">Week</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="format">Output Format</Label>
                      <Select defaultValue="pdf">
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Document</SelectItem>
                          <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                          <SelectItem value="csv">CSV File</SelectItem>
                          <SelectItem value="html">HTML Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="delivery">Delivery Method</Label>
                      <Select defaultValue="download">
                        <SelectTrigger>
                          <SelectValue placeholder="Select delivery method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="download">Download</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="print">Print</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={generateReport} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Custom Report
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Saved Reports</CardTitle>
                <CardDescription>Access your previously generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Report Name
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Generated On
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Date Range
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {[
                        {
                          name: "Monthly Sales Report",
                          type: "Sales",
                          date: "Jun 15, 2023",
                          range: "May 1 - May 31, 2023",
                        },
                        {
                          name: "Q2 Financial Summary",
                          type: "Financial",
                          date: "Jun 10, 2023",
                          range: "Apr 1 - Jun 30, 2023",
                        },
                        {
                          name: "Stock Movement Analysis",
                          type: "Stock",
                          date: "Jun 5, 2023",
                          range: "May 1 - May 31, 2023",
                        },
                        {
                          name: "Customer Purchase History",
                          type: "Customer",
                          date: "Jun 1, 2023",
                          range: "Jan 1 - May 31, 2023",
                        },
                      ].map((report, i) => (
                        <tr
                          key={i}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle font-medium">{report.name}</td>
                          <td className="p-4 align-middle">{report.type}</td>
                          <td className="p-4 align-middle">{report.date}</td>
                          <td className="p-4 align-middle">{report.range}</td>
                          <td className="p-4 align-middle">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Printer className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
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

