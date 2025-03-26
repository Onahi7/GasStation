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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Upload, RefreshCw, Search, MoreHorizontal, UserPlus, Key, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [openAddUser, setOpenAddUser] = useState(false)
  const [openPermissions, setOpenPermissions] = useState(false)
  const [openResetPassword, setOpenResetPassword] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // Sample data
  const users = [
    {
      id: "USR001",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Worker",
      status: "Active",
      lastLogin: "Today, 10:30 AM",
      assignedPumps: "PMS1, PMS2",
    },
    {
      id: "USR002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Worker",
      status: "Active",
      lastLogin: "Today, 9:15 AM",
      assignedPumps: "AGO1",
    },
    {
      id: "USR003",
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      role: "Manager",
      status: "Active",
      lastLogin: "Yesterday, 6:45 PM",
      assignedPumps: "N/A",
    },
    {
      id: "USR004",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      role: "Finance",
      status: "Active",
      lastLogin: "Today, 11:20 AM",
      assignedPumps: "N/A",
    },
    {
      id: "USR005",
      name: "Robert Brown",
      email: "robert.brown@example.com",
      role: "Auditor",
      status: "Active",
      lastLogin: "2 days ago",
      assignedPumps: "N/A",
    },
    {
      id: "USR006",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: "Worker",
      status: "Inactive",
      lastLogin: "1 week ago",
      assignedPumps: "None",
    },
    {
      id: "USR007",
      name: "David Wilson",
      email: "david.wilson@example.com",
      role: "Admin",
      status: "Active",
      lastLogin: "Today, 8:00 AM",
      assignedPumps: "N/A",
    },
  ]

  return (
    <DashboardLayout role="admin">
      <DashboardHeader title="User Management" description="Add, edit, and manage user accounts and permissions">
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
          <Dialog open={openAddUser} onOpenChange={setOpenAddUser}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account with specific role and permissions.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Full Name
                  </Label>
                  <Input id="name" placeholder="John Doe" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="manager">Station Manager</SelectItem>
                      <SelectItem value="finance">Finance Officer</SelectItem>
                      <SelectItem value="worker">Station Worker</SelectItem>
                      <SelectItem value="auditor">Auditor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input id="password" type="password" placeholder="••••••••" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="confirm" className="text-right">
                    Confirm Password
                  </Label>
                  <Input id="confirm" type="password" placeholder="••••••••" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch id="status" defaultChecked />
                    <Label htmlFor="status">Active</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenAddUser(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpenAddUser(false)}>Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="admin">Administrators</TabsTrigger>
              <TabsTrigger value="manager">Managers</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
              <TabsTrigger value="worker">Workers</TabsTrigger>
              <TabsTrigger value="auditor">Auditors</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search users..." className="w-[200px] pl-8 md:w-[300px]" />
              </div>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage all user accounts in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Last Login
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src="/placeholder.svg" alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-muted-foreground">{user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">{user.email}</td>
                          <td className="p-4 align-middle">{user.role}</td>
                          <td className="p-4 align-middle">
                            <Badge
                              variant={user.status === "Active" ? "default" : "secondary"}
                              className={user.status === "Active" ? "bg-green-500" : "bg-gray-500"}
                            >
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">{user.lastLogin}</td>
                          <td className="p-4 align-middle">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setOpenPermissions(true)}>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Edit Permissions
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setOpenResetPassword(true)}>
                                  <Key className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Deactivate User</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="worker" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Station Workers</CardTitle>
                <CardDescription>Manage station worker accounts and pump assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Assigned Pumps
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Last Login
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {users
                        .filter((user) => user.role === "Worker")
                        .map((user) => (
                          <tr
                            key={user.id}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage src="/placeholder.svg" alt={user.name} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-xs text-muted-foreground">{user.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">{user.email}</td>
                            <td className="p-4 align-middle">
                              <Badge
                                variant={user.status === "Active" ? "default" : "secondary"}
                                className={user.status === "Active" ? "bg-green-500" : "bg-gray-500"}
                              >
                                {user.status}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle">{user.assignedPumps}</td>
                            <td className="p-4 align-middle">{user.lastLogin}</td>
                            <td className="p-4 align-middle">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>Assign Pumps</DropdownMenuItem>
                                  <DropdownMenuItem>View Performance</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Edit User</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Deactivate User</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Similar TabsContent for other roles */}
        </Tabs>

        {/* Permission Dialog */}
        <Dialog open={openPermissions} onOpenChange={setOpenPermissions}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit User Permissions</DialogTitle>
              <DialogDescription>Modify permissions for this user account.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">User: John Doe (Worker)</h3>
              </div>
              {[
                { name: "View Dashboard", description: "Access to worker dashboard" },
                { name: "Record Meter Readings", description: "Record pump meter readings" },
                { name: "Submit Sales", description: "Submit daily sales records" },
                { name: "View Performance", description: "Access to personal performance metrics" },
                { name: "View Shift Schedule", description: "Access to shift schedules" },
              ].map((permission, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <div className="font-medium">{permission.name}</div>
                    <div className="text-sm text-muted-foreground">{permission.description}</div>
                  </div>
                  <Switch defaultChecked={i < 4} />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenPermissions(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpenPermissions(false)}>Save Permissions</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog open={openResetPassword} onOpenChange={setOpenResetPassword}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reset User Password</DialogTitle>
              <DialogDescription>Set a new password for this user account.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="mb-2">
                <h3 className="text-sm font-medium">User: John Doe (john.doe@example.com)</h3>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPassword" className="text-right">
                  New Password
                </Label>
                <Input id="newPassword" type="password" placeholder="••••••••" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirmPassword" className="text-right">
                  Confirm Password
                </Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="sendEmail" />
                    <Label htmlFor="sendEmail">Send password reset email to user</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenResetPassword(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpenResetPassword(false)}>Reset Password</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

