"use client"

import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Plus, 
  Search, 
  Award, 
  Gift, 
  Percent, 
  Settings, 
  FileText, 
  BarChart4, 
  Mail,
  Phone,
  Calendar 
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  points: number
  memberSince: string
  membershipLevel: "Bronze" | "Silver" | "Gold" | "Platinum"
  lastVisit: string
  spendingTotal: number
  fuelPreference: string
}

interface Reward {
  id: string
  name: string
  description: string
  pointsCost: number
  available: boolean
  category: "Fuel" | "Shop" | "Service" | "Partner"
  redemptions: number
}

export function LoyaltyProgram() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [openAddCustomer, setOpenAddCustomer] = useState(false)
  const [openAddReward, setOpenAddReward] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    fuelPreference: ""
  })
  const [newReward, setNewReward] = useState({
    name: "",
    description: "",
    pointsCost: "",
    category: "Fuel"
  })
  
  // Sample customers data - would come from API in production
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "c1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "07700 900123",
      points: 1240,
      memberSince: "2023-05-12",
      membershipLevel: "Gold",
      lastVisit: "2025-04-22",
      spendingTotal: 3200.50,
      fuelPreference: "Diesel"
    },
    {
      id: "c2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "07700 900456",
      points: 620,
      memberSince: "2024-01-30",
      membershipLevel: "Silver",
      lastVisit: "2025-04-18",
      spendingTotal: 1520.75,
      fuelPreference: "Petrol"
    },
    {
      id: "c3",
      name: "Ahmed Khan",
      email: "ahmed.k@example.com",
      phone: "07700 900789",
      points: 2350,
      memberSince: "2022-11-05",
      membershipLevel: "Platinum",
      lastVisit: "2025-04-23",
      spendingTotal: 5120.25,
      fuelPreference: "Premium Petrol"
    },
    {
      id: "c4",
      name: "Emily Wilson",
      email: "emily.w@example.com",
      phone: "07700 900321",
      points: 180,
      memberSince: "2025-02-15",
      membershipLevel: "Bronze",
      lastVisit: "2025-04-10",
      spendingTotal: 450.00,
      fuelPreference: "Petrol"
    }
  ])
  
  // Sample rewards data - would come from API in production
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: "r1",
      name: "10p Off Per Litre",
      description: "Get 10p off per litre on your next fuel purchase (up to 50 litres)",
      pointsCost: 500,
      available: true,
      category: "Fuel",
      redemptions: 142
    },
    {
      id: "r2",
      name: "Free Car Wash",
      description: "Enjoy a complimentary premium car wash with your next visit",
      pointsCost: 300,
      available: true,
      category: "Service",
      redemptions: 98
    },
    {
      id: "r3",
      name: "Free Coffee",
      description: "Redeem for a free coffee from our shop",
      pointsCost: 150,
      available: true,
      category: "Shop",
      redemptions: 256
    },
    {
      id: "r4",
      name: "£15 Shop Voucher",
      description: "£15 voucher to spend in our convenience store",
      pointsCost: 750,
      available: true,
      category: "Shop",
      redemptions: 67
    },
    {
      id: "r5",
      name: "Cinema Ticket Discount",
      description: "25% off cinema tickets at participating Vue cinemas",
      pointsCost: 400,
      available: true,
      category: "Partner",
      redemptions: 35
    }
  ])

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  )

  const addCustomer = () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const customer: Customer = {
      id: `c${customers.length + 1}`,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      points: 100, // Starting bonus points
      memberSince: new Date().toISOString().split('T')[0],
      membershipLevel: "Bronze",
      lastVisit: new Date().toISOString().split('T')[0],
      spendingTotal: 0,
      fuelPreference: newCustomer.fuelPreference || "Not specified"
    }

    setCustomers([...customers, customer])
    setOpenAddCustomer(false)
    setNewCustomer({ name: "", email: "", phone: "", fuelPreference: "" })

    toast({
      title: "Customer added",
      description: `${newCustomer.name} has been added to the loyalty program with 100 bonus points`
    })
  }

  const addReward = () => {
    if (!newReward.name || !newReward.description || !newReward.pointsCost) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const reward: Reward = {
      id: `r${rewards.length + 1}`,
      name: newReward.name,
      description: newReward.description,
      pointsCost: parseInt(newReward.pointsCost),
      available: true,
      category: newReward.category as "Fuel" | "Shop" | "Service" | "Partner",
      redemptions: 0
    }

    setRewards([...rewards, reward])
    setOpenAddReward(false)
    setNewReward({ name: "", description: "", pointsCost: "", category: "Fuel" })

    toast({
      title: "Reward added",
      description: `${newReward.name} has been added to the loyalty program`
    })
  }

  const getMembershipColor = (level: string) => {
    switch (level) {
      case "Bronze":
        return "bg-amber-700 hover:bg-amber-800"
      case "Silver":
        return "bg-gray-400 hover:bg-gray-500"
      case "Gold":
        return "bg-amber-400 hover:bg-amber-500"
      case "Platinum":
        return "bg-slate-700 hover:bg-slate-800"
      default:
        return ""
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Fuel":
        return "bg-blue-500 hover:bg-blue-600"
      case "Shop":
        return "bg-green-500 hover:bg-green-600"
      case "Service":
        return "bg-purple-500 hover:bg-purple-600"
      case "Partner":
        return "bg-orange-500 hover:bg-orange-600"
      default:
        return ""
    }
  }

  return (
    <Tabs defaultValue="customers" className="w-full">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="customers" className="gap-2">
            <User className="h-4 w-4" />
            Loyalty Members
          </TabsTrigger>
          <TabsTrigger value="rewards" className="gap-2">
            <Award className="h-4 w-4" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart4 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        <div className="flex gap-2">
          <Dialog open={openAddCustomer} onOpenChange={setOpenAddCustomer}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Loyalty Member</DialogTitle>
                <DialogDescription>
                  Add a new customer to the loyalty program
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="customer-name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer-phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="customer-phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fuel-preference" className="text-right">
                    Fuel Preference
                  </Label>
                  <select
                    id="fuel-preference"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newCustomer.fuelPreference}
                    onChange={(e) => setNewCustomer({...newCustomer, fuelPreference: e.target.value})}
                  >
                    <option value="">Select a preference</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Premium Petrol">Premium Petrol</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenAddCustomer(false)}>Cancel</Button>
                <Button onClick={addCustomer}>Add Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={openAddReward} onOpenChange={setOpenAddReward}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Gift className="mr-2 h-4 w-4" />
                Add Reward
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Loyalty Reward</DialogTitle>
                <DialogDescription>
                  Create a new reward for loyalty program members
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reward-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="reward-name"
                    value={newReward.name}
                    onChange={(e) => setNewReward({...newReward, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reward-description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="reward-description"
                    value={newReward.description}
                    onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reward-points" className="text-right">
                    Points Cost
                  </Label>
                  <Input
                    id="reward-points"
                    type="number"
                    value={newReward.pointsCost}
                    onChange={(e) => setNewReward({...newReward, pointsCost: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reward-category" className="text-right">
                    Category
                  </Label>
                  <select
                    id="reward-category"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newReward.category}
                    onChange={(e) => setNewReward({...newReward, category: e.target.value})}
                  >
                    <option value="Fuel">Fuel</option>
                    <option value="Shop">Shop</option>
                    <option value="Service">Service</option>
                    <option value="Partner">Partner</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenAddReward(false)}>Cancel</Button>
                <Button onClick={addReward}>Add Reward</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TabsContent value="customers" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Loyalty Program Members</CardTitle>
                <CardDescription>Manage your customer loyalty program members and their rewards</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search members..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Spending</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No members found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}`} />
                            <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-xs text-muted-foreground">Member since {customer.memberSince}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-semibold">{customer.points}</span>
                          <Award className="ml-1 h-4 w-4 text-yellow-500" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getMembershipColor(customer.membershipLevel)}`}>
                          {customer.membershipLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>£{customer.spendingTotal.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {customer.lastVisit}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Gift className="mr-2 h-4 w-4" />
                            Redeem
                          </Button>
                          <Button variant="outline" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredCustomers.length} of {customers.length} members
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Export Data</Button>
              <Button size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Send Campaign
              </Button>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="rewards" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Program Rewards</CardTitle>
            <CardDescription>Manage the rewards that customers can redeem with their loyalty points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => (
                <Card key={reward.id} className="overflow-hidden">
                  <div className={`h-2 ${getCategoryColor(reward.category)}`} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{reward.name}</CardTitle>
                      <Badge variant="outline">{reward.pointsCost} points</Badge>
                    </div>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center justify-between text-sm">
                      <Badge className={`${getCategoryColor(reward.category)}`}>
                        {reward.category}
                      </Badge>
                      <span className="text-muted-foreground">{reward.redemptions} redemptions</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={reward.available ? "" : "bg-red-100"}
                    >
                      {reward.available ? "Disable" : "Enable"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Program Analytics</CardTitle>
            <CardDescription>Track the performance of your loyalty program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Members</CardDescription>
                  <CardTitle className="text-2xl">{customers.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-green-600">+12.5% from last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Points Redeemed</CardDescription>
                  <CardTitle className="text-2xl">14,250</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-green-600">+8.2% from last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Program Engagement</CardDescription>
                  <CardTitle className="text-2xl">72%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-yellow-600">-2.1% from last month</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="h-[300px] flex items-center justify-center border rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart4 className="h-16 w-16 mx-auto mb-2 opacity-50" />
                <p>Loyalty Program Analytics Charts</p>
                <p className="text-sm">(Placeholder for actual analytics implementation)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Program Settings</CardTitle>
            <CardDescription>Configure your loyalty program settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Membership Tiers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center">
                        Bronze
                        <Badge className="ml-2 bg-amber-700">Bronze</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">0 - 500 points</p>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center">
                          <Percent className="h-3 w-3 mr-2 text-muted-foreground" />
                          1% back in points
                        </li>
                        <li className="flex items-center">
                          <Gift className="h-3 w-3 mr-2 text-muted-foreground" />
                          Birthday reward
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center">
                        Silver
                        <Badge className="ml-2 bg-gray-400">Silver</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">501 - 1000 points</p>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center">
                          <Percent className="h-3 w-3 mr-2 text-muted-foreground" />
                          2% back in points
                        </li>
                        <li className="flex items-center">
                          <Gift className="h-3 w-3 mr-2 text-muted-foreground" />
                          Birthday reward
                        </li>
                        <li className="flex items-center">
                          <Award className="h-3 w-3 mr-2 text-muted-foreground" />
                          Quarterly bonus
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center">
                        Gold
                        <Badge className="ml-2 bg-amber-400">Gold</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">1001 - 2000 points</p>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center">
                          <Percent className="h-3 w-3 mr-2 text-muted-foreground" />
                          3% back in points
                        </li>
                        <li className="flex items-center">
                          <Gift className="h-3 w-3 mr-2 text-muted-foreground" />
                          Enhanced birthday reward
                        </li>
                        <li className="flex items-center">
                          <Award className="h-3 w-3 mr-2 text-muted-foreground" />
                          Quarterly bonus
                        </li>
                        <li className="flex items-center">
                          <Award className="h-3 w-3 mr-2 text-muted-foreground" />
                          Priority service
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center">
                        Platinum
                        <Badge className="ml-2 bg-slate-700">Platinum</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">2001+ points</p>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center">
                          <Percent className="h-3 w-3 mr-2 text-muted-foreground" />
                          5% back in points
                        </li>
                        <li className="flex items-center">
                          <Gift className="h-3 w-3 mr-2 text-muted-foreground" />
                          Premium birthday package
                        </li>
                        <li className="flex items-center">
                          <Award className="h-3 w-3 mr-2 text-muted-foreground" />
                          Monthly bonus
                        </li>
                        <li className="flex items-center">
                          <Award className="h-3 w-3 mr-2 text-muted-foreground" />
                          VIP service
                        </li>
                        <li className="flex items-center">
                          <Award className="h-3 w-3 mr-2 text-muted-foreground" />
                          Exclusive offers
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Point Earning Rules</h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="points-per-pound">Points per £1 spent on fuel</Label>
                        <Input id="points-per-pound" type="number" defaultValue="10" />
                      </div>
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="points-per-pound-shop">Points per £1 spent in shop</Label>
                        <Input id="points-per-pound-shop" type="number" defaultValue="5" />
                      </div>
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="points-per-car-wash">Points for car wash</Label>
                        <Input id="points-per-car-wash" type="number" defaultValue="25" />
                      </div>
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="signup-bonus">Sign-up bonus points</Label>
                        <Input id="signup-bonus" type="number" defaultValue="100" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
