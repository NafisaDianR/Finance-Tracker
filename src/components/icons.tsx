import {
  LucideIcon,
  Utensils,
  Car,
  Home,
  ShoppingBag,
  Film,
  HeartPulse,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  ArrowDownUp
} from "lucide-react";
import type { ExpenseCategory, TransactionType } from "@/types";

export const CategoryIcons: Record<ExpenseCategory, LucideIcon> = {
  Food: Utensils,
  Transport: Car,
  Housing: Home,
  Shopping: ShoppingBag,
  Entertainment: Film,
  Health: HeartPulse,
  Other: MoreHorizontal,
};

export const TransactionTypeIcons: Record<TransactionType | 'all', LucideIcon> = {
    income: TrendingUp,
    expense: TrendingDown,
    all: ArrowDownUp
};
