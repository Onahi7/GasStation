"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { setEmployeeSalary, addSalaryAdjustment, getEmployeeSalaryDetails } from "@/app/actions/salaries"
import { 
  Wallet, 
  RefreshCw,
  AlertTriangle,
  Plus,
  ArrowUp,
  ArrowDown
} from "lucide-react"

export default function EmployeesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [openAdjustment, setOpenAdjustment] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const { toast } = useToast()

  const handleAdjustment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      await addSalaryAdjustment(formData)
      
      toast({
        title: "Success",
        description: "Salary adjustment has been recorded",
      })
      setOpenAdjustment(false)
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

  return (
    <DashboardLayout role="manager">
      <DashboardHeader 
        title="Employee Management" 
        description="Manage employee salaries and performance"
      >
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
        </div>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="workers">
          <TabsList>
            <TabsTrigger value="workers">Workers</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
          </TabsList>

          <TabsContent value="workers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pump Workers</CardTitle>
                <CardDescription>Manage pump worker salaries and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Base Salary</TableHead>
                      <TableHead>MTD Adjustments</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>John Smith {i + 1}</TableCell>
                        <TableCell>₦120,000</TableCell>
                        <TableCell className="text-green-600">+₦5,000</TableCell>
                        <TableCell>₦125,000</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            Good
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedEmployee({ 
                                id: i + 1, 
                                name: `John Smith ${i + 1}`,
                                role: 'worker'
                              })
                              setOpenAdjustment(true)
                            }}
                          >
                            <Wallet className="mr-2 h-4 w-4" />
                            Adjust Salary
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drivers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Drivers</CardTitle>
                <CardDescription>Manage driver salaries and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Base Salary</TableHead>
                      <TableHead>MTD Adjustments</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>John Driver {i + 1}</TableCell>
                        <TableCell>₦150,000</TableCell>
                        <TableCell className="text-red-600">-₦2,000</TableCell>
                        <TableCell>₦148,000</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                            Average
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedEmployee({ 
                                id: i + 1, 
                                name: `John Driver ${i + 1}`,
                                role: 'driver'
                              })
                              setOpenAdjustment(true)
                            }}
                          >
                            <Wallet className="mr-2 h-4 w-4" />
                            Adjust Salary
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Salary Adjustment Dialog */}
        <Dialog open={openAdjustment} onOpenChange={setOpenAdjustment}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Salary Adjustment</DialogTitle>
              <DialogDescription>
                Add adjustment for {selectedEmployee?.name}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdjustment}>
              <div className="grid gap-4 py-4">
                <input type="hidden" name="employee_id" value={selectedEmployee?.id} />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="adjustment_type" className="text-right">Type</Label>
                  <Select name="adjustment_type" required>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shortage">Shortage</SelectItem>
                      <SelectItem value="excess">Excess</SelectItem>
                      <SelectItem value="bonus">Bonus</SelectItem>
                      <SelectItem value="deduction">Deduction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    className="col-span-3"
                    placeholder="5000"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reason" className="text-right">Reason</Label>
                  <Input
                    id="reason"
                    name="reason"
                    className="col-span-3"
                    placeholder="Reason for adjustment"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenAdjustment(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Adjustment"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Monthly Salary Summary */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Month-to-Date Summary</CardTitle>
              <CardDescription>Total salary and adjustments for March 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Total Base Salaries</div>
                    <div className="text-2xl font-bold">₦1,350,000</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Total Adjustments</div>
                    <div className="text-2xl font-bold text-green-600">+₦15,000</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Net Payroll</div>
                    <div className="text-2xl font-bold">₦1,365,000</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Recent Adjustments</div>
                  <div className="space-y-2">
                    {[
                      { 
                        employee: "John Smith 1",
                        type: "excess",
                        amount: 5000,
                        date: "2025-03-26",
                        reason: "Extra shift coverage"
                      },
                      {
                        employee: "John Driver 2",
                        type: "shortage",
                        amount: 2000,
                        date: "2025-03-26",
                        reason: "Product shortage in delivery"
                      }
                    ].map((adjustment, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-start gap-2">
                          {adjustment.type === "excess" || adjustment.type === "bonus" ? (
                            <ArrowUp className="mt-1 h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDown className="mt-1 h-4 w-4 text-red-500" />
                          )}
                          <div>
                            <div className="font-medium">{adjustment.employee}</div>
                            <div className="text-sm text-muted-foreground">{adjustment.reason}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${
                            adjustment.type === "excess" || adjustment.type === "bonus" 
                              ? "text-green-600" 
                              : "text-red-600"
                          }`}>
                            {adjustment.type === "excess" || adjustment.type === "bonus" ? "+" : "-"}
                            ₦{adjustment.amount}
                          </div>
                          <div className="text-sm text-muted-foreground">{adjustment.date}</div>
                        </div>
                      </div>
                    ))}
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