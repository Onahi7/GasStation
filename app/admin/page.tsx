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
import { FuelPriceManager } from "@/components/fuel-price-manager"
import { TankMonitoringSystem } from "@/components/tank-monitoring-system"
import { LoyaltyProgram } from "@/components/loyalty-program"
import {
  FuelIcon as GasPump,
  Droplet,
  DollarSign,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
} from "lucide-react"

export default function AdminDashboard() {
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
    { day: "Mon", sales: 120000 },
    { day: "Tue", sales: 150000 },
    { day: "Wed", sales: 180000 },
    { day: "Thu", sales: 140000 },
    { day: "Fri", sales: 200000 },
    { day: "Sat", sales: 250000 },
    { day: "Sun", sales: 190000 },
  ]

  const hourlyData = [
    { hour: "6AM", volume: 120 },
    { hour: "8AM", volume: 350 },
    { hour: "10AM", volume: 280 },
    { hour: "12PM", volume: 200 },
    { hour: "2PM", volume: 230 },
    { hour: "4PM", volume: 300 },
    { hour: "6PM", volume: 380 },
    { hour: "8PM", volume: 290 },
    { hour: "10PM", volume: 150 },
  ]

  const productData = [
    { name: "PMS (Petrol)", value: 65, color: "#4f46e5" },
    { name: "AGO (Diesel)", value: 25, color: "#0ea5e9" },
    { name: "DPK (Kerosene)", value: 10, color: "#f59e0b" },
  ]

  const paymentData = [
    { name: "Cash", value: 70, color: "#10b981" },
    { name: "Credit", value: 25, color: "#6366f1" },
    { name: "Direct Tank", value: 5, color: "#f59e0b" },
  ]

  return (
    <DashboardLayout role="admin">
      <DashboardHeader
        title="Admin Dashboard"
        description="Overview of station performance, user activity, stock levels, and finances."
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <DateRangePicker />
          <Button onClick={refreshData} disabled={isLoading}>
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

      <div className="grid gap-4 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value="₦1,234,567"
            description="Daily revenue across all pumps"
            icon={<DollarSign className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Fuel Sold"
            value="12,345 L"
            description="Total volume across all products"
            icon={<Droplet className="h-4 w-4" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Active Pumps"
            value="12/15"
            description="Operational pumps"
            icon={<GasPump className="h-4 w-4" />}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Stock Alerts"
            value="2"
            description="Tanks with low stock levels"
            icon={<AlertTriangle className="h-4 w-4" />}
            trend={{ value: 50, isPositive: false }}
          />
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tankMonitoring">Tank Monitoring</TabsTrigger>
            <TabsTrigger value="fuelPricing">Fuel Pricing</TabsTrigger>
            <TabsTrigger value="loyaltyProgram">Loyalty Program</TabsTrigger>
            <TabsTrigger value="sales">Sales Overview</TabsTrigger>
            <TabsTrigger value="stock">Stock Levels</TabsTrigger>
            <TabsTrigger value="financial">Financial Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
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
              
              {/* Keep the existing dashboard charts and stats... */}
            </div>
          </TabsContent>
          
          <TabsContent value="tankMonitoring" className="space-y-4">
            <TankMonitoringSystem />
          </TabsContent>
          
          <TabsContent value="fuelPricing" className="space-y-4">
            <FuelPriceManager />
          </TabsContent>
          
          <TabsContent value="loyaltyProgram" className="space-y-4">
            <LoyaltyProgram />
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-4">
            {/* Existing sales tab content */}
          </TabsContent>

          <TabsContent value="stock" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Tank Levels</CardTitle>
                  <CardDescription>Current stock levels for all tanks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["PMS (Petrol)", "AGO (Diesel)", "DPK (Kerosene)"].map((fuel, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center">
                          <div className="font-medium">{fuel}</div>
                          <div className="ml-auto font-medium">{85 - i * 15}%</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className={`h-2 rounded-full ${i === 2 ? "bg-red-500" : "bg-primary"}`}
                            style={{ width: `${85 - i * 15}%` }}
                          ></div>
                        </div>
                        {i === 2 && (
                          <div className="flex items-center text-xs text-red-500">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Low stock alert
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Stock Movement</CardTitle>
                  <CardDescription>Weekly stock changes</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <AreaChart data={salesData} xKey="day" yKey="sales" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Deliveries</CardTitle>
                  <CardDescription>Latest stock replenishments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{["PMS", "AGO", "PMS"][i]} Delivery</div>
                          <div className="text-sm text-muted-foreground">{["Today", "Yesterday", "3 days ago"][i]}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{[5000, 3000, 4500][i]} L</div>
                          <div className="text-sm text-muted-foreground">Tank {i + 1}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="financial" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Revenue by product type</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <PieChart data={productData} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Cash vs Credit Sales</CardTitle>
                  <CardDescription>Payment method distribution</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <PieChart data={paymentData} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Financial Alerts</CardTitle>
                  <CardDescription>Recent discrepancies and issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                        <div>
                          <div className="font-medium">
                            {["Cash shortage detected", "Overdue credit payment", "Reconciliation needed"][i]}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {
                              [
                                "Worker: John D. - ₦5,000 shortage on Pump 3",
                                "Creditor: XYZ Company - ₦150,000 overdue",
                                "Tank 2 stock discrepancy of 120L",
                              ][i]
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      {
                        [
                          <Users key={0} className="h-4 w-4" />,
                          <GasPump key={1} className="h-4 w-4" />,
                          <Droplet key={2} className="h-4 w-4" />,
                          <DollarSign key={3} className="h-4 w-4" />,
                          <AlertTriangle key={4} className="h-4 w-4" />,
                        ][i]
                      }
                    </div>
                    <div>
                      <div className="font-medium">
                        {
                          [
                            "New worker added",
                            "Pump configuration updated",
                            "Stock delivery recorded",
                            "Credit payment received",
                            "Low stock alert triggered",
                          ][i]
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {
                          [
                            "James Smith added as a new worker",
                            "Pump 4 reassigned to Tank 2",
                            "5,000L of PMS added to Tank 1",
                            "ABC Corp paid ₦250,000 against invoice #123",
                            "Tank 3 (DPK) below 20% capacity",
                          ][i]
                        }
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {["10 minutes", "30 minutes", "2 hours", "5 hours", "1 day"][i]} ago
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Average Sales per Pump", value: "₦85,400", trend: { value: 5, isPositive: true } },
                  { label: "Stock Turnover Rate", value: "3.2 days", trend: { value: 10, isPositive: true } },
                  { label: "Credit Recovery Rate", value: "92%", trend: { value: 3, isPositive: true } },
                  { label: "Operational Efficiency", value: "87%", trend: { value: 2, isPositive: false } },
                ].map((metric, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="font-medium">{metric.label}</div>
                    <div className="flex items-center gap-2">
                      <div>{metric.value}</div>
                      <div className={metric.trend.isPositive ? "text-green-500" : "text-red-500"}>
                        {metric.trend.isPositive ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
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

