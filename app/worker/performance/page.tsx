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
import { RefreshCw, Download, CheckCircle, XCircle } from "lucide-react"

export default function PerformancePage() {
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // Sample data for charts
  const salesData = [
    { day: "Mon", volume: 22.5 },
    { day: "Tue", volume: 25.3 },
    { day: "Wed", volume: 24.8 },
    { day: "Thu", volume: 26.2 },
    { day: "Fri", volume: 28.5 },
    { day: "Sat", volume: 30.1 },
    { day: "Sun", volume: 27.4 },
  ]

  const accuracyData = [
    { month: "Jan", accuracy: 97 },
    { month: "Feb", accuracy: 98 },
    { month: "Mar", accuracy: 96 },
    { month: "Apr", accuracy: 99 },
    { month: "May", accuracy: 98 },
    { month: "Jun", accuracy: 99 },
  ]

  return (
    <DashboardLayout role="worker">
      <DashboardHeader title="Performance Metrics" description="Track your work performance and metrics">
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
            Export
          </Button>
        </div>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales Performance</TabsTrigger>
            <TabsTrigger value="accuracy">Cash Accuracy</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Sales Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">184.8 L</div>
                  <p className="text-xs text-muted-foreground">Total volume sold this week</p>
                  <div className="mt-2 flex items-center text-xs">
                    <span className="text-green-500 mr-1">↑ 12%</span>
                    <span className="text-muted-foreground">from last week</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Cash Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.5%</div>
                  <p className="text-xs text-muted-foreground">Cash submission accuracy rate</p>
                  <div className="mt-2 flex items-center text-xs">
                    <span className="text-green-500 mr-1">↑ 1.5%</span>
                    <span className="text-muted-foreground">from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">100%</div>
                  <p className="text-xs text-muted-foreground">On-time arrival for shifts</p>
                  <div className="mt-2 flex items-center text-xs">
                    <span className="text-green-500 mr-1">↑ 0%</span>
                    <span className="text-muted-foreground">from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8/5</div>
                  <p className="text-xs text-muted-foreground">Average customer satisfaction</p>
                  <div className="mt-2 flex items-center text-xs">
                    <span className="text-green-500 mr-1">↑ 0.2</span>
                    <span className="text-muted-foreground">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Your overall performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      label: "Sales Volume",
                      value: "184.8 L",
                      description: "Total volume sold this week",
                      trend: "+12%",
                    },
                    {
                      label: "Revenue Generated",
                      value: "₦129,360",
                      description: "Total revenue from sales",
                      trend: "+10%",
                    },
                    {
                      label: "Cash Accuracy",
                      value: "98.5%",
                      description: "Cash submission accuracy rate",
                      trend: "+1.5%",
                    },
                    { label: "Attendance", value: "100%", description: "On-time arrival for shifts", trend: "0%" },
                    {
                      label: "Customer Rating",
                      value: "4.8/5",
                      description: "Average customer satisfaction",
                      trend: "+0.2",
                    },
                  ].map((metric, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{metric.label}</div>
                        <div className="text-sm text-muted-foreground">{metric.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{metric.value}</div>
                        <div className="text-xs text-green-500">{metric.trend}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Sales Volume</CardTitle>
                  <CardDescription>Your sales volume trend over the past week</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <AreaChart data={salesData} xKey="day" yKey="volume" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Cash Accuracy Trend</CardTitle>
                  <CardDescription>Your cash submission accuracy over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <AreaChart data={accuracyData} xKey="month" yKey="accuracy" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Detailed breakdown of your sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <h3 className="font-medium">Total Volume Sold</h3>
                      <div className="text-2xl font-bold">184.8 L</div>
                      <div className="text-xs text-green-500">↑ 12% from last week</div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Revenue Generated</h3>
                      <div className="text-2xl font-bold">₦129,360</div>
                      <div className="text-xs text-green-500">↑ 10% from last week</div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Average Daily Sales</h3>
                      <div className="text-2xl font-bold">26.4 L</div>
                      <div className="text-xs text-green-500">↑ 8% from last week</div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="font-medium mb-2">Sales by Pump</h3>
                    <div className="space-y-4">
                      {[
                        { pump: "PMS1", volume: "105.3 L", revenue: "₦73,710", percentage: 57 },
                        { pump: "AGO1", volume: "79.5 L", revenue: "₦55,650", percentage: 43 },
                      ].map((pump, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="font-medium">{pump.pump}</div>
                            <div>
                              {pump.volume} (₦{pump.revenue})
                            </div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-primary" style={{ width: `${pump.percentage}%` }}></div>
                          </div>
                          <div className="text-xs text-muted-foreground text-right">{pump.percentage}% of total</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Sales Log</CardTitle>
                <CardDescription>Record of your daily sales activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Pump</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Volume (L)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Revenue (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Submission
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {[
                        {
                          date: "Jun 15, 2023",
                          pump: "PMS1",
                          volume: "22.2 L",
                          revenue: "₦15,540",
                          submission: "Balanced",
                        },
                        {
                          date: "Jun 15, 2023",
                          pump: "AGO1",
                          volume: "24.5 L",
                          revenue: "₦19,600",
                          submission: "Balanced",
                        },
                        {
                          date: "Jun 14, 2023",
                          pump: "PMS1",
                          volume: "25.3 L",
                          revenue: "₦17,710",
                          submission: "Balanced",
                        },
                        {
                          date: "Jun 14, 2023",
                          pump: "AGO1",
                          volume: "25.2 L",
                          revenue: "₦20,160",
                          submission: "Balanced",
                        },
                        {
                          date: "Jun 13, 2023",
                          pump: "PMS1",
                          volume: "24.5 L",
                          revenue: "₦17,150",
                          submission: "Shortage (₦1,500)",
                        },
                      ].map((day, i) => (
                        <tr
                          key={i}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">{day.date}</td>
                          <td className="p-4 align-middle">{day.pump}</td>
                          <td className="p-4 align-middle">{day.volume}</td>
                          <td className="p-4 align-middle">{day.revenue}</td>
                          <td className="p-4 align-middle">
                            <span className={day.submission === "Balanced" ? "text-green-600" : "text-red-600"}>
                              {day.submission}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accuracy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cash Accuracy</CardTitle>
                <CardDescription>Your cash submission accuracy metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <h3 className="font-medium">Overall Accuracy Rate</h3>
                      <div className="text-2xl font-bold">98.5%</div>
                      <div className="text-xs text-green-500">↑ 1.5% from last month</div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Total Discrepancies</h3>
                      <div className="text-2xl font-bold">₦1,500</div>
                      <div className="text-xs text-green-500">↓ 50% from last month</div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Balanced Submissions</h3>
                      <div className="text-2xl font-bold">29/30</div>
                      <div className="text-xs text-green-500">↑ 2 from last month</div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="font-medium mb-2">Monthly Accuracy Trend</h3>
                    <div className="h-80">
                      <BarChart data={accuracyData} xKey="month" yKey="accuracy" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cash Submission History</CardTitle>
                <CardDescription>Record of your cash submission accuracy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Expected (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Submitted (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Discrepancy (₦)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {[
                        {
                          date: "Jun 15, 2023",
                          expected: "₦35,140",
                          submitted: "₦35,140",
                          discrepancy: "₦0",
                          status: "Balanced",
                        },
                        {
                          date: "Jun 14, 2023",
                          expected: "₦37,870",
                          submitted: "₦37,870",
                          discrepancy: "₦0",
                          status: "Balanced",
                        },
                        {
                          date: "Jun 13, 2023",
                          expected: "₦35,650",
                          submitted: "₦34,150",
                          discrepancy: "-₦1,500",
                          status: "Shortage",
                        },
                        {
                          date: "Jun 12, 2023",
                          expected: "₦33,250",
                          submitted: "₦33,250",
                          discrepancy: "₦0",
                          status: "Balanced",
                        },
                        {
                          date: "Jun 11, 2023",
                          expected: "₦36,750",
                          submitted: "₦36,750",
                          discrepancy: "₦0",
                          status: "Balanced",
                        },
                      ].map((submission, i) => (
                        <tr
                          key={i}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">{submission.date}</td>
                          <td className="p-4 align-middle">{submission.expected}</td>
                          <td className="p-4 align-middle">{submission.submitted}</td>
                          <td className="p-4 align-middle">
                            <span className={submission.discrepancy === "₦0" ? "text-green-600" : "text-red-600"}>
                              {submission.discrepancy}
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            <span className={submission.status === "Balanced" ? "text-green-600" : "text-red-600"}>
                              {submission.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Record</CardTitle>
                <CardDescription>Your shift attendance and punctuality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <h3 className="font-medium">Attendance Rate</h3>
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-xs text-green-500">Perfect attendance</div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Punctuality Rate</h3>
                      <div className="text-2xl font-bold">98%</div>
                      <div className="text-xs text-green-500">↑ 2% from last month</div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Average Arrival</h3>
                      <div className="text-2xl font-bold">5 min early</div>
                      <div className="text-xs text-green-500">Consistently early</div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="font-medium mb-2">Recent Shifts</h3>
                    <div className="space-y-4">
                      {[
                        {
                          date: "Jun 15, 2023",
                          shift: "2:00 PM - 10:00 PM",
                          arrival: "1:55 PM",
                          status: "On Time",
                          pumps: "PMS1, AGO1",
                        },
                        {
                          date: "Jun 14, 2023",
                          shift: "2:00 PM - 10:00 PM",
                          arrival: "1:50 PM",
                          status: "On Time",
                          pumps: "PMS1, AGO1",
                        },
                        {
                          date: "Jun 13, 2023",
                          shift: "6:00 AM - 2:00 PM",
                          arrival: "5:55 AM",
                          status: "On Time",
                          pumps: "PMS2, DPK1",
                        },
                        {
                          date: "Jun 12, 2023",
                          shift: "6:00 AM - 2:00 PM",
                          arrival: "6:05 AM",
                          status: "Late (5 min)",
                          pumps: "PMS2, DPK1",
                        },
                        {
                          date: "Jun 11, 2023",
                          shift: "2:00 PM - 10:00 PM",
                          arrival: "1:45 PM",
                          status: "On Time",
                          pumps: "PMS1, AGO1",
                        },
                      ].map((shift, i) => (
                        <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                          {shift.status.includes("Late") ? (
                            <XCircle className="mt-0.5 h-5 w-5 text-amber-500" />
                          ) : (
                            <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium">{shift.date}</div>
                            <div className="text-sm text-muted-foreground">
                              Shift: {shift.shift} • Pumps: {shift.pumps}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">Arrived: {shift.arrival}</div>
                            <div
                              className={`text-sm ${shift.status === "On Time" ? "text-green-600" : "text-amber-600"}`}
                            >
                              {shift.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Shifts</CardTitle>
                <CardDescription>Your scheduled work hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { day: "Today", time: "2:00 PM - 10:00 PM", pumps: "PMS1, AGO1", status: "Current" },
                    { day: "Tomorrow", time: "6:00 AM - 2:00 PM", pumps: "PMS2, DPK1", status: "Upcoming" },
                    { day: "Friday", time: "2:00 PM - 10:00 PM", pumps: "PMS1, AGO1", status: "Upcoming" },
                    { day: "Saturday", time: "6:00 AM - 2:00 PM", pumps: "PMS2, DPK1", status: "Upcoming" },
                    { day: "Sunday", time: "2:00 PM - 10:00 PM", pumps: "PMS1, AGO1", status: "Upcoming" },
                  ].map((shift, i) => (
                    <div key={i} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{shift.day}</div>
                        <div className="text-sm text-muted-foreground">{shift.time}</div>
                        <div className="text-sm text-muted-foreground">Pumps: {shift.pumps}</div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs ${
                          shift.status === "Current" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {shift.status}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

