"use client"
import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, UserCheck } from "lucide-react"
import type { User } from "@/types"

interface UserManagementTableProps {
    users: User[];
    onDeleteUser: (userId: string) => void;
}

export function UserManagementTable({ users, onDeleteUser }: UserManagementTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="font-mono text-xs">{user.id}</TableCell>
                <TableCell>
                    {user.isAdmin ? (
                        <span className="flex items-center gap-1 font-semibold text-accent"><UserCheck size={16} /> Admin</span>
                    ) : (
                        'User'
                    )}
                </TableCell>
                <TableCell className="text-right">
                  {!user.isAdmin && (
                    <Button variant="destructive" size="icon" onClick={() => onDeleteUser(user.id)} title="Delete User">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
