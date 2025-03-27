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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { getDeliveryWaybills, createDeliveryWaybill, updateDeliveryStatus } from "@/app/actions/deliveries"
import { getUserRole } from "@/app/actions/auth"
import { 
  FileText, 
  Truck, 
  Upload,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react"

export default function DeliveriesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [openAddDelivery, setOpenAddDelivery] = useState(false)
  const [openVerifyDelivery, setOpenVerifyDelivery] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null)
  const { toast } = useToast()

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const user = await getUserRole()
      if (!user?.companyId) throw new Error("No company ID found")
      
      await getDeliveryWaybills(user.companyId)
      
      toast({
        title: "Refreshed",
        description: "Delivery data has been refreshed successfully",
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

  const handleCreateDelivery = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      await createDeliveryWaybill(formData)
      
      toast({
        title: "Success",
        description: "Delivery has been created successfully",
      })
      setOpenAddDelivery(false)
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

  const handleVerifyDelivery = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      await updateDeliveryStatus(selectedDelivery.id, formData)
      
      toast({
        title: "Success",
        description: "Delivery has been verified successfully",
      })
      setOpenVerifyDelivery(false)
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
        title="Deliveries Management" 
        description="Track and manage product deliveries"
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
          <Button onClick={() => setOpenAddDelivery(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Delivery
          </Button>
        </div>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in_transit">In Transit</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Deliveries</CardTitle>
                <CardDescription>Deliveries awaiting dispatch</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Waybill No.</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Terminal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>WB00{i + 1}</TableCell>
                        <TableCell>John Driver {i + 1}</TableCell>
                        <TableCell>PMS</TableCell>
                        <TableCell>33,000 L</TableCell>
                        <TableCell>Terminal {i + 1}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDelivery({
                                id: i + 1,
                                waybill: `WB00${i + 1}`,
                                expected_volume: 33000
                              })
                              setOpenVerifyDelivery(true)
                            }}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Verify Delivery
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Similar TabsContent for in_transit and completed */}
        </Tabs>

        {/* New Delivery Dialog */}
        <Dialog open={openAddDelivery} onOpenChange={setOpenAddDelivery}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Delivery</DialogTitle>
              <DialogDescription>
                Enter delivery details and upload waybill
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDelivery}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="waybill_number">Waybill Number</Label>
                    <Input
                      id="waybill_number"
                      name="waybill_number"
                      placeholder="WB001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product_type">Product Type</Label>
                    <Select name="product_type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PMS">PMS (Petrol)</SelectItem>
                        <SelectItem value="AGO">AGO (Diesel)</SelectItem>
                        <SelectItem value="DPK">DPK (Kerosene)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expected_volume">Expected Volume (L)</Label>
                    <Input
                      id="expected_volume"
                      name="expected_volume"
                      type="number"
                      placeholder="33000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terminal_id">Destination Terminal</Label>
                    <Select name="terminal_id" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select terminal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Terminal 1</SelectItem>
                        <SelectItem value="2">Terminal 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driver_id">Driver</Label>
                    <Select name="driver_id" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">John Driver</SelectItem>
                        <SelectItem value="2">Jane Driver</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="truck_id">Truck</Label>
                    <Select name="truck_id" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select truck" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">ABC-123-XY (33,000 L)</SelectItem>
                        <SelectItem value="2">DEF-456-XY (33,000 L)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waybill_image">Upload Waybill (Optional)</Label>
                  <Input
                    id="waybill_image"
                    name="waybill_image"
                    type="file"
                    accept="image/*,.pdf"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Any additional information..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenAddDelivery(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Delivery"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Verify Delivery Dialog */}
        <Dialog open={openVerifyDelivery} onOpenChange={setOpenVerifyDelivery}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify Delivery</DialogTitle>
              <DialogDescription>
                Verify delivery for Waybill {selectedDelivery?.waybill}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleVerifyDelivery}>
              <div className="grid gap-4 py-4">
                <input type="hidden" name="status" value="delivered" />
                <div className="space-y-2">
                  <Label htmlFor="delivered_volume">Delivered Volume (L)</Label>
                  <Input
                    id="delivered_volume"
                    name="delivered_volume"
                    type="number"
                    defaultValue={selectedDelivery?.expected_volume}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verify_notes">Verification Notes</Label>
                  <Textarea
                    id="verify_notes"
                    name="notes"
                    placeholder="Any discrepancies or issues..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenVerifyDelivery(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Delivery"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}