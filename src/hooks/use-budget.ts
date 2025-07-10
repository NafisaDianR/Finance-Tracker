"use client"

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Budget, User, Transaction } from '@/types';

const isBrowser = typeof window !== 'undefined';

export function useBudget(user: User | null, transactions: Transaction[]) {
    const [budget, setBudget] = useState<Budget | null>(null);
    const storageKey = useMemo(() => user ? `budget_${user.id}` : null, [user]);
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    useEffect(() => {
        if (!isBrowser || !storageKey) {
            setBudget(null);
            return;
        }
        try {
            const item = window.localStorage.getItem(storageKey);
            const savedBudget = item ? JSON.parse(item) : null;
            if (savedBudget && savedBudget.month === currentMonth) {
                setBudget(savedBudget);
            } else {
                setBudget(null);
                 window.localStorage.removeItem(storageKey);
            }
        } catch (error) {
            console.error("Failed to parse budget from localStorage", error);
            setBudget(null);
        }
    }, [storageKey, currentMonth]);

    const saveBudget = useCallback((newBudget: Budget | null) => {
        if (!isBrowser || !storageKey) return;
        setBudget(newBudget);
        if (newBudget) {
            window.localStorage.setItem(storageKey, JSON.stringify(newBudget));
        } else {
            window.localStorage.removeItem(storageKey);
        }
    }, [storageKey]);

    const setMonthlyBudget = useCallback((amount: number) => {
        if (!user) return;
        if (amount > 0) {
            const newBudget: Budget = {
                userId: user.id,
                amount: amount,
                month: currentMonth,
            };
            saveBudget(newBudget);
        } else {
            saveBudget(null);
        }
    }, [user, currentMonth, saveBudget]);

    const monthlyExpenses = useMemo(() => {
        return transactions
            .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
            .reduce((sum, t) => sum + t.amount, 0);
    }, [transactions, currentMonth]);

    return { budget, setMonthlyBudget, monthlyExpenses };
}
