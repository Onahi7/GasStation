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
import { FuelPriceManager } from "@/components/fuel-price-manager"
import { TankMonitoringSystem } from "@/components/tank-monitoring-system"
import { LoyaltyProgram } from "@/components/loyalty-program"
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
import { FuelIcon as GasPump, Droplet, CreditCard, AlertTriangle, Truck, Plus, Download, RefreshCw, DollarSign, Users, FileText } from "lucide-react"

export default function ManagerDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [openTankSale, setOpenTankSale] = useState(false)
  const [openAddTank, setOpenAddTank] = useState(false)
  const [openAddPump, setOpenAddPump] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // Sample data for charts
  const stockData = [
    { day: "Mon", level: 8500 },
    { day: "Tue", level: 7800 },
    { day: "Wed", level: 12800 },
    { day: "Thu", level: 11500 },
    { day: "Fri", level: 10200 },
    { day: "Sat", level: 9100 },
    { day: "Sun", level: 8500 },
  ]

  return (
    <DashboardLayout role="manager">
      <DashboardHeader title="Manager Dashboard" description="Manage stock, pumps, creditors, and generate reports">
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

      <div className="grid gap-4 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Stock"
            value="32,450 L"
            description="Across all tanks"
            icon={<Droplet className="h-4 w-4" />}
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Active Pumps"
            value="12/15"
            description="Operational pumps"
            icon={<GasPump className="h-4 w-4" />}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Direct Tank Sales"
            value="₦350,000"
            description="Today's bulk sales"
            icon={<Truck className="h-4 w-4" />}
            trend={{ value: 25, isPositive: true }}
          />
          <StatCard
            title="Credit Balance"
            value="₦1.2M"
            description="Outstanding credit"
            icon={<CreditCard className="h-4 w-4" />}
            trend={{ value: 8, isPositive: false }}
          />
        </div>

        <div className="p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total Sales Today" 
              value="₦721,000" 
              description="+20.1% from yesterday"
              icon={<DollarSign className="h-4 w-4" />}
            />
            <StatCard 
              title="Active Drivers"
              value="5"
              description="3 deliveries in progress"
              icon={<Truck className="h-4 w-4" />}
            />
            <StatCard 
              title="Stock Level"
              value="85%"
              description="Last updated 5 mins ago"
              icon={<Droplet className="h-4 w-4" />}
            />
            <StatCard 
              title="Creditor Balance"
              value="₦1.2M"
              description="4 accounts over limit"
              icon={<AlertTriangle className="h-4 w-4" />}
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              {/* ...existing sales chart... */}
            </Card>
            
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Button className="w-full justify-start" onClick={() => window.location.href = "/manager/deliveries"}>
                    <Truck className="mr-2 h-4 w-4" />
                    New Delivery Waybill
                  </Button>
                  <Button className="w-full justify-start" onClick={() => window.location.href = "/manager/drivers"}>
                    <Users className="mr-2 h-4 w-4" />
                    Manage Drivers
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = "/manager/reports"}>
                    <FileText className="mr-2 h-4 w-4" />
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="tankMonitoring">
          <TabsList className="mb-4">
            <TabsTrigger value="tankMonitoring">Tank Monitoring</TabsTrigger>
            <TabsTrigger value="fuelPricing">Fuel Pricing</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
            <TabsTrigger value="tanks">Tank Management</TabsTrigger>
            <TabsTrigger value="pumps">Pump Configuration</TabsTrigger>
            <TabsTrigger value="creditors">Creditor Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tankMonitoring" className="space-y-4">
            <TankMonitoringSystem />
          </TabsContent>
          
          <TabsContent value="fuelPricing" className="space-y-4">
            <FuelPriceManager />
          </TabsContent>
          
          <TabsContent value="loyalty" className="space-y-4">
            <LoyaltyProgram />
          </TabsContent>
          
          <TabsContent value="tanks" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Tank Overview</h3>
              <div className="flex gap-2">
                <Dialog open={openTankSale} onOpenChange={setOpenTankSale}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Truck className="mr-2 h-4 w-4" />
                      Direct Sale
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Record Direct Tank Sale</DialogTitle>
                      <DialogDescription>Enter the details for the direct sale from tank.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tank" className="text-right">
                          Tank
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select tank" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tank1">Tank 1 (PMS) - 8,500L</SelectItem>
                            <SelectItem value="tank2">Tank 2 (AGO) - 5,600L</SelectItem>
                            <SelectItem value="tank3">Tank 3 (DPK) - 1,000L</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">
                          Quantity (L)
                        </Label>
                        <Input id="quantity" type="number" placeholder="1000" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                          Price (₦/L)
                        </Label>
                        <Input id="price" type="number" placeholder="700" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="recipient" className="text-right">
                          Recipient
                        </Label>
                        <Input id="recipient" placeholder="Company name" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="receipt" className="text-right">
                          Receipt #
                        </Label>
                        <Input id="receipt" placeholder="Receipt number" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                          Notes
                        </Label>
                        <Textarea id="notes" placeholder="Additional information" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenTankSale(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setOpenTankSale(false)}>Record Sale</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={openAddTank} onOpenChange={setOpenAddTank}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Tank
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Tank</DialogTitle>
                      <DialogDescription>Enter the details for the new storage tank.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Tank Name
                        </Label>
                        <Input id="name" placeholder="Tank 6" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          Fuel Type
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pms">PMS (Petrol)</SelectItem>
                            <SelectItem value="ago">AGO (Diesel)</SelectItem>
                            <SelectItem value="dpk">DPK (Kerosene)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="capacity" className="text-right">
                          Capacity (L)
                        </Label>
                        <Input id="capacity" type="number" placeholder="10000" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="initial" className="text-right">
                          Initial Level (L)
                        </Label>
                        <Input id="initial" type="number" placeholder="0" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenAddTank(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setOpenAddTank(false)}>Add Tank</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Tank 1", type: "PMS (Petrol)", capacity: "10,000 L", current: "8,500 L", percentage: 85 },
                { name: "Tank 2", type: "AGO (Diesel)", capacity: "8,000 L", current: "5,600 L", percentage: 70 },
                { name: "Tank 3", type: "DPK (Kerosene)", capacity: "5,000 L", current: "1,000 L", percentage: 20 },
              ].map((tank, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{tank.name}</CardTitle>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <AlertTriangle
                          className={`h-4 w-4 ${tank.percentage < 30 ? "text-red-500" : "text-muted-foreground"}`}
                        />
                      </Button>
                    </div>
                    <CardDescription>{tank.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Capacity:</span>
                        <span className="font-medium">{tank.capacity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Current Level:</span>
                        <span className="font-medium">{tank.current}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className={`h-2 rounded-full ${tank.percentage < 30 ? "bg-red-500" : "bg-primary"}`}
                          style={{ width: `${tank.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Status:</span>
                        <span className={`font-medium ${tank.percentage < 30 ? "text-red-500" : "text-green-500"}`}>
                          {tank.percentage < 30 ? "Low Stock" : "Adequate"}
                        </span>
                      </div>
                      <div className="pt-2 flex gap-2">
                        <Button size="sm" variant="outline" className="w-full">
                          Refill
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          Direct Sale
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Stock Movement</CardTitle>
                <CardDescription>Weekly stock level changes</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <AreaChart data={stockData} xKey="day" yKey="level" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pumps" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Pump Configuration</h3>
              <Dialog open={openAddPump} onOpenChange={setOpenAddPump}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Pump
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Pump</DialogTitle>
                    <DialogDescription>Enter the details for the new fuel pump.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="label" className="text-right">
                        Pump ID
                      </Label>
                      <Input id="label" placeholder="PMS4" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fuelType" className="text-right">
                        Fuel Type
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pms">PMS (Petrol)</SelectItem>
                          <SelectItem value="ago">AGO (Diesel)</SelectItem>
                          <SelectItem value="dpk">DPK (Kerosene)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tank" className="text-right">
                        Connect to Tank
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select tank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tank1">Tank 1 (PMS)</SelectItem>
                          <SelectItem value="tank2">Tank 2 (AGO)</SelectItem>
                          <SelectItem value="tank3">Tank 3 (DPK)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">
                        Price (₦/L)
                      </Label>
                      <Input id="price" type="number" placeholder="700" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="worker" className="text-right">
                        Assign to
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select worker" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="john">John Doe</SelectItem>
                          <SelectItem value="jane">Jane Smith</SelectItem>
                          <SelectItem value="mike">Mike Johnson</SelectItem>
                          <SelectItem value="sarah">Sarah Williams</SelectItem>
                          <SelectItem value="none">Unassigned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenAddPump(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setOpenAddPump(false)}>Add Pump</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { id: "PMS1", type: "Petrol", tank: "Tank 1", price: "₦700/L", status: "Active", worker: "John Doe" },
                { id: "PMS2", type: "Petrol", tank: "Tank 1", price: "₦700/L", status: "Active", worker: "Jane Smith" },
                {
                  id: "AGO1",
                  type: "Diesel",
                  tank: "Tank 2",
                  price: "₦800/L",
                  status: "Active",
                  worker: "Mike Johnson",
                },
                {
                  id: "AGO2",
                  type: "Diesel",
                  tank: "Tank 2",
                  price: "₦800/L",
                  status: "Inactive",
                  worker: "Unassigned",
                },
                {
                  id: "DPK1",
                  type: "Kerosene",
                  tank: "Tank 3",
                  price: "₦750/L",
                  status: "Active",
                  worker: "Sarah Williams",
                },
              ].map((pump, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>Pump {pump.id}</CardTitle>
                      <div
                        className={`px-2 py-1 rounded-full text-xs ${
                          pump.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pump.status}
                      </div>
                    </div>
                    <CardDescription>{pump.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Connected to:</span>
                        <span className="font-medium">{pump.tank}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Price:</span>
                        <span className="font-medium">{pump.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Assigned to:</span>
                        <span className="font-medium">{pump.worker}</span>
                      </div>
                      <div className="pt-2 flex gap-2">
                        <Button size="sm" variant="outline" className="w-full">
                          Configure
                        </Button>
                        <Button
                          size="sm"
                          variant={pump.status === "Active" ? "destructive" : "default"}
                          className="w-full"
                        >
                          {pump.status === "Active" ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="creditors" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Creditor Management</h3>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Creditor
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Creditor Accounts</CardTitle>
                <CardDescription>Manage credit accounts and track balances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "XYZ Logistics", balance: "₦450,000", limit: "₦500,000", status: "Good Standing" },
                    { name: "ABC Corporation", balance: "₦320,000", limit: "₦300,000", status: "Over Limit" },
                    { name: "City Transport", balance: "₦180,000", limit: "₦200,000", status: "Good Standing" },
                    { name: "Quick Delivery", balance: "₦250,000", limit: "₦250,000", status: "At Limit" },
                  ].map((creditor, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{creditor.name}</div>
                        <div className="text-sm text-muted-foreground">Limit: {creditor.limit}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{creditor.balance}</div>
                        <div
                          className={`text-sm ${
                            creditor.status === "Good Standing"
                              ? "text-green-500"
                              : creditor.status === "At Limit"
                                ? "text-amber-500"
                                : "text-red-500"
                          }`}
                        >
                          {creditor.status}
                        </div>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Record Payment
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Direct Tank Sales</CardTitle>
              <CardDescription>Bulk sales made directly from tanks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    recipient: "Golden Transport",
                    tank: "Tank 1 (PMS)",
                    quantity: "1,200 L",
                    amount: "₦840,000",
                    time: "2 hours ago",
                  },
                  {
                    recipient: "Farm Fresh Ltd",
                    tank: "Tank 2 (AGO)",
                    quantity: "800 L",
                    amount: "₦640,000",
                    time: "Yesterday",
                  },
                  {
                    recipient: "City Power",
                    tank: "Tank 2 (AGO)",
                    quantity: "1,500 L",
                    amount: "₦1,200,000",
                    time: "2 days ago",
                  },
                ].map((sale, i) => (
                  <div key={i} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">{sale.recipient}</div>
                      <div className="text-sm text-muted-foreground">
                        {sale.tank} • {sale.quantity}
                      </div>
                      <div className="text-xs text-muted-foreground">{sale.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{sale.amount}</div>
                      <Button size="sm" variant="ghost" className="h-8">
                        View Receipt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Stock Alerts</CardTitle>
              <CardDescription>Tanks requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-red-500" />
                  <div>
                    <div className="font-medium">Low Stock Alert - Tank 3 (DPK)</div>
                    <div className="text-sm text-muted-foreground">Current level: 1,000 L (20% of capacity)</div>
                    <div className="mt-2">
                      <Button size="sm" variant="outline">
                        Schedule Delivery
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                  <div>
                    <div className="font-medium">Stock Discrepancy - Tank 2 (AGO)</div>
                    <div className="text-sm text-muted-foreground">
                      Expected: 5,750 L • Actual: 5,600 L • Difference: 150 L
                    </div>
                    <div className="mt-2">
                      <Button size="sm" variant="outline">
                        Investigate
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Truck className="mt-0.5 h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Scheduled Delivery - Tank 1 (PMS)</div>
                    <div className="text-sm text-muted-foreground">5,000 L delivery scheduled for tomorrow</div>
                    <div className="mt-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

