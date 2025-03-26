import { redirect } from "next/navigation"
import { getUserRole } from "@/app/actions/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { AreaChart } from "@/components/charts/area-chart"
import { StatCard } from "@/components/stat-card"
import { Building2, Users, FuelIcon as GasPump, Wallet, TrendingUp } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function CompanyAdminDashboard() {
  const user = await getUserRole()
  
  if (!user || !user.isCompanyAdmin) {
    redirect("/unauthorized")
  }
  
  const supabase = createServerSupabaseClient()
  
  // Get company details
  const { data: companyData, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .eq("id", user.companyId)
    .single()
  
  if (companyError || !companyData) {
    console.error("Error fetching company data:", companyError)
    redirect("/login")
  }
  
  // Get terminals count
  const { count: terminalsCount, error: terminalsError } = await supabase
    .from("terminals")
    .select("*", { count: "exact", head: true })
    .eq("company_id", user.companyId)
  
  // Get users count
  const { count: usersCount, error: usersError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("company_id", user.companyId)
  
  // Get terminals with stats
  const { data: terminals, error: terminalStatsError } = await supabase
    .from("terminals")
    .select(`
      id,
      name,
      location,
      pumps:pumps(count),
      tanks:tanks(count),
      users:users(count)
    `)
    .eq("company_id", user.companyId)
  
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
    { name: "PMS", value: 40 },
    { name: "AGO", value: 30 },
    { name: "DPK", value: 20 },
    { name: "LPG", value: 10 },
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
            value={terminalsCount || 0}
            description="Active filling stations"
            icon={<Building2 className="h-6 w-6" />}
            trend="+2 this month"
            trendUp={true}
          />
          <StatCard
            title="Total Users"
            value={usersCount || 0}
            description="Staff members"
            icon={<Users className="h-6 w-6" />}
            trend="+5 this month"
            trendUp={true}
          />
          <StatCard
            title="Total Pumps"
            value={terminals?.reduce((acc, terminal) => acc + terminal.pumps.count, 0) || 0}
            description="Across all terminals"
            icon={<GasPump className="h-6 w-6" />}
            trend="No change"
            trendUp={null}
          />
          <StatCard
            title="Monthly Revenue"
            value="₦12.5M"
            description="Across all terminals"
            icon={<Wallet className="h-6 w-6" />}
            trend="+8% from last month"
            trendUp={true}
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
                  <AreaChart data={salesData} />
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
                  data={terminals?.map(terminal => ({
                    name: terminal.name,
                    total: Math.floor(Math.random() * 5000) + 1000
                  })) || []} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="terminals" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {terminals?.map((terminal) => (
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
                <AreaChart data={salesData} />
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
                      { name: "Cash", value: 60 },
                      { name: "POS", value: 25 },
                      { name: "Transfer", value: 15 }
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

