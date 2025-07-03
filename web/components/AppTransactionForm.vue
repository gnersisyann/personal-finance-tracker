<script setup lang="ts">
import type { Transaction, Category } from "~/types";

const props = defineProps<{
  categories: Category[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  add: [
    transaction: Pick<Transaction, "amount" | "categoryId" | "description">
  ];
}>();

const form = ref({
  amount: 0,
  categoryId: null as number | null,
  description: "",
});

const error = ref<string | null>(null);

const isFormValid = computed(() => {
  return (
    form.value.amount > 0 &&
    form.value.categoryId !== null &&
    form.value.description.trim().length > 0
  );
});

watch(
  form,
  () => {
    error.value = null;
    if (form.value.amount <= 0) {
      error.value = "Amount must be greater than 0";
    } else if (!form.value.categoryId) {
      error.value = "Please select a category";
    } else if (!form.value.description.trim()) {
      error.value = "Description is required";
    }
  },
  { deep: true }
);

function submitForm() {
  if (!isFormValid.value || error.value) return;

  const transaction = {
    amount: form.value.amount,
    categoryId: form.value.categoryId!,
    description: form.value.description.trim(),
  };

  emit("add", transaction);

  form.value = {
    amount: 0,
    categoryId: null,
    description: "",
  };
}
</script>

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
        :disabled="disabled"
      />
    </div>
    <div>
      <label for="category">Category</label>
      <select
        id="category"
        v-model.number="form.categoryId"
        required
        :disabled="disabled"
      >
        <option :value="null" disabled>Select category</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>
    <div>
      <label for="description">Description</label>
      <input
        id="description"
        v-model="form.description"
        type="text"
        placeholder="Enter description"
        required
        :disabled="disabled"
      />
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <button
      type="submit"
      :disabled="disabled || !!error || !isFormValid"
      :class="{ disabled: disabled || !!error || !isFormValid }"
    >
      {{ disabled ? "Adding..." : "Add Transaction" }}
    </button>
  </form>
</template>

<style scoped>
.transaction-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-form div {
  display: flex;
  flex-direction: column;
}

.transaction-form label {
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.transaction-form input,
.transaction-form select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

button {
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

button:hover:not(.disabled) {
  background: #2563eb;
}

button.disabled {
  background: #ccc;
  color: #888;
  cursor: not-allowed;
}
</style>
