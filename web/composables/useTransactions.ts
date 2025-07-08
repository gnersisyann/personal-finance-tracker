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

    const queryParams = new URLSearchParams();

    if (params?.categoryId) {
      queryParams.append("categoryId", params.categoryId.toString());
    }
    if (params?.startDate) {
      queryParams.append("startDate", params.startDate);
    }
    if (params?.endDate) {
      queryParams.append("endDate", params.endDate);
    }
    if (params?.search) {
      queryParams.append("search", params.search);
    }

    const url = `/transactions${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const data = await transactionsApi.getAll(params);

    transactions.value = data;
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to load transactions";
    console.error("Error loading transactions:", err);
  } finally {
    isLoading.value = false;
  }
}

export async function addTransaction(
  transaction: Pick<Transaction, "amount" | "categoryId" | "description">
) {
  try {
    isLoading.value = true;
    error.value = null;

    const newTransaction = await transactionsApi.create(transaction);
    transactions.value.unshift(newTransaction);

    return newTransaction;
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to add transaction";
    console.error("Error adding transaction:", err);
    throw err;
  } finally {
    isLoading.value = false;
  }
}

export async function updateTransaction(
  id: number,
  transaction: Pick<Transaction, "amount" | "categoryId" | "description">
) {
  try {
    const updatedTransaction = await transactionsApi.update(id, transaction);
    const index = transactions.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      transactions.value[index] = updatedTransaction;
    }
    return updatedTransaction;
  } catch (err) {
    console.error("Error updating transaction:", err);
    throw err;
  }
}

export async function removeTransaction(id: number) {
  try {
    await transactionsApi.delete(id);
    transactions.value = transactions.value.filter((t) => t.id !== id);
  } catch (err) {
    console.error("Error removing transaction:", err);
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
