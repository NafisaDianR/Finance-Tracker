"use client"

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Transaction, User } from '@/types';

const isBrowser = typeof window !== 'undefined';

export function useTransactions(user: User | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const storageKey = useMemo(() => user ? `transactions_${user.id}` : null, [user]);

  useEffect(() => {
    if (!isBrowser || !storageKey) {
      setTransactions([]);
      return;
    };
    try {
      const item = window.localStorage.getItem(storageKey);
      setTransactions(item ? JSON.parse(item) : []);
    } catch (error) {
      console.error("Failed to parse transactions from localStorage", error);
      setTransactions([]);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isBrowser || !storageKey) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(transactions));
    } catch (error) {
      console.error("Failed to save transactions to localStorage", error);
    }
  }, [transactions, storageKey]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'date' | 'userId'>) => {
    if (!user) return;
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      userId: user.id,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, [user]);
  
  const userTransactions = useMemo(() => {
    return transactions;
  }, [transactions]);

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;

    for (const transaction of userTransactions) {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    }

    const balance = totalIncome - totalExpenses;
    return { totalIncome, totalExpenses, balance };
  }, [userTransactions]);
  
  return { transactions: userTransactions, addTransaction, balance, totalIncome, totalExpenses };
}

export const getAllTransactions = (): Transaction[] => {
    if (!isBrowser) return [];
    const allTransactions: Transaction[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('transactions_')) {
            const items = JSON.parse(localStorage.getItem(key) || '[]');
            allTransactions.push(...items);
        }
    }
    return allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
