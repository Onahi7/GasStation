"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { AreaChart } from "@/components/charts/area-chart"
import {
  AlertCircle,
  ArrowRight,
  CreditCard,
  DollarSign,
  FuelIcon as GasPump,
  Play,
  Plus,
  RefreshCw,
  Square,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WorkerDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [openShiftDialog, setOpenShiftDialog] = useState(false)
  const [openEndShiftDialog, setOpenEndShiftDialog] = useState(false)
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false)
  const [currentShift, setCurrentShift] = useState<any>(null)
  const [shiftDuration, setShiftDuration] = useState<string>("00:00:00")
  const [shiftNotes, setShiftNotes] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch current shift
        // This would be implemented with actual API calls

        // Mock data for demonstration
        setCurrentShift({
          id: "shift123",
          start_time: new Date(new Date().getTime() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
          status: "active",
        })
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

    // Update shift duration every second if there's an active shift
    const intervalId = setInterval(() => {
      if (currentShift && currentShift.status === "active") {
        const startTime = new Date(currentShift.start_time).getTime()
        const now = new Date().getTime()
        const diff = now - startTime

        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setShiftDuration(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        )
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [currentShift, toast])

  const handleStartShift = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Start shift
      // This would be implemented with actual API calls

      toast({
        title: "Shift started",
        description: "Your shift has been started successfully.",
      })

      setOpenShiftDialog(false)

      // Mock data for demonstration
      setCurrentShift({
        id: "shift123",
        start_time: new Date().toISOString(),
        status: "active",
      })
    } catch (error) {
      console.error("Error starting shift:", error)
      toast({
        title: "Error",
        description: "Failed to start shift. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEndShift = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // End shift
      // This would be implemented with actual API calls

      toast({
        title: "Shift ended",
        description: "Your shift has been ended successfully.",
      })

      setOpenEndShiftDialog(false)
      setCurrentShift(null)
    } catch (error) {
      console.error("Error ending shift:", error)
      toast({
        title: "Error",
        description: "Failed to end shift. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Sample data for charts
  const salesData = [
    { day: "Mon", sales: 1200 },
    { day: "Tue", sales: 1500 },
    { day: "Wed", sales: 1800 },
    { day: "Thu", sales: 1600 },
    { day: "Fri", sales: 2000 },
    { day: "Sat", sales: 2400 },
    { day: "Sun", sales: 2100 },
  ]

  return (
    <DashboardLayout role="worker">
      <DashboardHeader title="Worker Dashboard" description="Monitor your shift and record transactions">
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
          {currentShift ? (
            <Dialog open={openEndShiftDialog} onOpenChange={setOpenEndShiftDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Square className="mr-2 h-4 w-4" />
                  End Shift
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>End Shift</DialogTitle>
                  <DialogDescription>Are you sure you want to end your current shift?</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEndShift}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="shift-duration" className="text-right">
                        Duration
                      </Label>
                      <Input id="shift-duration" value={shiftDuration} className="col-span-3" readOnly />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="shift-notes" className="text-right">
                        Notes
                      </Label>
                      <Textarea
                        id="shift-notes"
                        placeholder="Any additional information"
                        className="col-span-3"
                        value={shiftNotes}
                        onChange={(e) => setShiftNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setOpenEndShiftDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Ending..." : "End Shift"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={openShiftDialog} onOpenChange={setOpenShiftDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Play className="mr-2 h-4 w-4" />
                  Start Shift
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Start Shift</DialogTitle>
                  <DialogDescription>Start your shift to begin recording transactions.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleStartShift}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="shift-notes" className="text-right">
                        Notes
                      </Label>
                      <Textarea
                        id="shift-notes"
                        placeholder="Any additional information"
                        className="col-span-3"
                        value={shiftNotes}
                        onChange={(e) => setShiftNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setOpenShiftDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Starting..." : "Start Shift"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        {currentShift ? (
          <div className="mb-6 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold">Current Shift</h2>
                <p className="text-sm text-muted-foreground">
                  Started at {new Date(currentShift.start_time).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Active</span>
                </div>
                <div className="text-lg font-mono">{shiftDuration}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-lg border bg-amber-50 p-4 text-amber-800 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h2 className="font-semibold">No Active Shift</h2>
                <p className="text-sm">You need to start a shift to record transactions.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales Today</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fuel Volume Sold</CardTitle>
              <GasPump className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">64.7 L</div>
              <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Electronic Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦12,234.00</div>
              <p className="text-xs text-muted-foreground">4 transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shift Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentShift ? shiftDuration : "00:00:00"}</div>
              <p className="text-xs text-muted-foreground">{currentShift ? "Active shift" : "No active shift"}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Daily sales for the past week</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <AreaChart data={salesData} xKey="day" yKey="sales" />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest payment records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "TX123",
                    time: "10:30 AM",
                    amount: "₦5,400",
                    method: "Cash",
                    status: "Completed",
                  },
                  {
                    id: "TX122",
                    time: "10:15 AM",
                    amount: "₦3,200",
                    method: "POS",
                    status: "Pending",
                  },
                  {
                    id: "TX121",
                    time: "9:45 AM",
                    amount: "₦7,800",
                    method: "Bank Transfer",
                    status: "Completed",
                  },
                  {
                    id: "TX120",
                    time: "9:30 AM",
                    amount: "₦2,500",
                    method: "Cash",
                    status: "Completed",
                  },
                  {
                    id: "TX119",
                    time: "9:15 AM",
                    amount: "₦4,700",
                    method: "Mobile Money",
                    status: "Pending",
                  },
                ].map((transaction, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`rounded-full p-2 ${
                          transaction.method === "Cash"
                            ? "bg-green-100"
                            : transaction.method === "POS"
                              ? "bg-blue-100"
                              : transaction.method === "Bank Transfer"
                                ? "bg-purple-100"
                                : "bg-orange-100"
                        }`}
                      >
                        {transaction.method === "Cash" ? (
                          <DollarSign className="h-4 w-4 text-green-600" />
                        ) : transaction.method === "POS" ? (
                          <CreditCard className="h-4 w-4 text-blue-600" />
                        ) : transaction.method === "Bank Transfer" ? (
                          <ArrowRight className="h-4 w-4 text-purple-600" />
                        ) : (
                          <CreditCard className="h-4 w-4 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.id}</div>
                        <div className="text-sm text-muted-foreground">{transaction.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{transaction.amount}</div>
                      <div
                        className={`text-xs ${
                          transaction.status === "Completed" ? "text-green-600" : "text-amber-600"
                        }`}
                      >
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Dialog open={openPaymentDialog} onOpenChange={setOpenPaymentDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full" disabled={!currentShift}>
                      <Plus className="mr-2 h-4 w-4" />
                      Record Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Record Payment</DialogTitle>
                      <DialogDescription>Enter the payment details below.</DialogDescription>
                    </DialogHeader>
                    <form>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="payment-method" className="text-right">
                            Method
                          </Label>
                          <select className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="cash">Cash</option>
                            <option value="pos">POS</option>
                            <option value="transfer">Bank Transfer</option>
                            <option value="mobile">Mobile Money</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            Amount
                          </Label>
                          <Input id="amount" type="number" placeholder="0.00" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="reference" className="text-right">
                            Reference
                          </Label>
                          <Input id="reference" placeholder="Transaction reference" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="customer" className="text-right">
                            Customer
                          </Label>
                          <Input id="customer" placeholder="Customer name (optional)" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setOpenPaymentDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save Payment</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for your shift</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Button className="justify-start" onClick={() => (window.location.href = "/worker/readings")}>
                  <GasPump className="mr-2 h-4 w-4" />
                  Record Meter Reading
                </Button>
                <Button className="justify-start" onClick={() => setOpenPaymentDialog(true)} disabled={!currentShift}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Record Payment
                </Button>
                <Button
                  className="justify-start"
                  variant="outline"
                  onClick={() => (window.location.href = "/worker/shifts")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  View Shift History
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Shift Checklist</CardTitle>
              <CardDescription>Tasks to complete during your shift</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">Record opening meter readings</div>
                    <div className="text-sm text-muted-foreground">Take readings at the start of your shift</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-muted"></div>
                  <div>
                    <div className="font-medium">Submit cash collections</div>
                    <div className="text-sm text-muted-foreground">Submit cash to the cashier periodically</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-muted"></div>
                  <div>
                    <div className="font-medium">Record closing meter readings</div>
                    <div className="text-sm text-muted-foreground">Take readings at the end of your shift</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-muted"></div>
                  <div>
                    <div className="font-medium">End shift</div>
                    <div className="text-sm text-muted-foreground">Complete your shift and submit final report</div>
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

