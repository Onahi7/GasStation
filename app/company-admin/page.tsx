import { redirect } from "next/navigation"
import { getUserRole } from "@/app/actions/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { AreaChart } from "@/components/charts/area-chart"
import { StatCard } from "@/components/stat-card"
import { Building2, Users, FuelIcon as GasPump, Wallet, TrendingUp } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"

export default async function CompanyAdminDashboard() {
  const user = await getUserRole()
  
  if (!user || !user.isCompanyAdmin) {
    redirect("/unauthorized")
  }
  
  // Get company details
  const companyData = await prisma.company.findUnique({
    where: { id: user.companyId || undefined },
    include: {
      _count: {
        select: {
          terminals: true,
          users: true,
        }
      }
    }
  })
  
  if (!companyData) {
    console.error("Error fetching company data")
    redirect("/login")
  }

  // Get terminals with stats
  const terminals = await prisma.terminal.findMany({
    where: { companyId: user.companyId || undefined },
    include: {
      _count: {
        select: {
          pumps: true,
          tanks: true
        }
      },
      users: {
        select: {
          id: true
        }
      }
    }
  })

  // Transform terminal data to match the expected format
  const transformedTerminals = terminals.map(terminal => ({
    id: terminal.id,
    name: terminal.name,
    location: terminal.address || "",
    pumps: { count: terminal._count?.pumps || 0 },
    tanks: { count: terminal._count?.tanks || 0 },
    users: { count: terminal.users?.length || 0 }
  }))
  
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
        title={`${companyData.name} Dashboard`}
        description="Company-wide overview and management"
      >
        <div className="flex space-x-2">
          <Link href="/company-admin/terminals/new">
            <Button>
              <Building2 className="mr-2 h-4 w-4" />
              Add Terminal
            </Button>
          </Link>
          <Link href="/company-admin/users">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </Link>
        </div>
      </DashboardHeader>
      
      <div className="p-4 md:p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Terminals"
            value={companyData._count?.terminals?.toString() || "0"}
            description="Active filling stations"
            icon={<Building2 className="h-6 w-6" />}
            trend={{
              value: 2,
              isPositive: true
            }}
          />
          <StatCard
            title="Total Users"
            value={companyData._count?.users?.toString() || "0"}
            description="Staff members"
            icon={<Users className="h-6 w-6" />}
            trend={{
              value: 5,
              isPositive: true
            }}
          />
          <StatCard
            title="Total Pumps"
            value={(terminals.reduce((acc, terminal) => acc + (terminal._count?.pumps || 0), 0)).toString()}
            description="Across all terminals"
            icon={<GasPump className="h-6 w-6" />}
          />
          <StatCard
            title="Monthly Revenue"
            value="₦12.5M"
            description="Across all terminals"
            icon={<Wallet className="h-6 w-6" />}
            trend={{
              value: 8,
              isPositive: true
            }}
          />
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="terminals">Terminals</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue across all terminals</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <AreaChart 
                    data={salesData} 
                    xKey="name"
                    yKey="total"
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
                <CardTitle>Terminal Performance</CardTitle>
                <CardDescription>Comparing revenue across terminals</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart 
                  data={transformedTerminals?.map(terminal => ({
                    name: terminal.name,
                    total: Math.floor(Math.random() * 5000) + 1000
                  })) || []}
                  xKey="name"
                  yKey="total"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="terminals" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {transformedTerminals?.map((terminal) => (
                <Card key={terminal.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{terminal.name}</CardTitle>
                    <CardDescription>{terminal.location || "No location set"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pumps</p>
                        <p className="text-2xl font-bold">{terminal.pumps.count}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Tanks</p>
                        <p className="text-2xl font-bold">{terminal.tanks.count}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Staff</p>
                        <p className="text-2xl font-bold">{terminal.users.count}</p>
                      </div>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4">
                    <Link href={`/company-admin/terminals/${terminal.id}`}>
                      <Button variant="outline" className="w-full">
                        Manage Terminal
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
              
              <Card className="flex flex-col items-center justify-center p-6 border-dashed">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Add New Terminal</h3>
                <p className="text-center text-muted-foreground mb-4">
                  Set up a new filling station for your company
                </p>
                <Link href="/company-admin/terminals/new">
                  <Button>
                    <Building2 className="mr-2 h-4 w-4" />
                    Add Terminal
                  </Button>
                </Link>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trends</CardTitle>
                <CardDescription>Monthly sales data across all terminals</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <AreaChart 
                  data={salesData} 
                  xKey="name"
                  yKey="total"
                />
              </CardContent>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Product Distribution</CardTitle>
                  <CardDescription>Sales by product type</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <PieChart data={productSalesData} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Distribution by payment type</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <PieChart 
                    data={[
                      { name: "Cash", value: 60, color: "#4CAF50" },
                      { name: "POS", value: 25, color: "#2196F3" },
                      { name: "Transfer", value: 15, color: "#FF5722" }
                    ]} 
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

