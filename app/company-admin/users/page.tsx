"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/hooks/use-auth"
import { Plus, Edit, Trash2 } from "lucide-react"
import { getUsers, createUser, updateUser, deleteUser } from "@/app/actions/users"
import { getTerminals } from "@/app/actions/terminals"
import { UserRole } from "@prisma/client"

interface UIUser {
  id: string
  name: string | null
  email: string
  role: UserRole
  terminalId: string | null
  createdAt: Date
  updatedAt: Date
}

interface UITerminal {
  id: string
  name: string
  location: string
  companyId: string
  createdAt: Date
  updatedAt: Date
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UIUser[]>([])
  const [terminals, setTerminals] = useState<UITerminal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UIUser | null>(null)
  const { user: currentUser } = useAuth()
  const { toast } = useToast()

  // Form state
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [terminalId, setTerminalId] = useState("")

  useEffect(() => {
    async function loadData() {
      if (!currentUser?.id) {
        toast({
          title: "Error",
          description: "No user found. Please log in again.",
          variant: "destructive",
        })
        return
      }

      setIsLoading(true)
      try {
        // Get terminal managers for the company
        const usersData = await getUsers(currentUser.companyId)
        const terminalsData = await getTerminals(currentUser.companyId)
        
        setUsers(usersData)
        setTerminals(terminalsData)

        if (terminalsData.length > 0) {
          setTerminalId(terminalsData[0].id)
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [currentUser?.id, toast])

  const resetForm = () => {
    setFullName("")
    setEmail("")
    setPassword("")
    setTerminalId(terminals[0]?.id || "")
    setSelectedUser(null)
  }

  const handleAddUser = async () => {
    if (!currentUser?.companyId || !terminalId) {
      toast({
        title: "Error",
        description: "Missing required information",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      await createUser({
        name: fullName,
        email,
        password,
        role: UserRole.COMPANY_ADMIN,
        companyId: currentUser.companyId,
        terminalId,
      })

      const usersData = await getUsers(currentUser.companyId)
      setUsers(usersData)
      
      toast({
        title: "Success",
        description: "Terminal manager has been added successfully",
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

  const handleEditUser = (user: UIUser) => {
    setSelectedUser(user)
    setFullName(user.name || "")
    setEmail(user.email)
    setTerminalId(user.terminalId || "")
    setIsEditingUser(true)
  }

  const handleUpdateUser = async () => {
    if (!selectedUser || !currentUser?.companyId) return

    try {
      setIsLoading(true)
      await updateUser(selectedUser.id, {
        name: fullName,
        role: UserRole.COMPANY_ADMIN,
        terminalId,
      })

      const usersData = await getUsers(currentUser.companyId)
      setUsers(usersData)
      
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
    if (!currentUser?.companyId) return
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      setIsLoading(true)
      await deleteUser(userId)

      const usersData = await getUsers(currentUser.companyId)
      setUsers(usersData)
      
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
      <DashboardHeader title="Terminal Managers" description="Add and manage terminal managers for your company">
        <Button onClick={() => setIsAddingUser(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Terminal Manager
        </Button>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Terminal Managers</CardTitle>
            <CardDescription>Manage terminal managers across your locations</CardDescription>
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
                    <TableHead>Terminal</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No terminal managers found. Add your first terminal manager to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users
                      .filter(user => user.role === UserRole.COMPANY_ADMIN)
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {terminals.find((t) => t.id === user.terminalId)?.name || "Not assigned"}
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
            <DialogTitle>Add Terminal Manager</DialogTitle>
            <DialogDescription>Create a new terminal manager account</DialogDescription>
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
              {isLoading ? "Adding..." : "Add Terminal Manager"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Terminal Manager</DialogTitle>
            <DialogDescription>Update terminal manager details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editFullName">Full Name</Label>
              <Input
                id="editFullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input id="editEmail" type="email" value={email} disabled />
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
              {isLoading ? "Updating..." : "Update Terminal Manager"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

