"use client"

import { PlusCircle, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useRequireAuth } from "@/lib/auth"
import { useTransactions } from "@/hooks/use-transactions"
import { AddTransactionSheet } from "@/components/add-transaction-sheet"
import { BalanceCards } from "@/components/balance-cards"
import { TransactionHistoryTable } from "@/components/transaction-history-table"
import { Button } from "@/components/ui/button"
import { BudgetTracker } from "@/components/budget-tracker"
import { MonthlyOverviewChart } from "@/components/monthly-overview-chart"
import { UserNav } from "@/components/user-nav"
import { Logo } from "@/components/logo"

export default function DashboardPage() {
  const user = useRequireAuth();
  const { transactions, addTransaction, balance, totalIncome, totalExpenses } = useTransactions(user);

  if (!user) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-secondary/50">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <h1 className="font-headline text-3xl font-bold text-foreground sm:text-4xl">
              Finance Tracker
            </h1>
            {user.isAdmin && (
              <Link href="/admin">
                  <Button variant="outline" size="sm">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
              <AddTransactionSheet addTransaction={addTransaction}>
                <Button variant="default" size="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add Transaction
                </Button>
              </AddTransactionSheet>
              <UserNav />
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <BalanceCards
                    balance={balance}
                    totalIncome={totalIncome}
                    totalExpenses={totalExpenses}
                />
                 <TransactionHistoryTable transactions={transactions} />
            </div>
            <div className="lg:col-span-1 space-y-8">
                <BudgetTracker user={user} transactions={transactions} />
                <MonthlyOverviewChart transactions={transactions} />
            </div>
        </main>
      </div>
    </div>
  );
}
