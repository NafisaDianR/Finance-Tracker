"use client"

import * as React from "react"
import { useBudget } from "@/hooks/use-budget"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import type { User, Transaction } from "@/types"
import { Goal } from "lucide-react"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface BudgetTrackerProps {
    user: User | null;
    transactions: Transaction[];
}

export function BudgetTracker({ user, transactions }: BudgetTrackerProps) {
    const { budget, setMonthlyBudget, monthlyExpenses } = useBudget(user, transactions);
    const [newBudgetAmount, setNewBudgetAmount] = React.useState("");
    const { toast } = useToast();
    const budgetAmount = budget?.amount ?? 0;
    const progress = budgetAmount > 0 ? Math.min((monthlyExpenses / budgetAmount) * 100, 100) : 0;
    
    const alertSent80 = React.useRef(false);
    const alertSent100 = React.useRef(false);

    React.useEffect(() => {
        if(budgetAmount <= 0) return;

        const expenseRatio = monthlyExpenses / budgetAmount;

        if (expenseRatio >= 1 && !alertSent100.current) {
            toast({
                variant: "destructive",
                title: "Budget Exceeded",
                description: `You have exceeded your monthly budget of ${formatCurrency(budgetAmount)}.`,
            });
            alertSent100.current = true;
        } else if (expenseRatio >= 0.8 && !alertSent80.current) {
             toast({
                title: "Budget Warning",
                description: `You have used 80% of your monthly budget of ${formatCurrency(budgetAmount)}.`,
            });
            alertSent80.current = true;
        }
        
        if (alertSent100.current && expenseRatio < 1) alertSent100.current = false;
        if (alertSent80.current && expenseRatio < 0.8) alertSent80.current = false;

    }, [monthlyExpenses, budgetAmount, toast]);

    const handleSetBudget = () => {
        const amount = parseFloat(newBudgetAmount);
        if (!isNaN(amount) && amount > 0) {
            setMonthlyBudget(amount);
            setNewBudgetAmount("");
        } else {
            toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a valid positive number for the budget." });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Goal /> Monthly Budget</CardTitle>
                <CardDescription>
                    Set a monthly budget to track your spending.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {budget ? (
                    <div>
                        <div className="flex justify-between items-baseline mb-2">
                           <p className="text-muted-foreground">
                                Spent: <span className="font-bold text-foreground">{formatCurrency(monthlyExpenses)}</span>
                           </p>
                           <p className="text-sm text-muted-foreground">
                                Budget: {formatCurrency(budget.amount)}
                           </p>
                        </div>
                        <Progress value={progress} className={progress > 80 ? '[&>div]:bg-destructive' : ''} />
                        <div className="flex justify-between items-baseline mt-1 text-sm">
                           <p className={progress > 80 ? 'text-destructive' : 'text-muted-foreground'}>{progress.toFixed(0)}%</p>
                           <p className="text-muted-foreground">
                            Remaining: <span className="font-bold text-foreground">{formatCurrency(budget.amount - monthlyExpenses)}</span>
                           </p>
                        </div>
                         <Button variant="outline" size="sm" onClick={() => setMonthlyBudget(0)} className="mt-4">
                            Reset Budget
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="e.g., 5000000"
                            value={newBudgetAmount}
                            onChange={(e) => setNewBudgetAmount(e.target.value)}
                        />
                        <Button onClick={handleSetBudget}>Set Budget</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
