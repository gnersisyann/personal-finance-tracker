<template>
  <form @submit.prevent="submitForm" class="transaction-form">
    <div>
      <label for="amount">Amount</label>
      <input
        id="amount"
        v-model.number="form.amount"
        type="number"
        min="0"
        step="0.01"
        required
      />
    </div>
    <div>
      <label for="category">Category</label>
      <select id="category" v-model="form.categoryId" required>
        <option value="" disabled>Select category</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>
    <div>
      <label for="description">Description</label>
      <input id="description" v-model="form.description" type="text" required />
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <button type="submit" :disabled="!!error" :class="{ disabled: !!error }">
      Add Transaction
    </button>
  </form>
</template>

<script setup lang="ts">
import { validateTransaction } from "~/utils/validation";
import type { Transaction, Category } from "~/types";

const props = defineProps<{
  categories: Category[];
}>();

const emit = defineEmits<{
  (e: "add", tx: Transaction): void;
}>();

const form = ref<Partial<Transaction>>({
  amount: undefined,
  categoryId: undefined,
  description: "",
});

const error = ref<string | null>(null);

watch(
  form,
  (newForm) => {
    error.value = validateTransaction({
      ...newForm,
      date: new Date().toISOString(),
    });
  },
  { deep: true, immediate: true }
);

function submitForm() {
  error.value = validateTransaction({
    ...form.value,
    date: new Date().toISOString(),
  });
  if (error.value) return;
  const tx: Transaction = {
    id: Date.now(),
    amount: Number(form.value.amount),
    categoryId: Number(form.value.categoryId),
    date: new Date().toISOString(),
    description: form.value.description!.trim(),
  };
  emit("add", tx);
  form.value = {
    amount: undefined,
    categoryId: undefined,
    description: "",
  };
}
</script>

<style scoped>
.transaction-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.error-message {
  color: red;
  margin-top: 0.5rem;
}
button.disabled {
  background: #ccc;
  color: #888;
  cursor: not-allowed;
}
</style>
