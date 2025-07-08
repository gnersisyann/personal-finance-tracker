<template>
  <div class="space-y-6">
    <!-- Заголовок страницы с навигацией -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <button
          @click="navigateHome"
          class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <HenaketIcon icon="arrow_back" size="20px" />
          Home
        </button>
        <h1 class="text-2xl font-bold text-gray-800">Transactions</h1>
      </div>

      <button
        @click="showAddModal = true"
        class="inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <HenaketIcon icon="add" size="20px" />
        Add Transaction
      </button>
    </div>

    <!-- Статистика -->
    <div class="p-6 bg-white rounded-lg border border-gray-200 shadow">
      <div class="flex items-center gap-3 mb-4">
        <HenaketIcon icon="analytics" size="24px" class="text-blue-600" />
        <h3 class="text-lg font-semibold text-gray-800">Statistics</h3>
      </div>
      <ClientOnly>
        <AppStats />
        <template #fallback>
          <div class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- Список транзакций -->
    <ClientOnly>
      <AppTransactionList :categories="categories" :disabled="isSubmitting" />
      <template #fallback>
        <div class="p-6 bg-white rounded-lg border border-gray-200 shadow">
          <div class="animate-pulse space-y-4">
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              <div class="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- Модальное окно добавления транзакции -->
    <HenaketModal v-model="showAddModal">
      <template #title>
        <div class="flex items-center gap-3">
          <HenaketIcon icon="add_circle" size="24px" class="text-green-600" />
          Add New Transaction
        </div>
      </template>

      <template #description>
        <AppTransactionForm
          :categories="categories"
          @add="handleAddTransaction"
          @cancel="showAddModal = false"
          :disabled="isSubmitting"
        />

        <div
          v-if="error"
          class="mt-4 p-3 bg-red-50 border border-red-200 rounded"
        >
          <div class="flex items-center gap-2">
            <HenaketIcon icon="error" size="16px" class="text-red-600" />
            <span class="text-red-700 text-sm">{{ error }}</span>
          </div>
        </div>
      </template>
    </HenaketModal>

    <!-- Дополнительная информация -->
    <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div class="flex items-start gap-3">
        <HenaketIcon
          icon="lightbulb"
          size="20px"
          class="text-yellow-600 mt-0.5"
        />
        <div>
          <h4 class="font-medium text-yellow-800">Pro Tip</h4>
          <p class="text-yellow-700 text-sm mt-1">
            Use categories to better organize your expenses and track spending
            patterns over time.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Transaction } from "~/types";

// Отключаем SSR для этой страницы
definePageMeta({
  ssr: false,
});

// Состояние
const showAddModal = ref(false);
const isSubmitting = ref(false);
const error = ref("");

// Загружаем категории и транзакции
const { categories, loadCategories } = useCategories();
const { addTransaction } = useTransactions();

// Загружаем данные при монтировании
onMounted(async () => {
  await loadCategories();
});

// Обработка добавления транзакции
async function handleAddTransaction(
  transactionData: Pick<Transaction, "amount" | "categoryId" | "description">
) {
  try {
    isSubmitting.value = true;
    error.value = "";

    await addTransaction(transactionData);
    showAddModal.value = false;
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to add transaction";
    console.error("Failed to add transaction:", err);
  } finally {
    isSubmitting.value = false;
  }
}

// Навигация
const navigateHome = () => {
  navigateTo("/");
};

// SEO
useHead({
  title: "Transactions - Personal Finance Tracker",
  meta: [
    {
      name: "description",
      content: "Manage and track your financial transactions",
    },
  ],
});
</script>
