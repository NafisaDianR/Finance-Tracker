"use client"

import * as React from "react"
import { format, subDays, eachDayOfInterval, eachMonthOfInterval } from "date-fns"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Transaction } from "@/types"
import { CalendarClock } from "lucide-react"

const formatCurrencyCompact = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: 'compact'
  }).format(amount);
}

const formatCurrencyFull = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

type OverviewRange = 'weekly' | 'monthly';

interface MonthlyOverviewChartProps {
    transactions: Transaction[];
}

export function MonthlyOverviewChart({ transactions }: MonthlyOverviewChartProps) {
    const [timeRange, setTimeRange] = React.useState<OverviewRange>('monthly');

    const chartData = React.useMemo(() => {
        const data: { [key: string]: { income: number, expense: number } } = {};
        const now = new Date();

        if (timeRange === 'weekly') {
            const last7Days = eachDayOfInterval({
                start: subDays(now, 6),
                end: now
            });
            
            last7Days.forEach(day => {
                const dayKey = format(day, 'yyyy-MM-dd');
                data[dayKey] = { income: 0, expense: 0 };
            });

            transactions.forEach(t => {
                const transactionDate = new Date(t.date);
                const dayKey = format(transactionDate, 'yyyy-MM-dd');
                if (data[dayKey]) {
                    if (t.type === 'income') {
                        data[dayKey].income += t.amount;
                    } else {
                        data[dayKey].expense += t.amount;
                    }
                }
            });

            return Object.entries(data).map(([date, values]) => ({
                name: format(new Date(date), 'EEE'),
                ...values
            }));
        }

        if (timeRange === 'monthly') {
            const today = new Date();
            for (let i = 5; i >= 0; i--) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthKey = format(d, 'yyyy-MM');
                data[monthKey] = { income: 0, expense: 0 };
            }

            transactions.forEach(t => {
                const month = t.date.slice(0, 7);
                if (data[month]) {
                    if (t.type === 'income') {
                        data[month].income += t.amount;
                    } else {
                        data[month].expense += t.amount;
                    }
                }
            });

            return Object.entries(data).map(([month, values]) => ({
                name: format(new Date(month), 'MMM'),
                ...values
            }));
        }

        return [];
    }, [transactions, timeRange]);

    const descriptionText = {
        weekly: "Income vs. Expense for the last 7 days.",
        monthly: "Income vs. Expense for the last 6 months.",
    };

    if (transactions.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2"><CalendarClock /> Overview</CardTitle>
                        <CardDescription>{descriptionText[timeRange]}</CardDescription>
                    </div>
                    <Tabs defaultValue="monthly" onValueChange={(value) => setTimeRange(value as OverviewRange)} className="w-full md:w-auto">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="weekly">Weekly</TabsTrigger>
                            <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[250px] w-full">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={(value) => formatCurrencyCompact(value as number)} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            content={<ChartTooltipContent 
                                formatter={(value, name) => (
                                    <div className="flex flex-col">
                                        <span className="capitalize">{name}</span>
                                        <span className="font-bold">{formatCurrencyFull(value as number)}</span>
                                    </div>
                                )}
                             />}
                        />
                        <Bar dataKey="income" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
