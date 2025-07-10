"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Transaction, ExpenseCategory } from "@/types"
import { CategoryIcons } from "./icons"

const formSchema = z.object({
  type: z.enum(["income", "expense"], { required_error: "Please select a transaction type." }),
  description: z.string().min(2, "Description must be at least 2 characters.").max(100),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  category: z.string().optional(),
}).refine(data => data.type === 'income' || (data.type === 'expense' && !!data.category), {
  message: "Category is required for expenses.",
  path: ["category"],
});

type FormValues = z.infer<typeof formSchema>

const expenseCategories: ExpenseCategory[] = [
  "Food", "Transport", "Housing", "Shopping", "Entertainment", "Health", "Other"
];

interface AddTransactionSheetProps {
  children: React.ReactNode
  addTransaction: (transaction: Omit<Transaction, "id" | "date" | "userId">) => void
}

export function AddTransactionSheet({ children, addTransaction }: AddTransactionSheetProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      description: "",
      amount: 0,
    },
  })
  
  const transactionType = form.watch("type");

  function onSubmit(values: FormValues) {
    addTransaction({
        ...values,
        category: values.type === 'expense' ? (values.category as ExpenseCategory) : undefined,
    });
    toast({
      title: "Success!",
      description: "Your transaction has been added.",
    })
    form.reset()
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add a new transaction</SheetTitle>
          <SheetDescription>
            Enter the details of your income or expense. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Transaction Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="income" />
                        </FormControl>
                        <FormLabel className="font-normal">Income</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="expense" />
                        </FormControl>
                        <FormLabel className="font-normal">Expense</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Groceries, Salary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {transactionType === 'expense' && (
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {expenseCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            <div className="flex items-center">
                              {React.createElement(CategoryIcons[cat], { className: "mr-2 h-4 w-4"})}
                              {cat}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <SheetFooter>
                <SheetClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </SheetClose>
                <Button type="submit">Save Transaction</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
