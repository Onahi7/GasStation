"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardLayout } from "@/components/dashboard-layout"
import type { User, Terminal } from "@/lib/types"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [terminals, setTerminals] = useState<Terminal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // New user form state
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("worker")
  const [terminalId, setTerminalId] = useState("")

  const { toast } = useToast()

  // Create a Supabase client
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)

      // Get current user to get company_id
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Get user details including company_id
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("company_id")
        .eq("id", user.id)
        .single()

      if (userError || !userData) {
        console.error("Error fetching user data:", userError)
        return
      }

      const companyId = userData.company_id

      // Get all users for this company
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .eq("company_id", companyId)
        .order("full_name")

      if (usersError) {
        console.error("Error fetching users:", usersError)
      } else {
        setUsers(usersData || [])
      }

      // Get terminals for this company
      const { data: terminalsData, error: terminalsError } = await supabase
        .from("terminals")
        .select("*")
        .eq("company_id", companyId)
        .order("name")

      if (terminalsError) {
        console.error("Error fetching terminals:", terminalsError)
      } else {
        setTerminals(terminalsData || [])
        if (terminalsData && terminalsData.length > 0) {
          setTerminalId(terminalsData[0].id)
        }
      }

      setIsLoading(false)
    }

    loadData()
  }, [])

  const resetForm = () => {
    setFullName("")
    setEmail("")
    setPassword("")
    setRole("worker")
    if (terminals.length > 0) {
      setTerminalId(terminals[0].id)
    } else {
      setTerminalId("")
    }
    setSelectedUser(null)
  }

  const handleAddUser = async () => {
    try {
      setIsLoading(true)

      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error("Failed to create user account")
      }

      // Get current user to get company_id
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      // Get user details including company_id
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("company_id")
        .eq("id", user.id)
        .single()

      if (userError || !userData) {
        throw new Error("Error fetching company data")
      }

      // 2. Create user record
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          full_name: fullName,
          email,
          role,
          company_id: userData.company_id,
          terminal_id: terminalId,
          is_company_admin: role === "admin",
        },
      ])

      if (insertError) {
        throw new Error(insertError.message)
      }

      // 3. Refresh user list
      const { data: usersData } = await supabase
        .from("users")
        .select("*")
        .eq("company_id", userData.company_id)
        .order("full_name")

      setUsers(usersData || [])

      toast({
        title: "Success",
        description: "User has been added successfully",
      })

      setIsAddingUser(false)
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setFullName(user.full_name)
    setEmail(user.email)
    setRole(user.role)
    setTerminalId(user.terminal_id || "")
    setIsEditingUser(true)
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      setIsLoading(true)

      // Update user record
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          role,
          terminal_id: terminalId,
          is_company_admin: role === "admin",
        })
        .eq("id", selectedUser.id)

      if (updateError) {
        throw new Error(updateError.message)
      }

      // Get current user to get company_id
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      // Get user details including company_id
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("company_id")
        .eq("id", user.id)
        .single()

      if (userError || !userData) {
        throw new Error("Error fetching company data")
      }

      // Refresh user list
      const { data: usersData } = await supabase
        .from("users")
        .select("*")
        .eq("company_id", userData.company_id)
        .order("full_name")

      setUsers(usersData || [])

      toast({
        title: "Success",
        description: "User has been updated successfully",
      })

      setIsEditingUser(false)
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      setIsLoading(true)

      // Delete user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId)

      if (authError) {
        throw new Error(authError.message)
      }

      // Delete user record
      const { error: deleteError } = await supabase.from("users").delete().eq("id", userId)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      // Refresh user list
      setUsers(users.filter((user) => user.id !== userId))

      toast({
        title: "Success",
        description: "User has been deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout role="admin">
      <DashboardHeader title="User Management" description="Add, edit, and manage users for your company">
        <Button onClick={() => setIsAddingUser(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Users</CardTitle>
            <CardDescription>Manage all users across your terminals</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Terminal</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No users found. Add your first user to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>
                          {terminals.find((t) => t.id === user.terminal_id)?.name || "Not assigned"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account for your company</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worker">Worker</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="terminal">Terminal</Label>
              <Select value={terminalId} onValueChange={setTerminalId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select terminal" />
                </SelectTrigger>
                <SelectContent>
                  {terminals.map((terminal) => (
                    <SelectItem key={terminal.id} value={terminal.id}>
                      {terminal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingUser(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details and permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editFullName">Full Name</Label>
              <Input id="editFullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input id="editEmail" type="email" value={email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editRole">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worker">Worker</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editTerminal">Terminal</Label>
              <Select value={terminalId} onValueChange={setTerminalId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select terminal" />
                </SelectTrigger>
                <SelectContent>
                  {terminals.map((terminal) => (
                    <SelectItem key={terminal.id} value={terminal.id}>
                      {terminal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingUser(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

