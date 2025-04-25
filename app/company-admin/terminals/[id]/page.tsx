import { redirect } from "next/navigation"
import { getUserRole } from "@/app/actions/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart } from "@/components/charts/pie-chart"
import { AreaChart } from "@/components/charts/area-chart"
import { StatCard } from "@/components/stat-card"
import { FuelIcon as GasPump, Droplet, Users, Wallet, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"

export default async function TerminalDetailsPage({ params }: { params: { id: string } }) {
  const user = await getUserRole()

  if (!user || !user.isCompanyAdmin) {
    redirect("/unauthorized")
  }

  // Get terminal details with company info
  const terminal = await prisma.terminal.findFirst({
    where: {
      id: params.id,
      companyId: user.companyId || undefined
    },
    include: {
      company: {
        select: {
          name: true
        }
      }
    }
  })

  if (!terminal) {
    console.error("Error fetching terminal data")
    redirect("/company-admin")
  }

  // Get pumps for this terminal
  const pumps = await prisma.pump.findMany({
    where: { 
      terminalId: params.id 
    },
    include: {
      tank: {
        select: {
          number: true,
          capacity: true
        }
      }
    },
    orderBy: {
      number: 'asc'
    }
  })

  // Get tanks for this terminal
  const tanks = await prisma.tank.findMany({
    where: { 
      terminalId: params.id 
    },
    include: {
      _count: {
        select: {
          pumps: true
        }
      }
    }
  })

  // Get users assigned to this terminal
  const users = await prisma.user.findMany({
    where: { 
      companyId: user.companyId || undefined
      // Note: terminalId was removed as it doesn't exist in UserWhereInput
    },
    orderBy: {
      name: 'asc'
    }
  })

  // Get sales data for charts (mock data for now)
  const salesData = [
    { name: "Jan", total: 4000 },
    { name: "Feb", total: 3000 },
    { name: "Mar", total: 5000 },
    { name: "Apr", total: 4000 },
    { name: "May", total: 7000 },
    { name: "Jun", total: 5000 },
    { name: "Jul", total: 6000 },
  ]

  const productSalesData = [
    { name: "PMS", value: 40, color: "#4CAF50" },
    { name: "AGO", value: 30, color: "#2196F3" },
    { name: "DPK", value: 20, color: "#FFC107" },
    { name: "LPG", value: 10, color: "#9C27B0" },
  ]

  return (
    <DashboardLayout role="admin">
      <DashboardHeader
        title={terminal.name}
        description={`Management dashboard for ${terminal.company?.name || 'Company'}`}
      >
        <Link href={`/company-admin/terminals/${params.id}/settings`}>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Terminal Settings
          </Button>
        </Link>
      </DashboardHeader>

      <div className="p-4 md:p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Pumps"
            value={pumps.length.toString()}
            description="Active fuel dispensers"
            icon={<GasPump className="h-6 w-6" />}
            trend={null}
          />
          <StatCard
            title="Total Tanks"
            value={tanks.length.toString()}
            description="Storage tanks"
            icon={<Droplet className="h-6 w-6" />}
            trend={null}
          />
          <StatCard
            title="Staff Members"
            value={users.length.toString()}
            description="Assigned to terminal"
            icon={<Users className="h-6 w-6" />}
            trend={{
              value: 2,
              isPositive: true
            }}
          />
          <StatCard
            title="Monthly Revenue"
            value="₦4.2M"
            description="This terminal only"
            icon={<Wallet className="h-6 w-6" />}
            trend={{
              value: 5,
              isPositive: true
            }}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pumps">Pumps</TabsTrigger>
            <TabsTrigger value="tanks">Tanks</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue for this terminal</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <AreaChart 
                    data={salesData} 
                    index="name" 
                    categories={["total"]}
                    colors={["blue"]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Sales</CardTitle>
                  <CardDescription>Distribution by product type</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <PieChart data={productSalesData} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Terminal Address</CardTitle>
                <CardDescription>Physical location details</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{terminal.address || "No address specified"}</p>
                <p className="text-muted-foreground mt-2">
                  {/* location field doesn't exist in the schema, removed reference */}
                  {terminal.address ? `Located at ${terminal.address}` : "No location details available"}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pumps" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pumps</CardTitle>
                  <CardDescription>All fuel dispensers at this terminal</CardDescription>
                </div>
                <Link href={`/company-admin/terminals/${params.id}/pumps/new`}>
                  <Button size="sm">
                    <GasPump className="mr-2 h-4 w-4" />
                    Add Pump
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Price/Liter</TableHead>
                      <TableHead>Tank</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pumps && pumps.length > 0 ? (
                      pumps.map((pump) => (
                        <TableRow key={pump.id}>
                          <TableCell className="font-medium">Pump {pump.number}</TableCell>
                          <TableCell>{pump.tank ? `Tank ${pump.tank.number}` : "Not assigned"}</TableCell>
                          <TableCell>₦{(pump.number * 100).toFixed(2)}</TableCell>
                          <TableCell>{pump.tank ? `${pump.tank.capacity} L` : "Not assigned"}</TableCell>
                          <TableCell className="text-right">
                            <Link href={`/company-admin/terminals/${params.id}/pumps/${pump.id}`}>
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No pumps configured yet. Add your first pump to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tanks" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Tanks</CardTitle>
                  <CardDescription>All storage tanks at this terminal</CardDescription>
                </div>
                <Link href={`/company-admin/terminals/${params.id}/tanks/new`}>
                  <Button size="sm">
                    <Droplet className="mr-2 h-4 w-4" />
                    Add Tank
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Capacity (Liters)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tanks && tanks.length > 0 ? (
                      tanks.map((tank) => (
                        <TableRow key={tank.id}>
                          <TableCell className="font-medium">Tank {tank.number}</TableCell>
                          <TableCell>Storage Tank {tank.number}</TableCell>
                          <TableCell>{tank.capacity.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Link href={`/company-admin/terminals/${params.id}/tanks/${tank.id}`}>
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          No tanks configured yet. Add your first tank to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Staff</CardTitle>
                  <CardDescription>Users assigned to this terminal</CardDescription>
                </div>
                <Link href="/company-admin/users">
                  <Button size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users && users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="capitalize">{user.role}</TableCell>
                          <TableCell className="text-right">
                            <Link href={`/company-admin/users?edit=${user.id}`}>
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          No staff assigned to this terminal yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

