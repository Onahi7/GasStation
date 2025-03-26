"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table/data-table"
import { pumpColumns, type Pump } from "@/components/data-table/columns"
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
import { Plus, Download, Upload, RefreshCw } from "lucide-react"

export default function PumpsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // Sample data
  const pumps: Pump[] = [
    {
      id: "pump1",
      label: "PMS1",
      fuelType: "PMS (Petrol)",
      tankId: "tank1",
      tankName: "Tank 1",
      price: 700,
      status: "Active",
      assignedTo: "John Doe",
      lastReading: 12367.8,
    },
    {
      id: "pump2",
      label: "PMS2",
      fuelType: "PMS (Petrol)",
      tankId: "tank1",
      tankName: "Tank 1",
      price: 700,
      status: "Active",
      assignedTo: "Jane Smith",
      lastReading: 8456.2,
    },
    {
      id: "pump3",
      label: "AGO1",
      fuelType: "AGO (Diesel)",
      tankId: "tank2",
      tankName: "Tank 2",
      price: 800,
      status: "Active",
      assignedTo: "Mike Johnson",
      lastReading: 5678.9,
    },
    {
      id: "pump4",
      label: "AGO2",
      fuelType: "AGO (Diesel)",
      tankId: "tank2",
      tankName: "Tank 2",
      price: 800,
      status: "Inactive",
      assignedTo: "Unassigned",
      lastReading: 4532.1,
    },
    {
      id: "pump5",
      label: "DPK1",
      fuelType: "DPK (Kerosene)",
      tankId: "tank3",
      tankName: "Tank 3",
      price: 750,
      status: "Active",
      assignedTo: "Sarah Williams",
      lastReading: 3245.6,
    },
    {
      id: "pump6",
      label: "PMS3",
      fuelType: "PMS (Petrol)",
      tankId: "tank4",
      tankName: "Tank 4",
      price: 700,
      status: "Maintenance",
      assignedTo: "Unassigned",
      lastReading: 7890.3,
    },
  ]

  return (
    <DashboardLayout role="admin">
      <DashboardHeader title="Pump Management" description="Add, configure, and manage fuel pumps">
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Pump
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Pump</DialogTitle>
                <DialogDescription>Enter the details for the new fuel pump.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="label" className="text-right">
                    Pump ID
                  </Label>
                  <Input id="label" placeholder="PMS4" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fuelType" className="text-right">
                    Fuel Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pms">PMS (Petrol)</SelectItem>
                      <SelectItem value="ago">AGO (Diesel)</SelectItem>
                      <SelectItem value="dpk">DPK (Kerosene)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tank" className="text-right">
                    Connect to Tank
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select tank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tank1">Tank 1 (PMS)</SelectItem>
                      <SelectItem value="tank2">Tank 2 (AGO)</SelectItem>
                      <SelectItem value="tank3">Tank 3 (DPK)</SelectItem>
                      <SelectItem value="tank4">Tank 4 (PMS)</SelectItem>
                      <SelectItem value="tank5">Tank 5 (AGO)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price (₦/L)
                  </Label>
                  <Input id="price" type="number" placeholder="700" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="initialReading" className="text-right">
                    Initial Reading
                  </Label>
                  <Input id="initialReading" type="number" placeholder="0" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Add Pump</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Pumps</TabsTrigger>
              <TabsTrigger value="pms">PMS</TabsTrigger>
              <TabsTrigger value="ago">AGO</TabsTrigger>
              <TabsTrigger value="dpk">DPK</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
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
                <CardTitle>All Fuel Pumps</CardTitle>
                <CardDescription>Manage and monitor all fuel pumps in the station</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable columns={pumpColumns} data={pumps} searchKey="label" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pms" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>PMS (Petrol) Pumps</CardTitle>
                <CardDescription>Manage and monitor petrol pumps</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={pumpColumns}
                  data={pumps.filter((pump) => pump.fuelType === "PMS (Petrol)")}
                  searchKey="label"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ago" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>AGO (Diesel) Pumps</CardTitle>
                <CardDescription>Manage and monitor diesel pumps</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={pumpColumns}
                  data={pumps.filter((pump) => pump.fuelType === "AGO (Diesel)")}
                  searchKey="label"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dpk" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>DPK (Kerosene) Pumps</CardTitle>
                <CardDescription>Manage and monitor kerosene pumps</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={pumpColumns}
                  data={pumps.filter((pump) => pump.fuelType === "DPK (Kerosene)")}
                  searchKey="label"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Inactive Pumps</CardTitle>
                <CardDescription>Pumps that are currently inactive or under maintenance</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={pumpColumns}
                  data={pumps.filter((pump) => pump.status !== "Active")}
                  searchKey="label"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

