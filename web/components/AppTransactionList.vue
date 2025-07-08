<script setup lang="ts">
import type { Transaction, Category } from "~/types";

const props = defineProps<{
  categories: Category[];
  disabled?: boolean;
}>();

const {
  transactions,
  updateTransaction,
  removeTransaction,
  loadTransactions,
  isLoading: transactionsLoading,
  error: transactionsError,
} = useTransactions();

const { error: categoriesError } = useCategories();

const startDate = ref<string>("");
const endDate = ref<string>("");

const showFilter = ref(false);
const showSearch = ref(false);

const selectedCategory = ref<number | null>(null);

const isModalOpen = ref(false);
const editingTransaction = ref<Transaction | null>(null);
const error = ref("");

const search = ref("");
const isSubmitting = ref(false);

// Загружаем транзакции при монтировании
onMounted(async () => {
  await loadTransactions();
});

// Перезагружаем транзакции при изменении фильтров
watch([selectedCategory, startDate, endDate, search], async () => {
  await loadTransactions({
    categoryId: selectedCategory.value || undefined,
    startDate: startDate.value || undefined,
    endDate: endDate.value || undefined,
    search: search.value || undefined,
  });
});

// Фильтрация транзакций (клиентская фильтрация для дополнительной гибкости)
const filteredTransactions = computed(() => {
  let filtered = transactions.value || [];
  return filtered;
});

// Форматирование данных для таблицы
const tableData = computed(() => {
  return filteredTransactions.value.map((transaction) => {
    const category = props.categories.find(
      (c) => c.id === transaction.categoryId
    );
    return {
      id: transaction.id,
      date: new Date(transaction.date).toLocaleDateString(),
      description: transaction.description,
      categoryName: category?.name || "Unknown",
      amount: transaction.amount,
      formattedAmount: `$${Number(transaction.amount).toFixed(2)}`,
      categoryColor: category?.color || "#3b82f6",
      rawTransaction: transaction,
    };
  });
});

function openEditModal(transaction: Transaction) {
  editingTransaction.value = transaction;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  editingTransaction.value = null;
  error.value = "";
}

