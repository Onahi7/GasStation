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
import { BarChart } from "@/components/charts/bar-chart"
import { Search, Download, RefreshCw, Filter, FileText } from "lucide-react"

export default function TransactionsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [openAudit, setOpenAudit] = useState(false)

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
      date: "Today, 2:30 PM",
      type: "Cash Submission",
      amount: 275000,
      quantity: null,
      source: "Sarah Williams (DPK1)",
      status: "Verified",
      reference: "CS-2023-0456",
    },
    {
      id: "TRX-1233",
      date: "Today, 12:15 PM",
      type: "Credit Payment",
      amount: 100000,
      quantity: null,
      source: "XYZ Logistics",
      status: "Verified",
      reference: "CP-2023-0123",
    },
    {
      id: "TRX-1232",
      date: "Today, 10:45 AM",
      type: "Direct Tank Sale",
      amount: 840000,
      quantity: 1200,
      source: "Tank 1 (PMS)",
      status: "Pending",
      reference: "Golden Transport",
    },
    {
      id: "TRX-1231",
      date: "Today, 8:20 AM",
      type: "Stock Delivery",
      amount: 3500000,
      quantity: 5000,
      source: "Tank 1 (PMS)",
      status: "Verified",
      reference: "DEL-2023-0078",
    },
    {
      id: "TRX-1230",
      date: "Yesterday, 8:05 PM",
      type: "Cash Submission",
      amount: 348500,
      quantity: null,
      source: "John Doe (PMS1)",
      status: "Disputed",
      reference: "CS-2023-0455",
    },
  ]

  return (
    <DashboardLayout role="auditor">
      <DashboardHeader
        title="Transaction Logs"
        description="Audit and review all financial and operational transactions"
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
          <Dialog open={openAudit} onOpenChange={setOpenAudit}>
            <DialogTrigger asChild>
              <Button>
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
        </div>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="cash">Cash Submissions</TabsTrigger>
              <TabsTrigger value="credit">Credit Payments</TabsTrigger>
              <TabsTrigger value="stock">Stock Movements</TabsTrigger>
              <TabsTrigger value="disputed">Disputed</TabsTrigger>
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
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>Complete record of all financial and operational transactions</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable columns={transactionColumns} data={transactions} searchKey="id" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cash" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Cash Submissions</CardTitle>
                <CardDescription>Record of all cash submissions from workers</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={transactionColumns}
                  data={transactions.filter((t) => t.type === "Cash Submission")}
                  searchKey="id"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credit" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Credit Payments</CardTitle>
                <CardDescription>Record of all credit account payments</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={transactionColumns}
                  data={transactions.filter((t) => t.type === "Credit Payment")}
                  searchKey="id"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Stock Movements</CardTitle>
                <CardDescription>Record of all stock deliveries and direct tank sales</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={transactionColumns}
                  data={transactions.filter((t) => t.type === "Stock Delivery" || t.type === "Direct Tank Sale")}
                  searchKey="id"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disputed" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Disputed Transactions</CardTitle>
                <CardDescription>Transactions with discrepancies or disputes</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={transactionColumns}
                  data={transactions.filter((t) => t.status === "Disputed")}
                  searchKey="id"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 mt-6 md:grid-cols-2">
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
          <Card>
            <CardHeader>
              <CardTitle>Audit Statistics</CardTitle>
              <CardDescription>Summary of audit activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">Total Transactions Audited</span>
                  </div>
                  <span className="font-bold">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">Transactions Verified</span>
                  </div>
                  <span className="font-bold">1,215 (98.5%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">Discrepancies Found</span>
                  </div>
                  <span className="font-bold">19 (1.5%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">Pending Reviews</span>
                  </div>
                  <span className="font-bold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">Average Review Time</span>
                  </div>
                  <span className="font-bold">4.2 minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

