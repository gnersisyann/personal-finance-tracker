<script setup lang="ts">
import { useTransactions } from "../composables/useTransactions.ts";
import { computed } from "vue";
import { useCategories } from "../composables/useCategories.ts";

const props = defineProps<{ selectedCategory: number | null }>();
const { getCategory } = useCategories();

const { transactions, removeTransaction } = useTransactions();
const filteredTransactions = computed(() =>
  props.selectedCategory == null
    ? transactions.value
    : transactions.value.filter((t) => t.category === props.selectedCategory)
);
</script>

<template>
  <ul>
    <li v-for="transaction in filteredTransactions" :key="transaction.id">
      {{ transaction.amount }} {{ getCategory(transaction.category) }}
      {{ transaction.description }}
      {{ new Date(transaction.date).toLocaleString() }}
      <button @click="removeTransaction(transaction.id)">Delete</button>
    </li>
  </ul>
</template>
