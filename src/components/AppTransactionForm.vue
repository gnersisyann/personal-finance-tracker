<script setup lang="ts">
import { ref, watch } from "vue";
import { useTransactions } from "../composables/useTransactions.ts";
import type { Transaction } from "../composables/useTransactions.ts";
import { useCategories } from "../composables/useCategories.ts";
const { addTransaction } = useTransactions();

const amount = ref<number | null>(null);
const category = ref<number | null>(null);
const description = ref<string | null>(null);
const error = ref("");
const { categories } = useCategories();

watch([amount, description], () => {
  if (
    amount.value === null ||
    !description.value ||
    description.value.trim() === ""
  ) {
    error.value = "";
    return;
  }

  if (isNaN(amount.value)) {
    error.value = "Amount must be a number";
    return;
  }
  if (amount.value <= 0) {
    error.value = "Invalid amount (must be positive)";
    return;
  }
  error.value = "";
});

function submitForm() {
  if (
    amount.value === null ||
    category.value === null ||
    !description.value ||
    description.value.trim() === ""
  ) {
    error.value = "Fill the fields";
    return;
  }

  const transaction: Transaction = {
    id: Date.now(),
    amount: amount.value,
    category: category.value,
    date: new Date().toISOString(),
    description: description.value,
  };
  if (error.value != "") return;
  addTransaction(transaction);
  amount.value = null;
  category.value = null;
  description.value = "";
  error.value = "";
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <div><input v-model.number="amount" placeholder="Amount" /></div>
    <div>
      <select v-model.number="category">
        <option :value="null" disabled>Category</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>
    <div><input v-model="description" placeholder="Description" /></div>
    <button type="submit">Submit</button>
    <div v-if="error" style="color: red">{{ error }}</div>
  </form>
</template>
