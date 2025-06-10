<script setup lang="ts">
import { useTransactions } from "../composables/useTransactions";
import { useCategories } from "../composables/useCategories";
import { computed } from "vue";

const { transactions } = useTransactions();
const { categories } = useCategories();

const totalAmount = computed(() =>
  transactions.value.reduce((sum, t) => (sum += t.amount), 0)
);
const amountByCategory = computed(() =>
  categories.map((cat) => ({
    name: cat.name,
    amount: transactions.value
      .filter((t) => t.category === cat.id)
      .reduce((sum, t) => sum + t.amount, 0),
  }))
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
  <div class="stats-container">
    <div class="stats-title">Statistics</div>
    <div class="stats-row">
      <span>Total transactions:</span>
      <span>{{ transactionCount }}</span>
    </div>
    <div class="stats-title" style="font-size: 1em; margin-top: 18px">
      Count by category
    </div>
    <div v-for="cat in countByCategory" :key="cat.name" class="stats-row">
      <span>{{ cat.name }}</span>
      <span>{{ cat.count }}</span>
    </div>
    <div class="stats-total">Total amount: {{ totalAmount }}</div>
    <div class="stats-title" style="font-size: 1em; margin-top: 18px">
      Amount by category
    </div>
    <div v-for="cat in amountByCategory" :key="cat.name" class="stats-row">
      <span>{{ cat.name }}</span>
      <span>{{ cat.amount }}</span>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  background: #f3f4f6;
  border-radius: 10px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stats-title {
  font-size: 1.2em;
  font-weight: 600;
  margin-bottom: 12px;
  color: #6366f1;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 1em;
}

.stats-row:last-child {
  margin-bottom: 0;
}

.stats-total {
  font-weight: bold;
  color: #2563eb;
  margin-top: 16px;
  margin-bottom: 8px;
}
</style>
