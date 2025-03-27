"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { getDrivers, getTrucks } from "@/app/actions/deliveries"
import { getUserRole } from "@/app/actions/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Truck, 
  User, 
  Wallet,
  Plus,
  RefreshCw
} from "lucide-react"

export default function DriversPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [openAddSalary, setOpenAddSalary] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<any>(null)
  const { toast } = useToast()

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const user = await getUserRole()
      if (!user?.companyId) throw new Error("No company ID found")
      
      await Promise.all([
        getDrivers(user.companyId),
        getTrucks(user.companyId)
      ])
      
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

  const handleAddSalary = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      // Will be implemented
      toast({
        title: "Success",
        description: "Salary has been set successfully",
      })
      setOpenAddSalary(false)
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
        title="Driver Management" 
        description="Manage drivers, salaries, and performance"
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Driver
          </Button>
        </div>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="drivers">
          <TabsList>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="trucks">Trucks</TabsTrigger>
          </TabsList>

          <TabsContent value="drivers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Drivers</CardTitle>
                <CardDescription>View and manage driver details and salaries</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Base Salary</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>John Driver {i + 1}</TableCell>
                        <TableCell>driver{i + 1}@example.com</TableCell>
                        <TableCell>₦150,000</TableCell>
                        <TableCell>Good</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedDriver({ id: i + 1, name: `John Driver ${i + 1}` })
                              setOpenAddSalary(true)
                            }}
                          >
                            <Wallet className="mr-2 h-4 w-4" />
                            Set Salary
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trucks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Trucks</CardTitle>
                <CardDescription>View and manage company trucks</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Registration</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Service</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>ABC-123-XY{i}</TableCell>
                        <TableCell>33,000 L</TableCell>
                        <TableCell>Operational</TableCell>
                        <TableCell>2 weeks ago</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Truck className="mr-2 h-4 w-4" />
                            View Details
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

        {/* Set Salary Dialog */}
        <Dialog open={openAddSalary} onOpenChange={setOpenAddSalary}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Driver Salary</DialogTitle>
              <DialogDescription>
                Set base salary for {selectedDriver?.name}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSalary}>
              <div className="grid gap-4 py-4">
                <input type="hidden" name="employee_id" value={selectedDriver?.id} />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="base_salary" className="text-right">Base Salary</Label>
                  <Input
                    id="base_salary"
                    name="base_salary"
                    type="number"
                    className="col-span-3"
                    placeholder="150000"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="effective_date" className="text-right">Effective Date</Label>
                  <Input
                    id="effective_date"
                    name="effective_date"
                    type="date"
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenAddSalary(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}