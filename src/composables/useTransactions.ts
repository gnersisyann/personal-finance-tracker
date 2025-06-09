import { ref } from "vue";

export type Transaction = {
  id: number;
  amount: number;
  category: number;
  date: string;
  description: string;
};

const transactions = ref<Transaction[]>([]);

export function addTransaction(transaction: Transaction) {
  transactions.value.push(transaction);
}

export function removeTransaction(id: number) {
  transactions.value = transactions.value.filter((t) => t.id !== id);
}

export function useTransactions() {
  return { transactions, addTransaction, removeTransaction };
}
