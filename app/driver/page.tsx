"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Truck, 
  FileText,
  Clock,
  Warehouse,
  RefreshCw,
  BarChart
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { StatCard } from "@/components/stat-card"
import { AreaChart } from "@/components/charts/area-chart"

export default function DriverDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Refresh data
      toast({
        title: "Refreshed",
        description: "Data has been refreshed successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Sample data for driver's performance chart
  const performanceData = [
    { month: "Jan", deliveries: 45 },
    { month: "Feb", deliveries: 52 },
    { month: "Mar", deliveries: 48 },
    { month: "Apr", deliveries: 55 },
    { month: "May", deliveries: 50 },
    { month: "Jun", deliveries: 58 },
  ]

  return (
    <DashboardLayout role="driver">
      <DashboardHeader 
        title="Driver Dashboard" 
        description="View your deliveries and performance"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleRefresh} disabled={isLoading} variant="outline">
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
        </div>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Today's Deliveries" 
            value="2/3" 
            description="On schedule"
            icon={<Truck className="h-4 w-4" />}
          />
          <StatCard 
            title="Volume Delivered"
            value="66,000 L"
            description="2 trips completed"
            icon={<Warehouse className="h-4 w-4" />}
          />
          <StatCard 
            title="Average Trip Time"
            value="45 mins"
            description="Better than target"
            icon={<Clock className="h-4 w-4" />}
          />
          <StatCard 
            title="Performance Score"
            value="95%"
            description="Based on last 30 days"
            icon={<BarChart className="h-4 w-4" />}
          />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Delivery Performance</CardTitle>
              <CardDescription>Number of deliveries per month</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <AreaChart data={performanceData} xKey="month" yKey="deliveries" />
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your delivery assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    waybill: "WB001",
                    terminal: "Terminal A",
                    product: "PMS",
                    volume: "33,000 L",
                    status: "Completed",
                  },
                  {
                    waybill: "WB002",
                    terminal: "Terminal B",
                    product: "AGO",
                    volume: "33,000 L",
                    status: "In Progress",
                  },
                  {
                    waybill: "WB003",
                    terminal: "Terminal C",
                    product: "PMS",
                    volume: "33,000 L",
                    status: "Pending",
                  },
                ].map((delivery, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">Waybill #{delivery.waybill}</div>
                      <div className="text-sm text-muted-foreground">
                        {delivery.terminal} • {delivery.product} • {delivery.volume}
                      </div>
                    </div>
                    <div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${
                          delivery.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : delivery.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {delivery.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Deliveries</CardTitle>
              <CardDescription>Your delivery history and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waybill #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Terminal</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Expected Vol.</TableHead>
                    <TableHead>Delivered Vol.</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      waybill: "WB001",
                      date: "2025-03-26",
                      terminal: "Terminal A",
                      product: "PMS",
                      expectedVol: "33,000 L",
                      deliveredVol: "33,000 L",
                      status: "Completed",
                    },
                    {
                      waybill: "WB002",
                      date: "2025-03-26",
                      terminal: "Terminal B",
                      product: "AGO",
                      expectedVol: "33,000 L",
                      deliveredVol: "32,850 L",
                      status: "Completed",
                    },
                    {
                      waybill: "WB003",
                      date: "2025-03-26",
                      terminal: "Terminal C",
                      product: "PMS",
                      expectedVol: "33,000 L",
                      deliveredVol: "-",
                      status: "Pending",
                    },
                  ].map((delivery, i) => (
                    <TableRow key={i}>
                      <TableCell>{delivery.waybill}</TableCell>
                      <TableCell>{delivery.date}</TableCell>
                      <TableCell>{delivery.terminal}</TableCell>
                      <TableCell>{delivery.product}</TableCell>
                      <TableCell>{delivery.expectedVol}</TableCell>
                      <TableCell>{delivery.deliveredVol}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${
                            delivery.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : delivery.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {delivery.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}