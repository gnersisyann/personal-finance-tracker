<script setup lang="ts">
import type { Transaction, Category } from "~/types";

const props = defineProps<{
  categories: Category[];
  disabled?: boolean;
  transaction?: Transaction | null;
}>();

const emit = defineEmits<{
  add: [
    transaction: Pick<Transaction, "amount" | "categoryId" | "description">
  ];
  update: [
    id: number,
    transaction: Pick<Transaction, "amount" | "categoryId" | "description">
  ];
  cancel: [];
}>();

const form = ref({
  amount: props.transaction?.amount?.toString() || "",
  categoryId: props.transaction?.categoryId || (null as number | null),
  description: props.transaction?.description || "",
});

const error = ref<string | null>(null);

const isFormValid = computed(() => {
  const amount = parseFloat(form.value.amount);
  return (
    amount > 0 &&
    !isNaN(amount) &&
    form.value.categoryId !== null &&
    form.value.description.trim().length > 0
  );
});

watch(
  form,
  () => {
    error.value = null;
  },
  { deep: true }
);

function submitForm() {
  if (!isFormValid.value) {
    error.value = "Please fill in all fields correctly";
    return;
  }

  const amount = parseFloat(form.value.amount);

  if (props.transaction) {
    emit("update", props.transaction.id, {
      amount: amount,
      categoryId: form.value.categoryId!,
      description: form.value.description,
    });
  } else {
    emit("add", {
      amount: amount,
      categoryId: form.value.categoryId!,
      description: form.value.description,
    });
  }
}

function cancel() {
  emit("cancel");
}

// Сброс формы при изменении транзакции
watch(
  () => props.transaction,
  (newTransaction) => {
    if (newTransaction) {
      form.value = {
        amount: newTransaction.amount.toString(),
        categoryId: newTransaction.categoryId,
        description: newTransaction.description,
      };
    } else {
      form.value = {
        amount: "",
        categoryId: null,
        description: "",
      };
    }
  },
  { immediate: true }
);
</script>

<template>
  <!-- Фиксируем минимальную высоту контейнера для предотвращения изменения размера -->
  <div class="space-y-6 min-h-[500px]">
    <!-- Заголовок формы -->
    <div class="text-center pb-4">
      <HenaketIcon
        :icon="transaction ? 'edit' : 'add_circle'"
        size="48px"
        :class="transaction ? 'text-blue-600' : 'text-green-600'"
        class="mx-auto mb-3"
      />
      <h3 class="text-xl font-semibold text-gray-800">
        {{ transaction ? "Edit Transaction" : "Add New Transaction" }}
      </h3>
      <p class="text-gray-600 mt-1">
        {{
          transaction
            ? "Update the transaction details"
            : "Fill in the details below to add a new transaction"
        }}
      </p>
    </div>

    <!-- Ошибки -->
    <HenaketAlert
      v-if="error"
      variant="error"
      :title="error"
      icon="error"
      class="mb-4"
    />

    <!-- Поля формы -->
    <div class="space-y-4">
      <!-- Описание -->
      <HenaketInputField
        v-model="form.description"
        label="Description"
        placeholder="Enter transaction description..."
        :disabled="disabled"
        required
      >
        <template #prefix>
          <HenaketIcon icon="description" size="20px" />
        </template>
      </HenaketInputField>

      <!-- Сумма - Фиксируем ширину для предотвращения изменения размера -->
      <div class="w-full">
        <HenaketInputField
          v-model="form.amount"
          type="number"
          label="Amount"
          placeholder="0.00"
          :disabled="disabled"
          step="0.01"
          min="0"
          required
          class="w-full"
        >
          <template #prefix>
            <HenaketIcon icon="payments" size="20px" />
          </template>
          <template #suffix>
            <span class="text-gray-500 w-4 text-center">$</span>
          </template>
        </HenaketInputField>
      </div>

      <!-- Категория -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Category *
        </label>
        <div class="relative">
          <HenaketIcon
            icon="category"
            size="20px"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
          />
          <select
            v-model="form.categoryId"
            :disabled="disabled"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            required
          >
            <option :value="null" disabled>Select a category...</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Информация о валидации - фиксированная высота -->
    <div class="min-h-[60px]">
      <HenaketInfoCard
        v-if="
          !isFormValid && (form.description || form.amount || form.categoryId)
        "
        icon="info"
        title="Form Requirements"
        content="Please fill in all fields: description, amount (greater than 0), and select a category."
      />
    </div>

    <!-- Предпросмотр - фиксированная высота -->
    <div class="min-h-[80px]">
      <HenaketCard v-if="isFormValid" class="p-4 bg-green-50 border-green-200">
        <div class="flex items-center gap-3">
          <HenaketIcon icon="preview" size="24px" class="text-green-600" />
          <div>
            <h4 class="font-semibold text-green-800">Preview</h4>
            <p class="text-green-700">
              <strong class="font-mono"
                >${{ parseFloat(form.amount || "0").toFixed(2) }}</strong
              >
              -
              {{ form.description }}
              <span class="text-green-600">
                ({{ categories.find((c) => c.id === form.categoryId)?.name }})
              </span>
            </p>
          </div>
        </div>
      </HenaketCard>
    </div>

    <!-- Кнопки -->
    <div class="flex gap-3 pt-4">
      <button
        @click="cancel"
        :disabled="disabled"
        class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <HenaketIcon icon="close" size="20px" />
        Cancel
      </button>

      <button
        @click="submitForm"
        :disabled="disabled || !isFormValid"
        class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <HenaketIcon :icon="transaction ? 'save' : 'add'" size="20px" />
        {{ transaction ? "Save Changes" : "Add Transaction" }}
      </button>
    </div>
  </div>
</template>
