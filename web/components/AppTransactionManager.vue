<template>
  <div>
    <button @click="showModal = true">Add Transaction</button>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <AppTransactionForm :categories="categories" @add="handleAdd" />
        <button @click="showModal = false" style="margin-top: 12px">
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
const { categories } = useCategories();
const { addTransaction } = useTransactions();

function handleAdd( tx: Transaction) {
  addTransaction(tx);
  showModal.value = false;
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
