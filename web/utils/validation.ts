import type { Transaction, Category } from "~/types";

export function validateTransaction(tx: Partial<Transaction>): string | null {
  if (
    tx.amount === undefined ||
    tx.amount === null ||
    tx.categoryId === null ||
    tx.categoryId === undefined ||
    tx.description === null ||
    tx.categoryId === undefined
  ) {
    return null;
  }
  if (
    tx.amount === undefined ||
    tx.amount === null ||
    isNaN(Number(tx.amount))
  ) {
    return "Amount must be a valid number";
  }
  if (tx.amount <= 0) {
    return "Amount must be positive";
  }
  if (!tx.categoryId && tx.categoryId !== 0) {
    return "Category is required";
  }
  if (!tx.date || isNaN(Date.parse(tx.date))) {
    return "Date is required and must be valid";
  }
  if (
    !tx.description ||
    (tx.description.trim().length < 2 && tx.description.trim().length > 0)
  ) {
    return "Description is required (min 2 characters)";
  }
  return null;
}

export function validateCategory(cat: Partial<Category>): string | null {
  if (!cat.name || cat.name.trim().length < 2) {
    return "Category name is required (min 2 characters)";
  }
  return null;
}
