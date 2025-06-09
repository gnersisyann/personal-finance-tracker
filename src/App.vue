<script setup lang="ts">
import { ref } from "vue";
import TransactionForm from "./components/AppTransactionForm.vue";
import TransactionList from "./components/AppTransactionList.vue";
import CategoryFilter from "./components/AppCategoryFilter.vue";
import Stats from "./components/AppStats.vue";

const selectedCategory = ref<number | null>(null);
</script>

<template>
  <Stats />
  <TransactionForm />
  <CategoryFilter @chooseCategory="selectedCategory = $event" />
  <TransactionList :selectedCategory="selectedCategory" />
</template>
