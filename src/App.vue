<script setup lang="ts">
import { ref } from "vue";
import TransactionForm from "./components/AppTransactionForm.vue";
import TransactionList from "./components/AppTransactionList.vue";
import Stats from "./components/AppStats.vue";
import CategoryManager from "./components/AppCategoryManager.vue";

const selectedCategory = ref<number | null>(null);
</script>

<template>
  <CategoryManager />
  <Stats />
  <TransactionForm />
  <TransactionList :selectedCategory="selectedCategory" />
</template>
