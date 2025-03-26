"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { DateRangePicker } from "@/components/date-range-picker"
import { DataTable } from "@/components/data-table/data-table"
import { transactionColumns } from "@/components/data-table/columns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Download, RefreshCw, Truck, FileText, Filter } from "lucide-react"

export default function DirectSalesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [openSale, setOpenSale] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // Sample data
  const transactions = [
    {
      id: "TRX-1234",
      date: "Today, 10:30 AM",
      type: "Direct Tank Sale",
      amount: 840000,
      quantity: 1200,
      source: "Tank 1 (PMS)",
      status: "Completed",
      reference: "Golden Transport",
    },
    {
      id: "TRX-1233",
      date: "Yesterday, 2:15 PM",
      type: "Direct Tank Sale",
      amount: 640000,
      quantity: 800,
      source: "Tank 2 (AGO)",
      status: "Completed",
      reference: "Farm Fresh Ltd",
    },
    {
      id: "TRX-1232",
      date: "2 days ago, 11:45 AM",
      type: "Direct Tank Sale",
      amount: 1200000,
      quantity: 1500,
      source: "Tank 2 (AGO)",
      status: "Completed",
      reference: "City Power",
    },
    {
      id: "TRX-1231",
      date: "3 days ago, 9:20 AM",
      type: "Direct Tank Sale",
      amount: 525000,
      quantity: 750,
      source: "Tank 1 (PMS)",
      status: "Completed",
      reference: "Metro Logistics",
    },
    {
      id: "TRX-1230",
      date: "4 days ago, 3:10 PM",
      type: "Direct Tank Sale",
      amount: 400000,
      quantity: 500,
      source: "Tank 3 (DPK)",
      status: "Completed",
      reference: "Rural Farmers Coop",
    },
  ]

  return (
    <DashboardLayout role="manager">
      <DashboardHeader title="Direct Tank Sales" description="Manage and record sales made directly from storage tanks">
        <div className="flex flex-col sm:flex-row gap-2">
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
          <Dialog open={openSale} onOpenChange={setOpenSale}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Sale
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
                <Button variant="outline" onClick={() => setOpenSale(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpenSale(false)}>Record Sale</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Sales</TabsTrigger>
              <TabsTrigger value="pms">PMS</TabsTrigger>
              <TabsTrigger value="ago">AGO</TabsTrigger>
              <TabsTrigger value="dpk">DPK</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <DateRangePicker className="w-auto" />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>All Direct Tank Sales</CardTitle>
                <CardDescription>Complete record of all direct sales from storage tanks</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable columns={transactionColumns} data={transactions} searchKey="reference" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pms" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>PMS (Petrol) Sales</CardTitle>
                <CardDescription>Direct sales from petrol tanks</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={transactionColumns}
                  data={transactions.filter((t) => t.source.includes("PMS"))}
                  searchKey="reference"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ago" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>AGO (Diesel) Sales</CardTitle>
                <CardDescription>Direct sales from diesel tanks</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={transactionColumns}
                  data={transactions.filter((t) => t.source.includes("AGO"))}
                  searchKey="reference"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dpk" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>DPK (Kerosene) Sales</CardTitle>
                <CardDescription>Direct sales from kerosene tanks</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={transactionColumns}
                  data={transactions.filter((t) => t.source.includes("DPK"))}
                  searchKey="reference"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 mt-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Summary of direct tank sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="font-medium">Total Sales (This Month)</span>
                  </div>
                  <span className="font-bold">₦3,605,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">Number of Transactions</span>
                  </div>
                  <span className="font-bold">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="font-medium">Total Volume Sold</span>
                  </div>
                  <span className="font-bold">4,750 L</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="font-medium">Average Sale Value</span>
                  </div>
                  <span className="font-bold">₦721,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Customers with highest direct purchase volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "City Power", volume: "1,500 L", amount: "₦1,200,000", product: "AGO" },
                  { name: "Golden Transport", volume: "1,200 L", amount: "₦840,000", product: "PMS" },
                  { name: "Farm Fresh Ltd", volume: "800 L", amount: "₦640,000", product: "AGO" },
                  { name: "Metro Logistics", volume: "750 L", amount: "₦525,000", product: "PMS" },
                  { name: "Rural Farmers Coop", volume: "500 L", amount: "₦400,000", product: "DPK" },
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
      </div>
    </DashboardLayout>
  )
}

