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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DateRangePicker } from "@/components/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart } from "@/components/charts/area-chart"
import { Plus, Download, RefreshCw, Filter, FuelIcon as GasPump } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MeterReadingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [openReading, setOpenReading] = useState(false)
  const [currentShift, setCurrentShift] = useState<any>(null)
  const [nozzles, setNozzles] = useState<any[]>([])
  const [selectedNozzle, setSelectedNozzle] = useState<string>("")
  const [openingReading, setOpeningReading] = useState<number | null>(null)
  const [readingValue, setReadingValue] = useState<string>("")
  const [readingType, setReadingType] = useState<string>("opening")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch current shift
        // Fetch nozzles assigned to the worker
        // This would be implemented with actual API calls

        // Mock data for demonstration
        setCurrentShift({
          id: "shift123",
          start_time: new Date().toISOString(),
          status: "active",
        })

        setNozzles([
          { id: "nozzle1", name: "PMS1", current_reading: 12345.6 },
          { id: "nozzle2", name: "AGO1", current_reading: 8765.4 },
        ])
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

  const handleNozzleChange = (nozzleId: string) => {
    setSelectedNozzle(nozzleId)
    const nozzle = nozzles.find((n) => n.id === nozzleId)
    if (nozzle) {
      setOpeningReading(nozzle.current_reading)
    } else {
      setOpeningReading(null)
    }
  }

  const handleSubmitReading = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentShift) {
      toast({
        title: "No active shift",
        description: "You must start a shift before recording readings.",
        variant: "destructive",
      })
      return
    }

    if (!selectedNozzle) {
      toast({
        title: "No nozzle selected",
        description: "Please select a nozzle.",
        variant: "destructive",
      })
      return
    }

    if (!readingValue || isNaN(Number.parseFloat(readingValue))) {
      toast({
        title: "Invalid reading",
        description: "Please enter a valid reading value.",
        variant: "destructive",
      })
      return
    }

    // For closing readings, validate against opening reading
    if (readingType === "closing" && openingReading !== null) {
      if (Number.parseFloat(readingValue) < openingReading) {
        toast({
          title: "Invalid reading",
          description: "Closing reading must be greater than opening reading.",
          variant: "destructive",
        })
        return
      }
    }

    setIsLoading(true)

    try {
      // Submit the reading
      // This would be implemented with actual API calls

      toast({
        title: "Reading recorded",
        description: `${readingType.charAt(0).toUpperCase() + readingType.slice(1)} reading recorded successfully.`,
      })

      setOpenReading(false)
      setReadingValue("")

      // Refresh data
      // This would be implemented with actual API calls
    } catch (error) {
      console.error("Error recording reading:", error)
      toast({
        title: "Error",
        description: "Failed to record reading. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Sample data for charts
  const readingsData = [
    { day: "Mon", volume: 22.5 },
    { day: "Tue", volume: 25.3 },
    { day: "Wed", volume: 24.8 },
    { day: "Thu", volume: 26.2 },
    { day: "Fri", volume: 28.5 },
    { day: "Sat", volume: 30.1 },
    { day: "Sun", volume: 27.4 },
  ]

  return (
    <DashboardLayout role="worker">
      <DashboardHeader title="Meter Readings" description="Record and track pump meter readings">
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
          <Dialog open={openReading} onOpenChange={setOpenReading}>
            <DialogTrigger asChild>
              <Button disabled={!currentShift}>
                <Plus className="mr-2 h-4 w-4" />
                Record Reading
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Record Meter Reading</DialogTitle>
                <DialogDescription>Enter the current meter reading for your assigned pump.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitReading}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nozzle" className="text-right">
                      Nozzle
                    </Label>
                    <Select value={selectedNozzle} onValueChange={handleNozzleChange}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select nozzle" />
                      </SelectTrigger>
                      <SelectContent>
                        {nozzles.map((nozzle) => (
                          <SelectItem key={nozzle.id} value={nozzle.id}>
                            {nozzle.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="readingType" className="text-right">
                      Reading Type
                    </Label>
                    <Select value={readingType} onValueChange={setReadingType}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="opening">Opening</SelectItem>
                        <SelectItem value="closing">Closing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {readingType === "closing" && openingReading !== null && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="opening" className="text-right">
                        Opening Reading
                      </Label>
                      <Input id="opening" type="number" value={openingReading} className="col-span-3" readOnly />
                    </div>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="current" className="text-right">
                      Reading Value
                    </Label>
                    <Input
                      id="current"
                      type="number"
                      placeholder="Enter reading"
                      className="col-span-3"
                      value={readingValue}
                      onChange={(e) => setReadingValue(e.target.value)}
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea id="notes" placeholder="Any additional information" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setOpenReading(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Reading"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Readings</TabsTrigger>
              <TabsTrigger value="pms1">PMS1</TabsTrigger>
              <TabsTrigger value="ago1">AGO1</TabsTrigger>
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
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  id: "PMS1",
                  type: "Petrol",
                  price: "₦700/L",
                  opening: "12345.6",
                  current: "12367.8",
                  sold: "22.2 L",
                  revenue: "₦15,540",
                },
                {
                  id: "AGO1",
                  type: "Diesel",
                  price: "₦800/L",
                  opening: "8765.4",
                  current: "8789.9",
                  sold: "24.5 L",
                  revenue: "₦19,600",
                },
              ].map((pump, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>Pump {pump.id}</CardTitle>
                      <div className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</div>
                    </div>
                    <CardDescription>
                      {pump.type} - {pump.price}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Opening Reading:</span>
                        <span className="font-medium">{pump.opening} L</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Current Reading:</span>
                        <span className="font-medium">{pump.current} L</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Volume Sold:</span>
                        <span className="font-medium">{pump.sold}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Revenue:</span>
                        <span className="font-medium">{pump.revenue}</span>
                      </div>
                      <div className="pt-2">
                        <Button size="sm" variant="outline" className="w-full" onClick={() => setOpenReading(true)}>
                          Update Reading
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Reading History</CardTitle>
                <CardDescription>Record of all meter readings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      date: "Today, 10:30 AM",
                      pump: "PMS1",
                      opening: "12345.6",
                      closing: "12367.8",
                      volume: "22.2 L",
                      status: "Recorded",
                    },
                    {
                      date: "Yesterday, 8:00 PM",
                      pump: "PMS1",
                      opening: "12320.3",
                      closing: "12345.6",
                      volume: "25.3 L",
                      status: "Verified",
                    },
                    {
                      date: "Yesterday, 8:00 PM",
                      pump: "AGO1",
                      opening: "8740.2",
                      closing: "8765.4",
                      volume: "25.2 L",
                      status: "Verified",
                    },
                    {
                      date: "2 days ago, 8:00 PM",
                      pump: "PMS1",
                      opening: "12295.8",
                      closing: "12320.3",
                      volume: "24.5 L",
                      status: "Verified",
                    },
                    {
                      date: "2 days ago, 8:00 PM",
                      pump: "AGO1",
                      opening: "8715.5",
                      closing: "8740.2",
                      volume: "24.7 L",
                      status: "Verified",
                    },
                  ].map((reading, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{reading.date}</div>
                        <div className="text-sm text-muted-foreground">
                          {reading.pump}: {reading.opening} → {reading.closing}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{reading.volume}</div>
                        <div className="text-sm text-muted-foreground">Volume</div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            reading.status === "Verified" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {reading.status}
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

            <Card>
              <CardHeader>
                <CardTitle>Volume Trend</CardTitle>
                <CardDescription>Daily sales volume over the past week</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <AreaChart data={readingsData} xKey="day" yKey="volume" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pms1" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>PMS1 Readings</CardTitle>
                  <CardDescription>Petrol pump readings history</CardDescription>
                </div>
                <Button size="sm" onClick={() => setOpenReading(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Reading
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      date: "Today, 10:30 AM",
                      opening: "12345.6",
                      closing: "12367.8",
                      volume: "22.2 L",
                      status: "Recorded",
                    },
                    {
                      date: "Yesterday, 8:00 PM",
                      opening: "12320.3",
                      closing: "12345.6",
                      volume: "25.3 L",
                      status: "Verified",
                    },
                    {
                      date: "2 days ago, 8:00 PM",
                      opening: "12295.8",
                      closing: "12320.3",
                      volume: "24.5 L",
                      status: "Verified",
                    },
                    {
                      date: "3 days ago, 8:00 PM",
                      opening: "12270.2",
                      closing: "12295.8",
                      volume: "25.6 L",
                      status: "Verified",
                    },
                    {
                      date: "4 days ago, 8:00 PM",
                      opening: "12245.5",
                      closing: "12270.2",
                      volume: "24.7 L",
                      status: "Verified",
                    },
                  ].map((reading, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{reading.date}</div>
                        <div className="text-sm text-muted-foreground">
                          {reading.opening} → {reading.closing}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{reading.volume}</div>
                        <div className="text-sm text-muted-foreground">Volume</div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            reading.status === "Verified" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {reading.status}
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

          <TabsContent value="ago1" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>AGO1 Readings</CardTitle>
                  <CardDescription>Diesel pump readings history</CardDescription>
                </div>
                <Button size="sm" onClick={() => setOpenReading(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Reading
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      date: "Today, 10:30 AM",
                      opening: "8765.4",
                      closing: "8789.9",
                      volume: "24.5 L",
                      status: "Recorded",
                    },
                    {
                      date: "Yesterday, 8:00 PM",
                      opening: "8740.2",
                      closing: "8765.4",
                      volume: "25.2 L",
                      status: "Verified",
                    },
                    {
                      date: "2 days ago, 8:00 PM",
                      opening: "8715.5",
                      closing: "8740.2",
                      volume: "24.7 L",
                      status: "Verified",
                    },
                    {
                      date: "3 days ago, 8:00 PM",
                      opening: "8690.3",
                      closing: "8715.5",
                      volume: "25.2 L",
                      status: "Verified",
                    },
                    {
                      date: "4 days ago, 8:00 PM",
                      opening: "8665.8",
                      closing: "8690.3",
                      volume: "24.5 L",
                      status: "Verified",
                    },
                  ].map((reading, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{reading.date}</div>
                        <div className="text-sm text-muted-foreground">
                          {reading.opening} → {reading.closing}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{reading.volume}</div>
                        <div className="text-sm text-muted-foreground">Volume</div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            reading.status === "Verified" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {reading.status}
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

        <div className="grid gap-4 mt-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Reading Guidelines</CardTitle>
              <CardDescription>Important information for accurate readings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <GasPump className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">Take Readings at Shift Start/End</div>
                    <div className="text-sm text-muted-foreground">
                      Always record meter readings at the beginning and end of your shift.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <GasPump className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">Report Discrepancies Immediately</div>
                    <div className="text-sm text-muted-foreground">
                      If you notice any unusual readings or discrepancies, report to your supervisor right away.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <GasPump className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">Double-Check Your Readings</div>
                    <div className="text-sm text-muted-foreground">
                      Always verify the numbers before submitting to ensure accuracy.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <GasPump className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">Include Notes When Necessary</div>
                    <div className="text-sm text-muted-foreground">
                      Add notes for any unusual circumstances or events that might affect readings.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>Your reading accuracy and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Total Readings (This Month)</div>
                  <div className="font-bold">42</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Accuracy Rate</div>
                  <div className="font-bold">98.5%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Average Volume per Day</div>
                  <div className="font-bold">48.7 L</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">On-Time Submission Rate</div>
                  <div className="font-bold">100%</div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted mt-2">
                  <div className="h-2 rounded-full bg-primary" style={{ width: "98.5%" }}></div>
                </div>
                <div className="text-xs text-center text-muted-foreground mt-1">Accuracy Rating: Excellent</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

