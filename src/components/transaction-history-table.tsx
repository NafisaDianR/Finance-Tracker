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
import { Badge } from "@/components/ui/badge"
import { CategoryIcons, TransactionTypeIcons } from "./icons"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import type { Transaction } from "@/types"

type SortKey = keyof Transaction | null;
type SortDirection = 'asc' | 'desc';

const formatCurrency = (amount: number, type: 'income' | 'expense') => {
  const sign = type === 'income' ? '+' : '-';
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `${sign} ${formatted}`;
}

export function TransactionHistoryTable({ transactions }: { transactions: Transaction[] }) {
  const [sortKey, setSortKey] = React.useState<SortKey>('date');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedTransactions = React.useMemo(() => {
    if (!sortKey) return transactions;

    return [...transactions].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }

      return sortDirection === 'desc' ? comparison * -1 : comparison;
    });
  }, [transactions, sortKey, sortDirection]);

  const SortableHeader = ({ tKey, children }: { tKey: SortKey, children: React.ReactNode }) => (
    <TableHead>
      <Button variant="ghost" onClick={() => handleSort(tKey)}>
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p>No transactions yet.</p>
            <p>Add one to get started!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <SortableHeader tKey="description">Description</SortableHeader>
                <SortableHeader tKey="category">Category</SortableHeader>
                <SortableHeader tKey="date">Date</SortableHeader>
                <SortableHeader tKey="amount">Amount</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((t) => {
                const TypeIcon = TransactionTypeIcons[t.type];
                return (
                  <TableRow key={t.id}>
                    <TableCell>
                      <TypeIcon className={`h-5 w-5 ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                    </TableCell>
                    <TableCell className="font-medium">{t.description}</TableCell>
                    <TableCell>
                      {t.category && (
                        <Badge variant="secondary" className="flex items-center w-fit">
                          {React.createElement(CategoryIcons[t.category], { className: "mr-1 h-4 w-4" })}
                          {t.category}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                    <TableCell className={`font-mono ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(t.amount, t.type)}
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
