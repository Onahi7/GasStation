"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table/data-table"
import { tankColumns, type Tank } from "@/components/data-table/columns"
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

export default function TanksPage() {
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
  const tanks: Tank[] = [
    {
      id: "tank1",
      name: "Tank 1",
      type: "PMS (Petrol)",
      capacity: 10000,
      currentLevel: 8500,
      status: "Adequate",
      lastUpdated: "Today, 10:30 AM",
    },
    {
      id: "tank2",
      name: "Tank 2",
      type: "AGO (Diesel)",
      capacity: 8000,
      currentLevel: 5600,
      status: "Adequate",
      lastUpdated: "Today, 9:15 AM",
    },
    {
      id: "tank3",
      name: "Tank 3",
      type: "DPK (Kerosene)",
      capacity: 5000,
      currentLevel: 1000,
      status: "Low Stock",
      lastUpdated: "Yesterday, 6:45 PM",
    },
    {
      id: "tank4",
      name: "Tank 4",
      type: "PMS (Petrol)",
      capacity: 12000,
      currentLevel: 9800,
      status: "Adequate",
      lastUpdated: "Today, 11:20 AM",
    },
    {
      id: "tank5",
      name: "Tank 5",
      type: "AGO (Diesel)",
      capacity: 7000,
      currentLevel: 500,
      status: "Critical",
      lastUpdated: "Today, 8:00 AM",
    },
  ]

  return (
    <DashboardLayout role="admin">
      <DashboardHeader title="Tank Management" description="Add, monitor, and manage storage tanks">
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
                Add Tank
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Tank</DialogTitle>
                <DialogDescription>Enter the details for the new storage tank.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tank Name
                  </Label>
                  <Input id="name" placeholder="Tank 6" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
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
                  <Label htmlFor="capacity" className="text-right">
                    Capacity (L)
                  </Label>
                  <Input id="capacity" type="number" placeholder="10000" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="initial" className="text-right">
                    Initial Level (L)
                  </Label>
                  <Input id="initial" type="number" placeholder="0" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Add Tank</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Tanks</TabsTrigger>
              <TabsTrigger value="pms">PMS</TabsTrigger>
              <TabsTrigger value="ago">AGO</TabsTrigger>
              <TabsTrigger value="dpk">DPK</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
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
                <CardTitle>All Storage Tanks</CardTitle>
                <CardDescription>Manage and monitor all storage tanks in the station</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable columns={tankColumns} data={tanks} searchKey="name" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pms" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>PMS (Petrol) Tanks</CardTitle>
                <CardDescription>Manage and monitor petrol storage tanks</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={tankColumns}
                  data={tanks.filter((tank) => tank.type === "PMS (Petrol)")}
                  searchKey="name"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ago" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>AGO (Diesel) Tanks</CardTitle>
                <CardDescription>Manage and monitor diesel storage tanks</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={tankColumns}
                  data={tanks.filter((tank) => tank.type === "AGO (Diesel)")}
                  searchKey="name"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dpk" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>DPK (Kerosene) Tanks</CardTitle>
                <CardDescription>Manage and monitor kerosene storage tanks</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={tankColumns}
                  data={tanks.filter((tank) => tank.type === "DPK (Kerosene)")}
                  searchKey="name"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Tank Alerts</CardTitle>
                <CardDescription>Tanks requiring attention due to low stock or other issues</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={tankColumns}
                  data={tanks.filter((tank) => tank.status === "Low Stock" || tank.status === "Critical")}
                  searchKey="name"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

