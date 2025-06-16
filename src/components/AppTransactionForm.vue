<script setup lang="ts">
import { ref, watch } from "vue";
import { useTransactions } from "../composables/useTransactions.ts";
import type { Transaction } from "../composables/useTransactions.ts";
import { useCategories } from "../composables/useCategories.ts";
const { addTransaction } = useTransactions();

const showModal = ref(false);

const amount = ref<number | null>(null);
const category = ref<number | null>(null);
const description = ref<string | null>(null);

const amountError = ref("");
const descriptionError = ref("");
const formError = ref("");
const { categories } = useCategories();

watch(amount, () => {
  if (amount.value === null || amount.value === undefined) {
    amountError.value = "";
    return;
  }
  if (isNaN(amount.value)) {
    amountError.value = "Amount must be a number";
    return;
  }
  if (amount.value <= 0) {
    amountError.value = "Invalid amount (must be positive)";
    return;
  }
  amountError.value = "";
});

watch(description, () => {
  if (!description.value || description.value.trim() === "") {
    descriptionError.value = "";
    return;
  }
  if (description.value.trim().length < 2) {
    descriptionError.value = "Description is too short";
    return;
  }
  descriptionError.value = "";
});

function openModal() {
  showModal.value = true;
  amount.value = null;
  category.value = null;
  description.value = "";
  amountError.value = "";
  descriptionError.value = "";
  formError.value = "";
}

function closeModal() {
  showModal.value = false;
}

function submitForm() {
  formError.value = "";
  if (
    amount.value === null ||
    category.value === null ||
    !description.value ||
    description.value.trim() === ""
  ) {
    formError.value = "Fill all the fields";
    return;
  }
  if (amountError.value || descriptionError.value) {
    formError.value = "Please fix the errors above";
    return;
  }
  const transaction: Transaction = {
    id: Date.now(),
    amount: amount.value,
    category: category.value,
    date: new Date().toISOString(),
    description: description.value,
  };
  addTransaction(transaction);
  closeModal();
}
</script>

<template>
  <button @click="openModal" style="margin-bottom: 12px">
    Add Transaction
  </button>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h3>Add Transaction</h3>
      <form @submit.prevent="submitForm">
        <div>
          <input v-model.number="amount" placeholder="Amount" />
          <div v-if="amountError" style="color: red">{{ amountError }}</div>
        </div>
        <div>
          <select v-model.number="category">
            <option :value="null" disabled>Category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        <div>
          <input v-model="description" placeholder="Description" />
          <div v-if="descriptionError" style="color: red">
            {{ descriptionError }}
          </div>
        </div>
        <button type="submit">Submit</button>
        <button type="button" @click="closeModal">Cancel</button>
        <div v-if="formError" style="color: red; margin-top: 8px">
          {{ formError }}
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
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
