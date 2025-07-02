import { ref, readonly } from "vue";
import type { Transaction } from "~/types";
import { transactionsApi } from "~/services/api";

const transactions = ref<Transaction[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

async function loadTransactions(params?: {
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}) {
  try {
    isLoading.value = true;
    error.value = null;
    transactions.value = await transactionsApi.getAll(params);
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to load transactions";
    console.error("Failed to load transactions:", err);
  } finally {
    isLoading.value = false;
  }
}

export async function addTransaction(
  transaction: Pick<Transaction, "amount" | "categoryId" | "description">
) {
  try {
    error.value = null;
    const newTransaction = await transactionsApi.create(transaction);
    transactions.value.push(newTransaction);
    return newTransaction;
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to add transaction";
    console.error("Failed to add transaction:", err);
    throw err;
  }
}

export async function updateTransaction(
  id: number,
  transaction: Pick<Transaction, "amount" | "categoryId" | "description">
) {
  try {
    error.value = null;
    const updatedTransaction = await transactionsApi.update(id, transaction);
    const index = transactions.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      transactions.value[index] = updatedTransaction;
    }
    return updatedTransaction;
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to update transaction";
    console.error("Failed to update transaction:", err);
    throw err;
  }
}

export async function removeTransaction(id: number) {
  try {
    error.value = null;
    await transactionsApi.delete(id);
    transactions.value = transactions.value.filter((t) => t.id !== id);
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to remove transaction";
    console.error("Failed to remove transaction:", err);
    throw err;
  }
}

export function removeCategoryTransaction(categoryId: number) {
  transactions.value = transactions.value.filter(
    (t) => t.categoryId !== categoryId
  );
}

export function useTransactions() {
  return {
    transactions: readonly(transactions),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadTransactions,
    addTransaction,
    removeTransaction,
    updateTransaction,
    removeCategoryTransaction,
  };
}
