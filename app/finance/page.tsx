"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart } from "@/components/charts/area-chart"
import {
  ArrowUp,
  CreditCard,
  DollarSign,
  Download,
  Filter,
  RefreshCw,
  Wallet,
  CheckCircle2,
  XCircle,
  BarChart3,
} from "lucide-react"
import { DateRangePicker } from "@/components/date-range-picker"
import { useToast } from "@/hooks/use-toast"

export default function FinanceDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch data
        // This would be implemented with actual API calls
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleApprovePayment = async (id: string) => {
    setIsLoading(true)

    try {
      // Approve payment
      // This would be implemented with actual API calls

      toast({
        title: "Payment approved",
        description: "The payment has been approved successfully.",
      })
    } catch (error) {
      console.error("Error approving payment:", error)
      toast({
        title: "Error",
        description: "Failed to approve payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectPayment = async (id: string) => {
    setIsLoading(true)

    try {
      // Reject payment
      // This would be implemented with actual API calls

      toast({
        title: "Payment rejected",
        description: "The payment has been rejected.",
      })
    } catch (error) {
      console.error("Error rejecting payment:", error)
      toast({
        title: "Error",
        description: "Failed to reject payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveExpense = async (id: string) => {
    setIsLoading(true)

    try {
      // Approve expense
      // This would be implemented with actual API calls

      toast({
        title: "Expense approved",
        description: "The expense has been approved successfully.",
      })
    } catch (error) {
      console.error("Error approving expense:", error)
      toast({
        title: "Error",
        description: "Failed to approve expense. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectExpense = async (id: string) => {
    setIsLoading(true)

    try {
      // Reject expense
      // This would be implemented with actual API calls

      toast({
        title: "Expense rejected",
        description: "The expense has been rejected.",
      })
    } catch (error) {
      console.error("Error rejecting expense:", error)
      toast({
        title: "Error",
        description: "Failed to reject expense. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Sample data for charts
  const revenueData = [
    { month: "Jan", revenue: 450000 },
    { month: "Feb", revenue: 520000 },
    { month: "Mar", revenue: 480000 },
    { month: "Apr", revenue: 560000 },
    { month: "May", revenue: 590000 },
    { month: "Jun", revenue: 620000 },
    { month: "Jul", revenue: 600000 },
  ]

  return (
    <DashboardLayout role="finance">
      <DashboardHeader title="Finance Dashboard" description="Manage payments, expenses, and financial reports">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => {}} disabled={isLoading} variant="outline">
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
          <Button onClick={() => (window.location.href = "/finance/reports")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Reports
          </Button>
        </div>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue (MTD)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦4,250,500.00</div>
              <div className="flex items-center text-xs text-green-500">
                <ArrowUp className="mr-1 h-4 w-4" />
                <span>12.5% from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses (MTD)</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦850,350.00</div>
              <div className="flex items-center text-xs text-red-500">
                <ArrowUp className="mr-1 h-4 w-4" />
                <span>8.2% from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">8 payments, 4 expenses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit (MTD)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦3,400,150.00</div>
              <div className="flex items-center text-xs text-green-500">
                <ArrowUp className="mr-1 h-4 w-4" />
                <span>15.3% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="payments">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="payments">Pending Payments</TabsTrigger>
                <TabsTrigger value="expenses">Pending Expenses</TabsTrigger>
                <TabsTrigger value="overview">Financial Overview</TabsTrigger>
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

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Electronic Payments</CardTitle>
                  <CardDescription>Payments requiring approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: "TX123",
                        worker: "John Doe",
                        time: "Today, 10:15 AM",
                        amount: "₦3,200",
                        method: "POS",
                        reference: "POS123456",
                      },
                      {
                        id: "TX121",
                        worker: "Jane Smith",
                        time: "Today, 9:45 AM",
                        amount: "₦7,800",
                        method: "Bank Transfer",
                        reference: "TRF987654",
                      },
                      {
                        id: "TX119",
                        worker: "Robert Johnson",
                        time: "Today, 9:15 AM",
                        amount: "₦4,700",
                        method: "Mobile Money",
                        reference: "MM456789",
                      },
                      {
                        id: "TX118",
                        worker: "Sarah Williams",
                        time: "Yesterday, 4:30 PM",
                        amount: "₦5,500",
                        method: "POS",
                        reference: "POS789012",
                      },
                      {
                        id: "TX117",
                        worker: "Michael Brown",
                        time: "Yesterday, 3:45 PM",
                        amount: "₦6,200",
                        method: "Bank Transfer",
                        reference: "TRF345678",
                      },
                    ].map((payment, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <div className="font-medium">{payment.worker}</div>
                          <div className="text-sm text-muted-foreground">
                            {payment.id} • {payment.time}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {payment.method} • Ref: {payment.reference}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{payment.amount}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleApprovePayment(payment.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleRejectPayment(payment.id)}
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Reject</span>
                          </Button>
                          <Button size="sm" variant="outline">
                            Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Expenses</CardTitle>
                  <CardDescription>Expenses requiring approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: "EXP122",
                        cashier: "Alice Johnson",
                        category: "Maintenance",
                        date: "Today, 10:15 AM",
                        amount: "₦3,200",
                        description: "Pump repair",
                      },
                      {
                        id: "EXP120",
                        cashier: "Bob Smith",
                        category: "Utilities",
                        date: "Today, 9:30 AM",
                        amount: "₦5,800",
                        description: "Electricity bill",
                      },
                      {
                        id: "EXP118",
                        cashier: "Carol Davis",
                        category: "Supplies",
                        date: "Yesterday, 4:45 PM",
                        amount: "₦2,500",
                        description: "Office supplies",
                      },
                      {
                        id: "EXP117",
                        cashier: "David Wilson",
                        category: "Other",
                        date: "Yesterday, 3:30 PM",
                        amount: "₦1,200",
                        description: "Cleaning services",
                      },
                    ].map((expense, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <div className="font-medium">{expense.category}</div>
                          <div className="text-sm text-muted-foreground">
                            {expense.id} • {expense.date}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            By: {expense.cashier} • {expense.description}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{expense.amount}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleApproveExpense(expense.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleRejectExpense(expense.id)}
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Reject</span>
                          </Button>
                          <Button size="sm" variant="outline">
                            Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue for the current year</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <AreaChart data={revenueData} xKey="month" yKey="revenue" />
                </CardContent>
              </Card>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>Revenue by payment method</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { method: "Cash", amount: "₦2,850,300", percentage: 67 },
                        { method: "POS", amount: "₦950,200", percentage: 22 },
                        { method: "Bank Transfer", amount: "₦320,000", percentage: 8 },
                        { method: "Mobile Money", amount: "₦130,000", percentage: 3 },
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{item.method}</div>
                            <div className="font-medium">{item.amount}</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-primary" style={{ width: `${item.percentage}%` }}></div>
                          </div>
                          <div className="text-xs text-right text-muted-foreground">{item.percentage}%</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>Expenses by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { category: "Utilities", amount: "₦320,500", percentage: 38 },
                        { category: "Maintenance", amount: "₦250,800", percentage: 29 },
                        { category: "Salaries", amount: "₦180,000", percentage: 21 },
                        { category: "Supplies", amount: "₦65,000", percentage: 8 },
                        { category: "Other", amount: "₦34,050", percentage: 4 },
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{item.category}</div>
                            <div className="font-medium">{item.amount}</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-primary" style={{ width: `${item.percentage}%` }}></div>
                          </div>
                          <div className="text-xs text-right text-muted-foreground">{item.percentage}%</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}

