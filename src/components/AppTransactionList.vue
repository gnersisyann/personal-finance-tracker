<script setup lang="ts">
import { watch, ref } from "vue";
import { useTransactions } from "../composables/useTransactions.ts";
import { computed } from "vue";
import { useCategories } from "../composables/useCategories.ts";
import type { Transaction } from "../composables/useTransactions.ts";

const props = defineProps<{ selectedCategory: number | null }>();
const { categories, getCategory } = useCategories();

const isModalOpen = ref(false);
const editingTransaction = ref<Transaction | null>(null);
const error = ref("");

function openEditModal(transaction: Transaction) {
  editingTransaction.value = { ...transaction };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  editingTransaction.value = null;
}

const { transactions, removeTransaction } = useTransactions();
const filteredTransactions = computed(() =>
  props.selectedCategory == null
    ? transactions.value
    : transactions.value.filter((t) => t.category === props.selectedCategory)
);

const sortField = ref<"amount" | "category" | "description" | "date">("date");
const sortDirection = ref<"asc" | "desc">("asc");

const sortedTransactions = computed(() => {
  // Копируем массив, чтобы не мутировать исходный
  const arr = [...filteredTransactions.value];
  arr.sort((a, b) => {
    let aValue = a[sortField.value];
    let bValue = b[sortField.value];

    // Для сортировки по категории сравниваем числа, для остальных — строки или числа
    if (sortField.value === "category" || sortField.value === "amount") {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else if (sortField.value === "date") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else {
      // description — строка
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }

    if (aValue < bValue) return sortDirection.value === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection.value === "asc" ? 1 : -1;
    return 0;
  });
  return arr;
});

watch(
  () => editingTransaction.value,
  (val) => {
    if (!val) {
      error.value = "";
      return;
    }

    if (val.amount === null || isNaN(val.amount)) {
      error.value = "Amount must be a number";
      return;
    }

    if (val.amount <= 0) {
      error.value = "Invalid amount (must be positive)";
      return;
    }

    if (!val.description || val.description.trim() === "") {
      error.value = "Description is required";
      return;
    }

    error.value = "";
  },
  { deep: true }
);

function submitEdit() {
  if (!editingTransaction.value || error.value != "") return;
  const idx = transactions.value.findIndex(
    (t) => editingTransaction.value && t.id === editingTransaction.value.id
  );
  if (idx !== -1) {
    transactions.value[idx] = {
      ...transactions.value[idx],
      ...editingTransaction.value,
    };
  }
  closeModal();
}

function sortBy(by: "amount" | "category" | "description" | "date") {
  if (sortField.value == by) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = by;
    sortDirection.value = "asc";
  }
}
</script>

<template>
  <table border="1">
    <thead>
      <tr>
        <th @click="sortBy('amount')" style="cursor: pointer">Amount</th>
        <th @click="sortBy('category')" style="cursor: pointer">Category</th>
        <th @click="sortBy('description')" style="cursor: pointer">
          Description
        </th>
        <th @click="sortBy('date')" style="cursor: pointer">Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="transaction in sortedTransactions" :key="transaction.id">
        <td>{{ transaction.amount }}</td>
        <td>{{ getCategory(transaction.category) }}</td>
        <td>{{ transaction.description }}</td>
        <td>{{ new Date(transaction.date).toLocaleString() }}</td>
        <td>
          <button @click="removeTransaction(transaction.id)">Delete</button>
          <button v-if="!isModalOpen" @click="openEditModal(transaction)">
            Edit
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-if="isModalOpen && editingTransaction" class="modal">
    <form @submit.prevent="submitEdit">
      <div>
        <input
          v-model.number="editingTransaction.amount"
          placeholder="Amount"
        />
      </div>
      <div>
        <select v-model.number="editingTransaction.category">
          <option :value="null" disabled>Category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
      <div>
        <input
          v-model="editingTransaction.description"
          placeholder="Description"
        />
      </div>
      <button type="submit">Submit</button>
      <div v-if="error" style="color: red">{{ error }}</div>
    </form>
    <button @click="closeModal">Cancel</button>
  </div>
</template>
