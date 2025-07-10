export type TransactionType = "income" | "expense";

export type ExpenseCategory =
  | "Food"
  | "Transport"
  | "Housing"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Other";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  category?: ExpenseCategory;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
}

export interface Budget {
  userId: string;
  amount: number;
  month: string; // "YYYY-MM"
}
