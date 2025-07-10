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
import { TransactionTypeIcons } from "./icons"
import type { Transaction } from "@/types"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SystemActivityTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System-Wide Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p>No transactions in the system yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => {
                const TypeIcon = TransactionTypeIcons[t.type];
                return (
                  <TableRow key={t.id}>
                    <TableCell>
                      <TypeIcon className={`h-5 w-5 ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                    </TableCell>
                    <TableCell className="font-medium">{t.description}</TableCell>
                    <TableCell className="font-mono text-xs">{t.userId}</TableCell>
                    <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                    <TableCell className={`text-right font-mono ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
