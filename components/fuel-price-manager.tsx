"use client"

import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface FuelType {
  id: string
  name: string
  currentPrice: number
  lastUpdated: string
  profitMargin: number
}

export function FuelPriceManager() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [newPrice, setNewPrice] = useState<string>("")
  const [newMargin, setNewMargin] = useState<string>("")
  const [openDialog, setOpenDialog] = useState(false)
  const [newFuel, setNewFuel] = useState({
    name: "",
    currentPrice: "",
    profitMargin: ""
  })

  // Sample fuel types data - would come from API in production
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([
    {
      id: "1",
      name: "Petrol",
      currentPrice: 175.9,
      lastUpdated: "2025-04-20",
      profitMargin: 6.5
    },
    {
      id: "2",
      name: "Diesel",
      currentPrice: 180.5,
      lastUpdated: "2025-04-21",
      profitMargin: 7.2
    },
    {
      id: "3",
      name: "Premium Petrol",
      currentPrice: 189.9,
      lastUpdated: "2025-04-19",
      profitMargin: 8.5
    }
  ])

  const handlePriceUpdate = (id: string) => {
    if (!newPrice || isNaN(Number(newPrice))) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price",
        variant: "destructive"
      })
      return
    }

    setFuelTypes(prev => 
      prev.map(fuel => 
        fuel.id === id 
          ? { 
              ...fuel, 
              currentPrice: Number(newPrice),
              profitMargin: newMargin ? Number(newMargin) : fuel.profitMargin,
              lastUpdated: new Date().toISOString().split('T')[0] 
            } 
          : fuel
      )
    )

    toast({
      title: "Price updated",
      description: "Fuel price has been updated successfully"
    })

    setIsEditing(null)
    setNewPrice("")
    setNewMargin("")
  }

  const addNewFuel = () => {
    if (!newFuel.name || !newFuel.currentPrice || isNaN(Number(newFuel.currentPrice))) {
      toast({
        title: "Invalid details",
        description: "Please enter valid fuel details",
        variant: "destructive"
      })
      return
    }

    const newFuelItem: FuelType = {
      id: Date.now().toString(),
      name: newFuel.name,
      currentPrice: Number(newFuel.currentPrice),
      profitMargin: Number(newFuel.profitMargin) || 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    }

    setFuelTypes(prev => [...prev, newFuelItem])
    
    toast({
      title: "Fuel added",
      description: `${newFuel.name} has been added successfully`
    })
    
    setOpenDialog(false)
    setNewFuel({
      name: "",
      currentPrice: "",
      profitMargin: ""
    })
  }

  const deleteFuel = (id: string) => {
    setFuelTypes(prev => prev.filter(fuel => fuel.id !== id))
    
    toast({
      title: "Fuel deleted",
      description: "Fuel type has been removed successfully"
    })
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Fuel Price Management</CardTitle>
          <CardDescription>Manage your fuel prices and profit margins</CardDescription>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="ml-auto" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Fuel Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Fuel Type</DialogTitle>
              <DialogDescription>
                Add a new fuel type with current price and profit margin
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fuel-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="fuel-name"
                  value={newFuel.name}
                  onChange={(e) => setNewFuel({...newFuel, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="current-price" className="text-right">
                  Price
                </Label>
                <Input
                  id="current-price"
                  type="number"
                  step="0.1"
                  value={newFuel.currentPrice}
                  onChange={(e) => setNewFuel({...newFuel, currentPrice: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="profit-margin" className="text-right">
                  Margin %
                </Label>
                <Input
                  id="profit-margin"
                  type="number"
                  step="0.1"
                  value={newFuel.profitMargin}
                  onChange={(e) => setNewFuel({...newFuel, profitMargin: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={addNewFuel}>Add Fuel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fuel Type</TableHead>
              <TableHead>Current Price</TableHead>
              <TableHead>Profit Margin</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fuelTypes.map((fuel) => (
              <TableRow key={fuel.id}>
                <TableCell className="font-medium">{fuel.name}</TableCell>
                <TableCell>
                  {isEditing === fuel.id ? (
                    <Input
                      type="number"
                      step="0.1"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-24"
                    />
                  ) : (
                    `£${fuel.currentPrice.toFixed(1)}`
                  )}
                </TableCell>
                <TableCell>
                  {isEditing === fuel.id ? (
                    <Input
                      type="number"
                      step="0.1"
                      value={newMargin}
                      onChange={(e) => setNewMargin(e.target.value)}
                      className="w-24"
                    />
                  ) : (
                    `${fuel.profitMargin.toFixed(1)}%`
                  )}
                </TableCell>
                <TableCell>{fuel.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  {isEditing === fuel.id ? (
                    <div className="flex justify-end gap-2">
                      <Button size="sm" onClick={() => handlePriceUpdate(fuel.id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setIsEditing(fuel.id)
                          setNewPrice(fuel.currentPrice.toString())
                          setNewMargin(fuel.profitMargin.toString())
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteFuel(fuel.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
