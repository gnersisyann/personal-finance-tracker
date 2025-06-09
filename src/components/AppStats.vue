<script setup lang="ts">
import { useTransactions } from "../composables/useTransactions";
import { useCategories } from "../composables/useCategories";
import { computed } from "vue";

const { transactions } = useTransactions();
const { categories } = useCategories();

const totalAmount = computed(() =>
  transactions.value.reduce((sum, t) => (sum += t.amount), 0)
);

const transactionCount = computed(() => transactions.value.length);
const countByCategory = computed(() =>
  categories.map((cat) => ({
    name: cat.name,
    count: transactions.value.filter((t) => t.category === cat.id).length,
  }))
);
</script>

<template>
  <div>Transaction count: {{ transactionCount }}</div>
  <div v-for="cat in countByCategory" :key="cat.name">
    {{ cat.name }} {{ cat.count }}
  </div>
  <div>Total amount: {{ totalAmount }}</div>
</template>
