"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table/data-table"
import { creditorColumns, type Creditor } from "@/components/data-table/columns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Download, Upload, RefreshCw, CreditCard, DollarSign } from "lucide-react"

export default function CreditorsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [openAddCreditor, setOpenAddCreditor] = useState(false)
  const [openRecordPayment, setOpenRecordPayment] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // Sample data
  const creditors: Creditor[] = [
    {
      id: "cred1",
      name: "XYZ Logistics",
      contactPerson: "John Smith",
      phone: "080-1234-5678",
      creditLimit: 500000,
      balance: 450000,
      lastPayment: "3 days ago",
      status: "Good Standing",
    },
    {
      id: "cred2",
      name: "ABC Corporation",
      contactPerson: "Jane Doe",
      phone: "080-2345-6789",
      creditLimit: 300000,
      balance: 320000,
      lastPayment: "1 week ago",
      status: "Over Limit",
    },
    {
      id: "cred3",
      name: "City Transport",
      contactPerson: "Mike Johnson",
      phone: "080-3456-7890",
      creditLimit: 200000,
      balance: 180000,
      lastPayment: "2 days ago",
      status: "Good Standing",
    },
    {
      id: "cred4",
      name: "Quick Delivery",
      contactPerson: "Sarah Williams",
      phone: "080-4567-8901",
      creditLimit: 250000,
      balance: 250000,
      lastPayment: "5 days ago",
      status: "At Limit",
    },
    {
      id: "cred5",
      name: "Metro Logistics",
      contactPerson: "David Brown",
      phone: "080-5678-9012",
      creditLimit: 400000,
      balance: 0,
      lastPayment: "1 day ago",
      status: "Good Standing",
    },
    {
      id: "cred6",
      name: "Express Freight",
      contactPerson: "Robert Taylor",
      phone: "080-6789-0123",
      creditLimit: 350000,
      balance: 350000,
      lastPayment: "2 weeks ago",
      status: "Suspended",
    },
  ]

  return (
    <DashboardLayout role="manager">
      <DashboardHeader
        title="Creditor Management"
        description="Manage credit accounts, track balances, and record payments"
      >
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
          <Dialog open={openAddCreditor} onOpenChange={setOpenAddCreditor}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Creditor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Creditor</DialogTitle>
                <DialogDescription>Enter the details for the new credit account.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Company Name
                  </Label>
                  <Input id="name" placeholder="Company name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contactPerson" className="text-right">
                    Contact Person
                  </Label>
                  <Input id="contactPerson" placeholder="Full name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone Number
                  </Label>
                  <Input id="phone" placeholder="080-1234-5678" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="creditLimit" className="text-right">
                    Credit Limit (₦)
                  </Label>
                  <Input id="creditLimit" type="number" placeholder="300000" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="initialBalance" className="text-right">
                    Initial Balance (₦)
                  </Label>
                  <Input id="initialBalance" type="number" placeholder="0" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenAddCreditor(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpenAddCreditor(false)}>Add Creditor</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={openRecordPayment} onOpenChange={setOpenRecordPayment}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <DollarSign className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Record Credit Payment</DialogTitle>
                <DialogDescription>Enter payment details to update creditor balance.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="creditor" className="text-right">
                    Creditor
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select creditor" />
                    </SelectTrigger>
                    <SelectContent>
                      {creditors.map((creditor) => (
                        <SelectItem key={creditor.id} value={creditor.id}>
                          {creditor.name} (₦{creditor.balance.toLocaleString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount (₦)
                  </Label>
                  <Input id="amount" type="number" placeholder="100000" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reference" className="text-right">
                    Reference
                  </Label>
                  <Input id="reference" placeholder="Receipt or transfer number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentMethod" className="text-right">
                    Payment Method
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="transfer">Bank Transfer</SelectItem>
                      <SelectItem value="pos">POS</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenRecordPayment(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpenRecordPayment(false)}>Record Payment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Creditors</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="overlimit">Over Limit</TabsTrigger>
              <TabsTrigger value="suspended">Suspended</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>All Creditors</CardTitle>
                <CardDescription>Manage all credit accounts and track balances</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable columns={creditorColumns} data={creditors} searchKey="name" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Active Creditors</CardTitle>
                <CardDescription>Creditors with active accounts in good standing</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={creditorColumns}
                  data={creditors.filter((c) => c.status === "Good Standing" || c.status === "At Limit")}
                  searchKey="name"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overlimit" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Over Limit Creditors</CardTitle>
                <CardDescription>Creditors who have exceeded their credit limit</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={creditorColumns}
                  data={creditors.filter((c) => c.status === "Over Limit")}
                  searchKey="name"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suspended" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Suspended Creditors</CardTitle>
                <CardDescription>Creditors with suspended accounts</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={creditorColumns}
                  data={creditors.filter((c) => c.status === "Suspended")}
                  searchKey="name"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 mt-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Credit Summary</CardTitle>
              <CardDescription>Overview of credit accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-medium">Total Credit Issued</span>
                  </div>
                  <span className="font-bold">₦1,550,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-medium">Available Credit</span>
                  </div>
                  <span className="font-bold">₦450,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-medium">Total Credit Limit</span>
                  </div>
                  <span className="font-bold">₦2,000,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-medium">Utilization Rate</span>
                  </div>
                  <span className="font-bold">77.5%</span>
                </div>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: "77.5%" }}></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Latest payments from creditors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Metro Logistics", amount: "₦400,000", date: "1 day ago", method: "Bank Transfer" },
                  { name: "City Transport", amount: "₦70,000", date: "2 days ago", method: "Cash" },
                  { name: "XYZ Logistics", amount: "₦100,000", date: "3 days ago", method: "POS" },
                  { name: "Quick Delivery", amount: "₦30,000", date: "5 days ago", method: "Cash" },
                  { name: "ABC Corporation", amount: "₦50,000", date: "1 week ago", method: "Bank Transfer" },
                ].map((payment, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">{payment.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {payment.date} • {payment.method}
                      </div>
                    </div>
                    <div className="text-right font-medium">{payment.amount}</div>
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

