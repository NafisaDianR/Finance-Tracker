"use client"
import * as React from "react"
import Link from "next/link"
import { useRequireAdmin, useAuth } from "@/lib/auth"
import { getAllTransactions } from "@/hooks/use-transactions"
import { UserManagementTable } from "@/components/user-management-table"
import { SystemActivityTable } from "@/components/system-activity-table"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import type { User, Transaction } from "@/types"
import { UserNav } from "@/components/user-nav"

export default function AdminPage() {
    const adminUser = useRequireAdmin();
    const { getUsers, saveUsers } = useAuth();
    
    const [users, setUsers] = React.useState<User[]>([]);
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);

    React.useEffect(() => {
        if (adminUser) {
            setUsers(getUsers());
            setTransactions(getAllTransactions());
        }
    }, [adminUser, getUsers]);

    const handleDeleteUser = (userId: string) => {
        if (window.confirm("Are you sure you want to delete this user and all their data? This cannot be undone.")) {
            let updatedUsers = getUsers().filter(u => u.id !== userId);
            saveUsers(updatedUsers);
            setUsers(updatedUsers);

            if (typeof window !== 'undefined') {
                localStorage.removeItem(`transactions_${userId}`);
                localStorage.removeItem(`budget_${userId}`);
            }
            setTransactions(getAllTransactions());
            alert("User deleted successfully.");
        }
    };

    if (!adminUser) {
        return <div className="flex h-screen items-center justify-center"><p>Loading...</p></div>;
    }

    return (
        <div className="min-h-screen w-full bg-secondary/50">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                 <header className="mb-8 flex items-center justify-between">
                    <h1 className="font-headline text-3xl font-bold text-foreground sm:text-4xl">
                        Admin Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="outline">
                                <Home className="mr-2 h-4 w-4" />
                                Back to App
                            </Button>
                        </Link>
                         <UserNav />
                    </div>
                </header>
                <main className="space-y-8">
                    <UserManagementTable users={users} onDeleteUser={handleDeleteUser} />
                    <SystemActivityTable transactions={transactions} />
                </main>
            </div>
        </div>
    )
}
