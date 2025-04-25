"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TankMonitoringSystem } from "@/components/tank-monitoring-system"
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
  const [openCashSubmissionDialog, setOpenCashSubmissionDialog] = useState(false)
  const [currentShift, setCurrentShift] = useState<any>(null)
  const [shiftDuration, setShiftDuration] = useState<string>("00:00:00")
  const [shiftNotes, setShiftNotes] = useState<string>("")
  const [submissionAmount, setSubmissionAmount] = useState<string>("")
  const [submissionNotes, setSubmissionNotes] = useState<string>("")
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch the user's current active shift
        const response = await fetch('/api/shifts/active');
        const data = await response.json();
        
        if (data && data.shift) {
          setCurrentShift(data.shift);
          
          // Also fetch recent cash submissions for this shift
          const submissionsResponse = await fetch(`/api/cash-submissions?shiftId=${data.shift.id}`);
          const submissionsData = await submissionsResponse.json();
          
          if (submissionsData && submissionsData.submissions) {
            setRecentSubmissions(submissionsData.submissions);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load shift data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Update shift duration every second if there's an active shift
    const intervalId = setInterval(() => {
      if (currentShift) {
        const startTime = new Date(currentShift.startTime).getTime()
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
      const formData = new FormData()
      formData.append("userId", "current-user-id") // In a real implementation, get from auth context
      formData.append("terminalId", "terminal-id") // In a real implementation, get from user context or selection
      formData.append("notes", shiftNotes)

      // Call the actual startShift server action
      const response = await fetch('/api/shifts/start', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Shift started",
        description: "Your shift has been started successfully.",
      })

      setOpenShiftDialog(false)
      setCurrentShift(data.shift)
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
      const formData = new FormData()
      formData.append("shiftId", currentShift.id)
      formData.append("userId", currentShift.userId)
      formData.append("notes", shiftNotes)

      // Call the actual endShift server action
      const response = await fetch('/api/shifts/end', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Shift ended",
        description: "Your shift has been ended successfully.",
      })

      setOpenEndShiftDialog(false)
      setCurrentShift(null)
      setRecentSubmissions([])
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
            <CardContent>
              <AreaChart data={salesData} index="day" categories={["sales"]} colors={["blue"]} />
            </CardContent>
          </Card>
        </div>

        {/* Tank Monitoring System for Workers */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tank Monitoring</CardTitle>
              <CardDescription>Real-time tank level monitoring and status</CardDescription>
            </CardHeader>
            <CardContent>
              <TankMonitoringSystem />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => setOpenPaymentDialog(true)}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Record Payment</CardTitle>
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Record electronic payments or card transactions.</p>
              </CardContent>
            </Card>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => setOpenCashSubmissionDialog(true)}
              disabled={!currentShift}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Submit Cash</CardTitle>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Submit collected cash to the cashier.</p>
              </CardContent>
            </Card>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => (window.location.href = "/worker/readings")}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Record Meter Reading</CardTitle>
                <GasPump className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Record the meter readings for the tanks.</p>
              </CardContent>
            </Card>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => (window.location.href = "/worker/shifts")}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">View Shift History</CardTitle>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Check your past shift records and details.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
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

      {/* Cash Submission Dialog */}
      <Dialog open={openCashSubmissionDialog} onOpenChange={setOpenCashSubmissionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Submit Cash</DialogTitle>
            <DialogDescription>Submit cash collected during your shift to the cashier.</DialogDescription>
          </DialogHeader>            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!currentShift) return;
              
              setIsLoading(true);
              try {
                const formData = new FormData();
                formData.append("userId", currentShift.userId);
                formData.append("shiftId", currentShift.id);
                formData.append("amount", submissionAmount);
                formData.append("notes", submissionNotes);
                
                // Call the actual submitCash server action
                const result = await fetch('/api/cash-submissions', {
                  method: 'POST',
                  body: formData
                });
                
                const submission = await result.json();
                
                if (submission.error) {
                  throw new Error(submission.error);
                }
                
                // Add the new submission to the recent submissions list
                setRecentSubmissions([submission, ...recentSubmissions]);
                
                toast({
                  title: "Cash Submitted",
                  description: `₦${submissionAmount} has been recorded for submission.`,
                });
                
                // Reset form
                setSubmissionAmount("");
                setSubmissionNotes("");
                setOpenCashSubmissionDialog(false);
              } catch (error) {
                console.error("Error submitting cash:", error);
                toast({
                  title: "Error",
                  description: "Failed to submit cash. Please try again.",
                  variant: "destructive",
                });
              } finally {
                setIsLoading(false);
              }
            }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="submission-amount" className="text-right">
                  Amount (₦)
                </Label>
                <Input
                  id="submission-amount"
                  type="number"
                  placeholder="0.00"
                  className="col-span-3"
                  value={submissionAmount}
                  onChange={(e) => setSubmissionAmount(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="submission-notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="submission-notes"
                  placeholder="Any additional information"
                  className="col-span-3"
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setOpenCashSubmissionDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !submissionAmount}>
                {isLoading ? "Submitting..." : "Submit Cash"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Recent Submissions Section */}
      {currentShift && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Cash Submissions</CardTitle>
              <CardDescription>Cash submitted during your current shift</CardDescription>
            </CardHeader>
            <CardContent>
              {recentSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {recentSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">₦{submission.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(submission.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {submission.verified ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle2 className="mr-1 h-4 w-4" />
                            <span>Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600">
                            <Clock className="mr-1 h-4 w-4" />
                            <span>Pending</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No cash submissions for this shift yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}

