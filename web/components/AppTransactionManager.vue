<template>
  <div>
    <div v-if="categoriesLoading" style="color: #6366f1; margin-bottom: 12px">
      Loading categories...
    </div>

    <div v-if="categoriesError" style="color: red; margin-bottom: 12px">
      Error loading categories: {{ categoriesError }}
    </div>

    <button
      @click="showModal = true"
      :disabled="categoriesLoading || !categories.length"
    >
      Add Transaction
    </button>

    <div
      v-if="!categories.length && !categoriesLoading"
      style="color: #888; margin-top: 8px; font-size: 0.9em"
    >
      Create categories first to add transactions
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <AppTransactionForm
          :categories="categories"
          @add="handleAdd"
          :disabled="isSubmitting"
        />
        <button
          @click="showModal = false"
          style="margin-top: 12px"
          :disabled="isSubmitting"
        >
          Cancel
        </button>
      </div>
    </div>

    <AppTransactionList />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppTransactionForm from "./AppTransactionForm.vue";
import AppTransactionList from "./AppTransactionList.vue";
import { useCategories } from "~/composables/useCategories";
import { useTransactions } from "~/composables/useTransactions";
import type { Transaction } from "~/types";

const showModal = ref(false);
const isSubmitting = ref(false);

const {
  categories,
  isLoading: categoriesLoading,
  error: categoriesError,
  loadCategories,
} = useCategories();
const { addTransaction, error: transactionsError } = useTransactions();

onMounted(async () => {
  await loadCategories();
});

async function handleAdd(
  tx: Pick<Transaction, "amount" | "categoryId" | "description">
) {
  try {
    isSubmitting.value = true;
    await addTransaction(tx);
    showModal.value = false;
  } catch (err) {
    console.error("Failed to add transaction:", err);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 300px;
}
</style>
