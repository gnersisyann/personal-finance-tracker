import { ref } from "vue";
import type { Transaction } from "~/types";

const transactions = ref<Transaction[]>([]);

export function addTransaction(transaction: Transaction) {
  transactions.value.push(transaction);
}

export function removeTransaction(id: number) {
  transactions.value = transactions.value.filter((t) => t.id !== id);
}

export function removeCategoryTransaction(cat: number) {
  transactions.value = transactions.value.filter((t) => t.categoryId !== cat);
}

export function useTransactions() {
  return {
    transactions,
    addTransaction,
    removeTransaction,
    removeCategoryTransaction,
  };
}
