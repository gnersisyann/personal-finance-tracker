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

// Добавляем состояние для модального окна удаления
const deleteModal = ref(false);
const transactionToDelete = ref<Transaction | null>(null);
const isDeleting = ref(false);

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

// Computed для данных удаляемой транзакции с проверками на null
const deleteTransactionData = computed(() => {
  if (!transactionToDelete.value) return null;

  const transaction = transactionToDelete.value;
  const category = props.categories.find(
    (c) => c.id === transaction.categoryId
  );

  return {
    description: transaction.description,
    amount: Number(transaction.amount).toFixed(2),
    date: new Date(transaction.date).toLocaleDateString(),
    categoryName: category?.name || "Unknown",
    categoryColor: category?.color || "#3b82f6",
  };
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

// Новые функции для модального окна удаления
function showDeleteConfirmation(transaction: Transaction) {
  transactionToDelete.value = transaction;
  deleteModal.value = true;
}

async function confirmDelete() {
  if (!transactionToDelete.value) return;

  try {
    isDeleting.value = true;
    await removeTransaction(transactionToDelete.value.id);
    await loadTransactions();
    deleteModal.value = false;
    transactionToDelete.value = null;
  } catch (err) {
    error.value = "Failed to delete transaction";
    console.error(err);
  } finally {
    isDeleting.value = false;
  }
}

function cancelDelete() {
  deleteModal.value = false;
  transactionToDelete.value = null;
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
        <HenaketBadge
          :backgroundColor="
            filteredTransactions.length > 0 ? '#3b82f6' : '#9ca3af'
          "
        >
          {{ filteredTransactions.length }}
        </HenaketBadge>
      </div>

      <HenaketButton
        @click="showSearch = !showSearch"
        :variant="showSearch ? 'primary' : 'outlined'"
        size="regular"
      >
        <HenaketIcon icon="search" size="18px" />
        Search
      </HenaketButton>

      <HenaketButton
        @click="showFilter = !showFilter"
        :variant="showFilter ? 'primary' : 'outlined'"
        size="regular"
      >
        <HenaketIcon icon="filter_list" size="18px" />
        Filter
      </HenaketButton>

      <HenaketButton
        v-if="search || selectedCategory || startDate || endDate"
        @click="clearFilters"
        variant="outlined"
        size="regular"
      >
        <HenaketIcon icon="clear" size="18px" />
        Clear
      </HenaketButton>
    </div>

    <!-- Поиск -->
    <HenaketCard v-if="showSearch" class="p-4">
      <HenaketInputField
        v-model="search"
        label="Search transactions"
        placeholder="Search by description..."
      >
        <template #prefix>
          <HenaketIcon icon="search" size="20px" />
        </template>
      </HenaketInputField>
    </HenaketCard>

    <!-- Фильтры -->
    <HenaketCard v-if="showFilter" class="p-4">
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
    </HenaketCard>

    <!-- Состояния загрузки и ошибок -->
    <HenaketAlert
      v-if="transactionsLoading"
      variant="info"
      title="Loading transactions..."
      content="Please wait while we fetch your transactions."
      icon="hourglass_empty"
    />

    <HenaketAlert
      v-else-if="transactionsError"
      variant="error"
      title="Error loading transactions"
      :content="transactionsError"
      icon="error"
    />

    <HenaketAlert
      v-else-if="categoriesError"
      variant="error"
      title="Error loading categories"
      :content="categoriesError"
      icon="error"
    />

    <!-- Таблица транзакций -->
    <HenaketCard
      v-else-if="filteredTransactions.length"
      class="overflow-hidden"
    >
      <div class="overflow-x-auto w-full">
        <table class="min-w-full">
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
                <HenaketBadge :backgroundColor="item.categoryColor">
                  {{ item.categoryName }}
                </HenaketBadge>
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
                    @click="showDeleteConfirmation(item.rawTransaction)"
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
    </HenaketCard>

    <!-- Пустое состояние -->
    <HenaketCard v-else class="p-12 justify-center">
      <div class="text-center space-y-4">
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
    </HenaketCard>

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

        <HenaketAlert
          v-if="error"
          variant="error"
          :title="error"
          icon="error"
          class="mt-4"
        />
      </template>
    </HenaketModal>

    <!-- Модальное окно подтверждения удаления -->
    <HenaketModal v-model="deleteModal">
      <template #title>
        <div class="flex items-center gap-3">
          <HenaketIcon icon="warning" size="24px" class="text-red-600" />
          Confirm Deletion
        </div>
      </template>

      <template #description>
        <div class="space-y-6">
          <!-- Предупреждение -->
          <HenaketAlert
            variant="warning"
            icon="warning"
            title="This action cannot be undone"
            content="Are you sure you want to delete this transaction? This will permanently remove it from your records."
          />

          <!-- Детали транзакции -->
          <div v-if="deleteTransactionData" class="space-y-4">
            <h4 class="font-medium text-gray-800">Transaction Details:</h4>

            <HenaketCard class="p-4 bg-gray-50">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 font-medium">Description:</span>
                  <span class="font-semibold text-gray-800">
                    {{ deleteTransactionData.description }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-gray-600 font-medium">Amount:</span>
                  <span class="font-bold text-red-600 text-lg">
                    ${{ deleteTransactionData.amount }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-gray-600 font-medium">Date:</span>
                  <span class="font-semibold text-gray-800">
                    {{ deleteTransactionData.date }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-gray-600 font-medium">Category:</span>
                  <div class="flex items-center gap-2">
                    <div
                      class="w-3 h-3 rounded-full"
                      :style="{
                        backgroundColor: deleteTransactionData.categoryColor,
                      }"
                    ></div>
                    <span class="font-semibold text-gray-800">
                      {{ deleteTransactionData.categoryName }}
                    </span>
                  </div>
                </div>
              </div>
            </HenaketCard>
          </div>

          <!-- Fallback если данные не загружены -->
          <div v-else class="space-y-4">
            <h4 class="font-medium text-gray-800">Transaction Details:</h4>
            <HenaketCard class="p-4 bg-gray-50">
              <div class="text-center text-gray-500">
                <HenaketIcon icon="error" size="24px" class="mx-auto mb-2" />
                <p>Unable to load transaction details</p>
              </div>
            </HenaketCard>
          </div>

          <!-- Дополнительная информация -->
          <HenaketInfoCard
            icon="info"
            title="Impact of Deletion"
            content="Deleting this transaction will also affect your financial statistics and category totals. Make sure this is the correct transaction to remove."
          />

          <!-- Кнопки действий -->
          <div class="flex gap-3 pt-4">
            <HenaketButton
              @click="cancelDelete"
              :disabled="isDeleting"
              variant="outlined"
              size="regular"
              class="flex-1"
            >
              <HenaketIcon icon="close" size="20px" />
              Cancel
            </HenaketButton>

            <HenaketButton
              @click="confirmDelete"
              :disabled="isDeleting || !transactionToDelete"
              variant="danger"
              size="regular"
              class="flex-1"
            >
              <HenaketIcon v-if="!isDeleting" icon="delete" size="20px" />
              <div
                v-else
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              {{ isDeleting ? "Deleting..." : "Delete Transaction" }}
            </HenaketButton>
          </div>
        </div>
      </template>
    </HenaketModal>

    <!-- Информация о результатах -->
    <HenaketInfoCard
      v-if="
        !transactionsLoading &&
        !transactionsError &&
        filteredTransactions.length > 0
      "
      icon="info"
      title="Results"
      :content="`Showing ${filteredTransactions.length} of ${
        transactions.length || 0
      } transactions`"
    />

    <!-- Дополнительные советы для пустого состояния -->
    <HenaketInfoCard
      v-if="
        !transactionsLoading &&
        !transactionsError &&
        filteredTransactions.length === 0 &&
        transactions.length === 0
      "
      icon="lightbulb"
      title="Getting Started"
      content="Add your first transaction to start tracking your finances. You can categorize expenses, add descriptions, and monitor your spending patterns over time."
    />
  </div>
</template>
