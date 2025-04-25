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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart } from "@/components/charts/area-chart"
import { ArrowRight, DollarSign, Download, Filter, Plus, RefreshCw, Wallet, CheckCircle2, Clock } from "lucide-react"
import { DateRangePicker } from "@/components/date-range-picker"
import { useToast } from "@/hooks/use-toast"

export default function CashierDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [openCashDialog, setOpenCashDialog] = useState(false)
  const [openExpenseDialog, setOpenExpenseDialog] = useState(false)
  const [openHandoverDialog, setOpenHandoverDialog] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([])
  const [verifiedSubmissions, setVerifiedSubmissions] = useState<any[]>([])
  const [verificationAmount, setVerificationAmount] = useState<string>("")
  const [verificationNotes, setVerificationNotes] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch pending cash submissions (unverified)
        const pendingResponse = await fetch('/api/cash-submissions?verified=false');
        const pendingData = await pendingResponse.json();
        
        if (pendingData && pendingData.submissions) {
          setPendingSubmissions(pendingData.submissions);
        }
        
        // Fetch verified cash submissions
        const verifiedResponse = await fetch('/api/cash-submissions?verified=true');
        const verifiedData = await verifiedResponse.json();
        
        if (verifiedData && verifiedData.submissions) {
          setVerifiedSubmissions(verifiedData.submissions);
        }
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

  const handleCashSubmission = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Process cash submission
      // This would be implemented with actual API calls

      toast({
        title: "Cash received",
        description: "Cash submission has been recorded successfully.",
      })

      setOpenCashDialog(false)
    } catch (error) {
      console.error("Error processing cash:", error)
      toast({
        title: "Error",
        description: "Failed to process cash submission. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExpenseSubmission = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Process expense
      // This would be implemented with actual API calls

      toast({
        title: "Expense recorded",
        description: "Expense has been recorded successfully.",
      })

      setOpenExpenseDialog(false)
    } catch (error) {
      console.error("Error recording expense:", error)
      toast({
        title: "Error",
        description: "Failed to record expense. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCashHandover = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Process cash handover
      // This would be implemented with actual API calls

      toast({
        title: "Cash handover recorded",
        description: "Cash handover has been recorded successfully.",
      })

      setOpenHandoverDialog(false)
    } catch (error) {
      console.error("Error recording handover:", error)
      toast({
        title: "Error",
        description: "Failed to record cash handover. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Sample data for charts
  const cashFlowData = [
    { day: "Mon", amount: 25000 },
    { day: "Tue", amount: 32000 },
    { day: "Wed", amount: 28000 },
    { day: "Thu", amount: 35000 },
    { day: "Fri", amount: 40000 },
    { day: "Sat", amount: 45000 },
    { day: "Sun", amount: 38000 },
  ]

  return (
    <DashboardLayout role="cashier">
      <DashboardHeader title="Cashier Dashboard" description="Manage cash submissions, expenses, and daily handovers">
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
          <Dialog open={openCashDialog} onOpenChange={setOpenCashDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Receive Cash
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Receive Cash Submission</DialogTitle>
                <DialogDescription>Record cash received from a worker.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCashSubmission}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="worker" className="text-right">
                      Worker
                    </Label>
                    <select className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="">Select worker</option>
                      <option value="worker1">John Doe</option>
                      <option value="worker2">Jane Smith</option>
                      <option value="worker3">Robert Johnson</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="shift" className="text-right">
                      Shift
                    </Label>
                    <select className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="">Select shift</option>
                      <option value="shift1">Morning Shift (Today)</option>
                      <option value="shift2">Evening Shift (Yesterday)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input id="amount" type="number" placeholder="0.00" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea id="notes" placeholder="Any additional information" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setOpenCashDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Confirm Receipt"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardHeader>

      {/* Cash Verification Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => {
        if (!open) setSelectedSubmission(null);
        if (!open) {
          setVerificationAmount("");
          setVerificationNotes("");
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify Cash Submission</DialogTitle>
            <DialogDescription>Verify the cash amount submitted by the worker.</DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <form onSubmit={async (e) => {
              e.preventDefault();
              
              if (!selectedSubmission) return;
              
              setIsLoading(true);
              try {
                const formData = new FormData();
                formData.append("submissionId", selectedSubmission.id);
                formData.append("verifierId", "current-cashier-id"); // In a real implementation, get from auth
                formData.append("notes", verificationNotes);
                
                // Call the actual verifyCashSubmission server action
                const response = await fetch('/api/cash-submissions/verify', {
                  method: 'POST',
                  body: formData
                });
                
                const result = await response.json();
                
                if (result.error) {
                  throw new Error(result.error);
                }
                
                // Update the local state to reflect the verification
                const updatedPendingSubmissions = pendingSubmissions.filter(
                  (submission) => submission.id !== selectedSubmission.id
                );
                setPendingSubmissions(updatedPendingSubmissions);
                
                const verifiedSubmission = {
                  ...selectedSubmission,
                  verified: true,
                  verifiedBy: "current-cashier-id",
                  notes: verificationNotes
                };
                
                setVerifiedSubmissions([verifiedSubmission, ...verifiedSubmissions]);
                
                toast({
                  title: "Cash Verified",
                  description: `Submission of ₦${selectedSubmission.amount.toLocaleString()} from ${selectedSubmission.user.name} has been verified.`,
                });
                
                setSelectedSubmission(null);
                setVerificationAmount("");
                setVerificationNotes("");
              } catch (error) {
                console.error("Error verifying submission:", error);
                toast({
                  title: "Error",
                  description: "Failed to verify cash submission. Please try again.",
                  variant: "destructive",
                });
              } finally {
                setIsLoading(false);
              }
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="worker-name" className="text-right">
                    Worker
                  </Label>
                  <Input 
                    id="worker-name" 
                    value={selectedSubmission.user.name} 
                    className="col-span-3" 
                    readOnly 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="submission-time" className="text-right">
                    Submitted
                  </Label>
                  <Input 
                    id="submission-time" 
                    value={new Date(selectedSubmission.createdAt).toLocaleString()} 
                    className="col-span-3" 
                    readOnly 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="claimed-amount" className="text-right">
                    Claimed
                  </Label>
                  <Input 
                    id="claimed-amount" 
                    value={`₦${selectedSubmission.amount.toLocaleString()}`} 
                    className="col-span-3" 
                    readOnly 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="verification-amount" className="text-right font-bold">
                    Actual
                  </Label>
                  <Input
                    id="verification-amount"
                    type="number"
                    placeholder={selectedSubmission.amount.toString()}
                    className="col-span-3"
                    value={verificationAmount}
                    onChange={(e) => setVerificationAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="verification-notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="verification-notes"
                    placeholder="Any discrepancies or additional information"
                    className="col-span-3"
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setSelectedSubmission(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !verificationAmount}>
                  {isLoading ? "Verifying..." : "Verify Submission"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cash Today</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦152,500.00</div>
              <p className="text-xs text-muted-foreground">+15.2% from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">5 payments, 2 expenses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Expenses</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦12,350.00</div>
              <p className="text-xs text-muted-foreground">4 transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦140,150.00</div>
              <p className="text-xs text-muted-foreground">After expenses</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="cash">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="cash">Cash Submissions</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="handovers">Cash Handovers</TabsTrigger>
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

            <TabsContent value="cash" className="space-y-4">
              {/* Pending Cash Submissions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Pending Cash Submissions</CardTitle>
                    <CardDescription>Unverified cash submissions from workers</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {pendingSubmissions.length > 0 ? (
                    <div className="space-y-4">
                      {pendingSubmissions.map((submission) => (
                        <div key={submission.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                          <div>
                            <div className="font-medium">{submission.user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {submission.id} • {new Date(submission.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">₦{submission.amount.toLocaleString()}</div>
                            {submission.notes && (
                              <div className="text-xs text-muted-foreground">{submission.notes}</div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              Pending
                            </div>
                          </div>
                          <div className="ml-4">
                            <Button 
                              size="sm" 
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setVerificationAmount(submission.amount.toString());
                              }}
                            >
                              Verify
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-muted-foreground">
                      No pending cash submissions
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Verified Cash Submissions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Recent Verified Submissions</CardTitle>
                    <CardDescription>Verified cash submissions from workers</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {verifiedSubmissions.length > 0 ? (
                    <div className="space-y-4">
                      {verifiedSubmissions.map((submission) => (
                        <div key={submission.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                          <div>
                            <div className="font-medium">{submission.user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {submission.id} • {new Date(submission.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">₦{submission.amount.toLocaleString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 flex items-center">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Verified
                            </div>
                          </div>
                          <div className="ml-4">
                            <Button size="sm" variant="outline">
                              Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-muted-foreground">
                      No verified cash submissions yet
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow</CardTitle>
                  <CardDescription>Daily cash submissions over the past week</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <AreaChart data={cashFlowData} index="day" categories={["amount"]} colors={["blue"]} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Recent Expenses</CardTitle>
                    <CardDescription>Daily operational expenses</CardDescription>
                  </div>
                  <Dialog open={openExpenseDialog} onOpenChange={setOpenExpenseDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Record Expense
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Record Expense</DialogTitle>
                        <DialogDescription>Enter the expense details below.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleExpenseSubmission}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                              Category
                            </Label>
                            <select className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                              <option value="">Select category</option>
                              <option value="utilities">Utilities</option>
                              <option value="maintenance">Maintenance</option>
                              <option value="supplies">Supplies</option>
                              <option value="salaries">Salaries</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="expense-amount" className="text-right">
                              Amount
                            </Label>
                            <Input id="expense-amount" type="number" placeholder="0.00" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                              Description
                            </Label>
                            <Textarea id="description" placeholder="Expense details" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="receipt" className="text-right">
                              Receipt
                            </Label>
                            <Input id="receipt" type="file" className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" type="button" onClick={() => setOpenExpenseDialog(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Expense"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: "EXP123",
                        category: "Utilities",
                        date: "Today, 11:30 AM",
                        amount: "₦5,400",
                        status: "Approved",
                      },
                      {
                        id: "EXP122",
                        category: "Maintenance",
                        date: "Today, 10:15 AM",
                        amount: "₦3,200",
                        status: "Pending",
                      },
                      {
                        id: "EXP121",
                        category: "Supplies",
                        date: "Yesterday, 3:45 PM",
                        amount: "₦2,800",
                        status: "Approved",
                      },
                      {
                        id: "EXP120",
                        category: "Other",
                        date: "Yesterday, 2:30 PM",
                        amount: "₦950",
                        status: "Approved",
                      },
                      {
                        id: "EXP119",
                        category: "Maintenance",
                        date: "2 days ago, 4:15 PM",
                        amount: "₦4,700",
                        status: "Approved",
                      },
                    ].map((expense, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <div className="font-medium">{expense.category}</div>
                          <div className="text-sm text-muted-foreground">{expense.id} • {expense.date}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{expense.amount}</div>
                        </div>
                        <div className="text-right">
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            expense.status === "Approved" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {expense.status}
                          </div>
                        </div>
                        <div className="ml-4">
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

            <TabsContent value="handovers" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Cash Handovers</CardTitle>
                    <CardDescription>End-of-day cash handovers to management</CardDescription>
                  </div>
                  <Dialog open={openHandoverDialog} onOpenChange={setOpenHandoverDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        New Handover
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Cash Handover</DialogTitle>
                        <DialogDescription>Record end-of-day cash handover to management.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCashHandover}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="total-cash" className="text-right">
                              Total Cash
                            </Label>
                            <Input id="total-cash" type="number" placeholder="0.00" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="total-expenses" className="text-right">
                              Total Expenses
                            </Label>
                            <Input id="total-expenses" type="number" placeholder="0.00" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="net-cash" className="text-right">
                              Net Cash
                            </Label>
                            <Input id="net-cash" type="number" placeholder="0.00" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="manager" className="text-right">
                              Manager
                            </Label>
                            <select className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                              <option value="">Select manager</option>
                              <option value="manager1">David Wilson</option>
                              <option value="manager2">Emily Davis</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="handover-notes" className="text-right">
                              Notes
                            </Label>
                            <Textarea id="handover-notes" placeholder="Any additional information" className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" type="button" onClick={() => setOpenHandoverDialog(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Processing..." : "Complete Handover"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: "HO123",
                        date: "Yesterday",
                        amount: "₦140,500",
                        manager: "David Wilson",
                        status: "Verified",
                      },
                      {
                        id: "HO122",
                        date: "2 days ago",
                        amount: "₦132,700",
                        manager: "Emily Davis",
                        status: "Verified",
                      },
                      {
                        id: "HO121",
                        date: "3 days ago",
                        amount: "₦145,300",
                        manager: "David Wilson",
                        status: "Verified",
                      },
                      {
                        id: "HO120",
                        date: "4 days ago",
                        amount: "₦138,800",
                        manager: "Emily Davis",
                        status: "Verified",
                      },
                      {
                        id: "HO119",
                        date: "5 days ago",
                        amount: "₦141,500",
                        manager: "David Wilson",
                        status: "Verified",
                      },
                    ].map((handover, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <div className="font-medium">{handover.date}</div>
                          <div className="text-sm text-muted-foreground">{handover.id} • To: {handover.manager}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{handover.amount}</div>
                        </div>
                        <div className="text-right">
                          <div className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {handover.status}
                          </div>
                        </div>
                        <div className="ml-4">
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
          </Tabs>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for cashiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Button className="justify-start" onClick={() => setOpenCashDialog(true)}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Receive Cash
                </Button>
                <Button className="justify-start" onClick={() => setOpenExpenseDialog(true)}>
                  <Wallet className="mr-2 h-4 w-4" />
                  Record Expense
                </Button>
                <Button className="justify-start" onClick={() => setOpenHandoverDialog(true)}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Cash Handover
                </Button>
                <Button className="justify-start" variant="outline" onClick={() => window.location.href = "/cashier/reports"}>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Daily Checklist</CardTitle>
              <CardDescription>Tasks to complete during your shift</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">Verify cash submissions</div>
                    <div className="text-sm text-muted-foreground">Confirm cash amounts from workers</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">Record daily expenses</div>
                    <div className="text-sm text-muted-foreground">Document all operational expenses</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-muted"></div>
                  <div>
                    <div className="font-medium">Reconcile cash balance</div>
                    <div className="text-sm text-muted-foreground">Ensure cash on hand matches records</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-muted"></div>
                  <div>
                    <div className="font-medium">Complete cash handover</div>
                    <div className="text-sm text-muted-foreground">Hand over cash to management at end of day</div>
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