async function handleEditSubmit(
  id: number,
  updatedTransaction: Pick<Transaction, "amount" | "categoryId" | "description">
) {
  try {
    isSubmitting.value = true;
    await updateTransaction(id, updatedTransaction);
    closeModal();
    await loadTransactions();
  } catch (err) {
    error.value = "Failed to update transaction";
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
}

async function handleDelete(transaction: Transaction) {
  if (
    confirm(`Are you sure you want to delete "${transaction.description}"?`)
  ) {
    try {
      await removeTransaction(transaction.id);
      await loadTransactions();
    } catch (err) {
      error.value = "Failed to delete transaction";
      console.error(err);
    }
  }
}

function clearFilters() {
  search.value = "";
  selectedCategory.value = null;
  startDate.value = "";
  endDate.value = "";
  showFilter.value = false;
  showSearch.value = false;
}
</script>

<template>
  <div class="space-y-6">
    <!-- Заголовок с кнопками управления -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <HenaketIcon icon="list" size="24px" class="text-blue-600" />
        <h3 class="text-lg font-semibold text-gray-800">Transaction List</h3>
        <span
          :class="[
            'px-2 py-1 rounded text-xs font-medium',
            filteredTransactions.length > 0
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-600',
          ]"
        >
          {{ filteredTransactions.length }}
        </span>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          @click="showSearch = !showSearch"
          :class="[
            'inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm font-medium transition-colors',
            showSearch
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
          ]"
        >
          <HenaketIcon icon="search" size="18px" />
          Search
        </button>

        <button
          @click="showFilter = !showFilter"
          :class="[
            'inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm font-medium transition-colors',
            showFilter
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
          ]"
        >
          <HenaketIcon icon="filter_list" size="18px" />
          Filter
        </button>

        <button
          v-if="search || selectedCategory || startDate || endDate"
          @click="clearFilters"
          class="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <HenaketIcon icon="clear" size="18px" />
          Clear
        </button>
      </div>
    </div>

    <!-- Поиск -->
    <div
      v-if="showSearch"
      class="p-4 bg-white rounded-lg border border-gray-200 shadow"
    >
      <HenaketInputField
        v-model="search"
        label="Search transactions"
        placeholder="Search by description..."
      >
        <template #prefix>
          <HenaketIcon icon="search" size="20px" />
        </template>
      </HenaketInputField>
    </div>

    <!-- Фильтры -->
    <div
      v-if="showFilter"
      class="p-4 bg-white rounded-lg border border-gray-200 shadow"
    >
      <div class="space-y-4">
        <div class="flex items-center gap-3 mb-4">
          <HenaketIcon icon="tune" size="20px" class="text-blue-600" />
          <h4 class="font-semibold text-gray-800">Filter Options</h4>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Категория -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700"
              >Category:</label
            >
            <div class="relative">
              <HenaketIcon
                icon="category"
                size="18px"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <select
                v-model="selectedCategory"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option :value="null">All categories</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Дата начала -->
          <HenaketInputField v-model="startDate" type="date" label="Start date">
            <template #prefix>
              <HenaketIcon icon="calendar_today" size="18px" />
            </template>
          </HenaketInputField>

          <!-- Дата окончания -->
          <HenaketInputField v-model="endDate" type="date" label="End date">
            <template #prefix>
              <HenaketIcon icon="event" size="18px" />
            </template>
          </HenaketInputField>
        </div>
      </div>
    </div>

    <!-- Состояния загрузки и ошибок -->
    <div
      v-if="transactionsLoading"
      class="p-4 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <div class="flex items-center gap-3">
        <HenaketIcon icon="hourglass_empty" size="20px" class="text-blue-600" />
        <div>
          <h4 class="font-medium text-blue-800">Loading transactions...</h4>
          <p class="text-blue-700 text-sm">
            Please wait while we fetch your transactions.
          </p>
        </div>
      </div>
    </div>

    <div
      v-else-if="transactionsError"
      class="p-4 bg-red-50 border border-red-200 rounded-lg"
    >
      <div class="flex items-center gap-3">
        <HenaketIcon icon="error" size="20px" class="text-red-600" />
        <div>
          <h4 class="font-medium text-red-800">Error loading transactions</h4>
          <p class="text-red-700 text-sm">{{ transactionsError }}</p>
        </div>
      </div>
    </div>

    <div
      v-else-if="categoriesError"
      class="p-4 bg-red-50 border border-red-200 rounded-lg"
    >
      <div class="flex items-center gap-3">
        <HenaketIcon icon="error" size="20px" class="text-red-600" />
        <div>
          <h4 class="font-medium text-red-800">Error loading categories</h4>
          <p class="text-red-700 text-sm">{{ categoriesError }}</p>
        </div>
      </div>
    </div>

    <!-- Таблица транзакций -->
    <div
      v-else-if="filteredTransactions.length"
      class="overflow-hidden bg-white rounded-lg border border-gray-200 shadow"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="item in tableData"
              :key="item.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.date }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                <div class="font-medium">{{ item.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span
                  class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-white"
                  :style="{ backgroundColor: item.categoryColor }"
                >
                  {{ item.categoryName }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900"
              >
                {{ item.formattedAmount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex gap-2">
                  <button
                    @click="openEditModal(item.rawTransaction)"
                    :disabled="disabled"
                    class="inline-flex items-center justify-center w-8 h-8 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <HenaketIcon icon="edit" size="16px" />
                  </button>
                  <button
                    @click="handleDelete(item.rawTransaction)"
                    :disabled="disabled"
                    class="inline-flex items-center justify-center w-8 h-8 rounded border border-gray-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <HenaketIcon icon="delete" size="16px" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div
      v-else
      class="p-12 text-center bg-white rounded-lg border border-gray-200 shadow"
    >
      <div class="space-y-4">
        <HenaketIcon
          icon="receipt_long"
          size="64px"
          class="text-gray-400 mx-auto"
        />
        <h3 class="text-lg font-medium text-gray-600">No transactions found</h3>
        <p class="text-gray-500">
          {{
            search || selectedCategory || startDate || endDate
              ? "Try adjusting your filters or search terms"
              : "Start by adding your first transaction"
          }}
        </p>
        <button
          v-if="search || selectedCategory || startDate || endDate"
          @click="clearFilters"
          class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <HenaketIcon icon="clear" size="18px" />
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Модальное окно редактирования -->
    <HenaketModal v-model="isModalOpen">
      <template #title>
        <div class="flex items-center gap-3">
          <HenaketIcon icon="edit" size="24px" class="text-blue-600" />
          Edit Transaction
        </div>
      </template>

      <template #description>
        <AppTransactionForm
          :transaction="editingTransaction"
          :categories="categories"
          @update="handleEditSubmit"
          @cancel="closeModal"
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

    <!-- Информация о результатах -->
    <div
      v-if="
        !transactionsLoading &&
        !transactionsError &&
        filteredTransactions.length > 0
      "
      class="p-4 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <div class="flex items-center gap-3">
        <HenaketIcon icon="info" size="20px" class="text-blue-600" />
        <div>
          <h4 class="font-medium text-blue-800">Results</h4>
          <p class="text-blue-700 text-sm">
            Showing {{ filteredTransactions.length }} of
            {{ transactions.length || 0 }} transactions
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
