"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropletIcon, AlertTriangle, RefreshCw, History, BarChart3, TrendingUp, TrendingDown } from "lucide-react"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
import { useToast } from "@/hooks/use-toast"

interface TankData {
  id: string
  name: string
  fuelType: string
  capacity: number
  currentLevel: number
  lastDelivery: string
  dailyUsage: number
  status: "normal" | "warning" | "critical"
  temperature: number
  waterLevel: number
}

export function TankMonitoringSystem() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState(false)
  const [selectedTank, setSelectedTank] = useState<string | null>(null)
  const [deliveryAmount, setDeliveryAmount] = useState("")
  
  const [tanks, setTanks] = useState<TankData[]>([
    {
      id: "tank1",
      name: "Tank 1",
      fuelType: "Petrol",
      capacity: 30000,
      currentLevel: 24500,
      lastDelivery: "2025-04-18",
      dailyUsage: 1200,
      status: "normal",
      temperature: 15.2,
      waterLevel: 0.2
    },
    {
      id: "tank2",
      name: "Tank 2",
      fuelType: "Diesel",
      capacity: 25000,
      currentLevel: 8000,
      lastDelivery: "2025-04-15",
      dailyUsage: 1500,
      status: "warning",
      temperature: 14.8,
      waterLevel: 0.5
    },
    {
      id: "tank3",
      name: "Tank 3",
      fuelType: "Premium Petrol",
      capacity: 20000,
      currentLevel: 3500,
      lastDelivery: "2025-04-10",
      dailyUsage: 800,
      status: "critical",
      temperature: 15.5,
      waterLevel: 0.1
    }
  ])

  // Calculate status based on current level
  useEffect(() => {
    setTanks(prev => 
      prev.map(tank => {
        const percentage = (tank.currentLevel / tank.capacity) * 100
        let status: "normal" | "warning" | "critical" = "normal"
        
        if (percentage < 15) {
          status = "critical"
        } else if (percentage < 30) {
          status = "warning"
        }
        
        return { ...tank, status }
      })
    )
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500"
      case "warning":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "warning":
        return <Badge variant="warning" className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>
      default:
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Normal</Badge>
    }
  }
  
  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call to refresh tank data
    setTimeout(() => {
      // Simulate small changes in tank levels due to usage
      setTanks(prev => 
        prev.map(tank => {
          // Random usage amount - would come from real readings in production
          const usage = Math.floor(Math.random() * 200) + 50
          const newLevel = Math.max(0, tank.currentLevel - usage)
          
          const percentage = (newLevel / tank.capacity) * 100
          let status: "normal" | "warning" | "critical" = "normal"
          
          if (percentage < 15) {
            status = "critical"
          } else if (percentage < 30) {
            status = "warning"
          }
          
          return { 
            ...tank, 
            currentLevel: newLevel,
            status
          }
        })
      )
      
      setIsLoading(false)
      
      toast({
        title: "Data refreshed",
        description: "Tank monitoring data has been updated"
      })
    }, 1500)
  }

  const recordDelivery = () => {
    if (!selectedTank || !deliveryAmount || isNaN(Number(deliveryAmount))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid delivery amount",
        variant: "destructive"
      })
      return
    }

    const amount = Number(deliveryAmount)
    
    setTanks(prev => 
      prev.map(tank => {
        if (tank.id === selectedTank) {
          const newLevel = Math.min(tank.capacity, tank.currentLevel + amount)
          const percentage = (newLevel / tank.capacity) * 100
          let status: "normal" | "warning" | "critical" = "normal"
          
          if (percentage < 15) {
            status = "critical"
          } else if (percentage < 30) {
            status = "warning"
          }
          
          return { 
            ...tank, 
            currentLevel: newLevel,
            lastDelivery: new Date().toISOString().split('T')[0],
            status
          }
        }
        return tank
      })
    )

    toast({
      title: "Delivery recorded",
      description: `Added ${amount} liters to ${tanks.find(t => t.id === selectedTank)?.name}`
    })
    
    setOpenDeliveryDialog(false)
    setSelectedTank(null)
    setDeliveryAmount("")
  }

  const calculateDaysRemaining = (tank: TankData) => {
    if (tank.dailyUsage === 0) return "∞"
    const days = Math.floor(tank.currentLevel / tank.dailyUsage)
    return days.toString()
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Tank Monitoring System</h2>
        <div className="flex items-center gap-2">
          <Button onClick={refreshData} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Refreshing..." : "Refresh Data"}
          </Button>
          <Dialog open={openDeliveryDialog} onOpenChange={setOpenDeliveryDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <DropletIcon className="mr-2 h-4 w-4" />
                Record Delivery
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Fuel Delivery</DialogTitle>
                <DialogDescription>
                  Add a new fuel delivery to a specific tank
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tank-select" className="text-right">
                    Tank
                  </Label>
                  <select
                    id="tank-select"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedTank || ""}
                    onChange={(e) => setSelectedTank(e.target.value)}
                  >
                    <option value="">Select a tank</option>
                    {tanks.map(tank => (
                      <option key={tank.id} value={tank.id}>
                        {tank.name} - {tank.fuelType}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="delivery-amount" className="text-right">
                    Amount (L)
                  </Label>
                  <Input
                    id="delivery-amount"
                    type="number"
                    value={deliveryAmount}
                    onChange={(e) => setDeliveryAmount(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDeliveryDialog(false)}>Cancel</Button>
                <Button onClick={recordDelivery}>Record Delivery</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tanks.map((tank) => {
          const fillPercentage = Math.round((tank.currentLevel / tank.capacity) * 100)
          
          return (
            <Card key={tank.id} className="relative overflow-hidden">
              <div 
                className={`absolute top-0 right-0 w-2 h-2 rounded-full m-2 ${getStatusColor(tank.status)}`} 
              />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      {tank.name}
                      {tank.status === "critical" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertTriangle className="ml-2 h-4 w-4 text-red-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Critical level, order fuel immediately</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </CardTitle>
                    <CardDescription>{tank.fuelType}</CardDescription>
                  </div>
                  {getStatusBadge(tank.status)}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">
                    {tank.currentLevel.toLocaleString()} / {tank.capacity.toLocaleString()} L
                  </span>
                  <span className="text-sm font-medium">{fillPercentage}%</span>
                </div>
                <Progress value={fillPercentage} className="h-3" />
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-muted rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">Days Remaining</div>
                    <div className="text-lg font-bold flex items-center">
                      {calculateDaysRemaining(tank)}
                      {Number(calculateDaysRemaining(tank)) <= 3 && (
                        <AlertTriangle className="ml-1 h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">Daily Usage</div>
                    <div className="text-lg font-bold flex items-center">
                      {tank.dailyUsage} L
                      {tank.dailyUsage > 1000 ? (
                        <TrendingUp className="ml-1 h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="ml-1 h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">Temperature</div>
                    <div className="text-lg font-bold">
                      {tank.temperature}°C
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">Water Level</div>
                    <div className="text-lg font-bold">
                      {tank.waterLevel}%
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline" size="sm" className="gap-1">
                  <History className="h-4 w-4" />
                  <span>History</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </>
  )
}
