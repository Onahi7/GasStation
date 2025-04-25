"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Plus, Edit, Trash2 } from "lucide-react"
import { UserRole } from "@prisma/client"
import { getUsers, createUser, updateUser, deleteUser } from "@/app/actions/users"

interface UIStaff {
  id: string
  name: string | null
  email: string
  role: UserRole
  companyId: string | null
  createdAt: Date
  updatedAt: Date
}

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<UIStaff[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingStaff, setIsAddingStaff] = useState(false)
  const [isEditingStaff, setIsEditingStaff] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<UIStaff | null>(null)
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  // Form state
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>(UserRole.WORKER)

  useEffect(() => {
    loadStaff()
  }, [currentUser?.id])

  const loadStaff = async () => {
    if (!currentUser?.id) {
      toast({
        title: "Error",
        description: "No user found. Please log in again.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const staffData = await getUsers(currentUser.companyId)
      setStaff(staffData)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load staff",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFullName("")
    setEmail("")
    setPassword("")
    setRole(UserRole.WORKER)
    setSelectedStaff(null)
  }

  const handleAddStaff = async () => {
    if (!currentUser?.companyId) {
      toast({
        title: "Error",
        description: "Missing required information",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true);
      await createUser({
        name: fullName,
        email,
        password,
        role,
        companyId: currentUser.companyId
      })

      const staffData = await getUsers(currentUser.companyId)
      setStaff(staffData)
      
      toast({
        title: "Success",
        description: "Staff member has been added successfully",
      })
      
      setIsAddingStaff(false)
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add staff member",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditStaff = (staff: UIStaff) => {
    setSelectedStaff(staff)
    setFullName(staff.name || "")
    setEmail(staff.email)
    setRole(staff.role)
    setIsEditingStaff(true)
  }

  const handleUpdateStaff = async () => {
    if (!selectedStaff || !currentUser?.companyId) return

    try {
      setIsLoading(true)      await updateUser(selectedStaff.id, {
        name: fullName,
        role
      })

      const staffData = await getUsers(currentUser.companyId)
      setStaff(staffData)
      
      toast({
        title: "Success",
        description: "Staff member has been updated successfully",
      })
      
      setIsEditingStaff(false)
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update staff member",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteStaff = async (staffId: string) => {
    if (!currentUser?.companyId) return
    if (!confirm("Are you sure you want to delete this staff member?")) return

    try {
      setIsLoading(true)
      await deleteUser(staffId)

      const staffData = await getUsers(currentUser.companyId)
      setStaff(staffData)
      
      toast({
        title: "Success",
        description: "Staff member has been deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete staff member",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout role="manager">
      <DashboardHeader title="Staff Management" description="Add and manage staff members">
        <Button onClick={() => setIsAddingStaff(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Staff Member
        </Button>
      </DashboardHeader>

      <div className="p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Staff Members</CardTitle>
            <CardDescription>Manage staff members at your terminal</CardDescription>
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No staff members found. Add your first staff member to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    staff.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditStaff(member)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteStaff(member.id)}>
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

      {/* Add Staff Dialog */}
      <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogDescription>Create a new staff member account</DialogDescription>
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
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.WORKER}>Worker</SelectItem>
                  <SelectItem value={UserRole.CASHIER}>Cashier</SelectItem>
                  <SelectItem value={UserRole.FINANCE}>Finance</SelectItem>
                  <SelectItem value={UserRole.AUDITOR}>Auditor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingStaff(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStaff} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Staff Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditingStaff} onOpenChange={setIsEditingStaff}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>Update staff member details</DialogDescription>
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
              <Label htmlFor="editRole">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.WORKER}>Worker</SelectItem>
                  <SelectItem value={UserRole.CASHIER}>Cashier</SelectItem>
                  <SelectItem value={UserRole.FINANCE}>Finance</SelectItem>
                  <SelectItem value={UserRole.AUDITOR}>Auditor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingStaff(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStaff} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Staff Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}