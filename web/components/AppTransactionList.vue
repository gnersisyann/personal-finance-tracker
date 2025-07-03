<script setup lang="ts">
const { transactions, isLoading, error, loadTransactions } = useTransactions();
const { categories, loadCategories } = useCategories();

// Состояние фильтров
const filters = ref({
  search: "",
  categoryId: null as number | null,
  startDate: "",
  endDate: "",
});

// Состояние сортировки
const sortOrder = ref<string[]>([]);

// Заголовки таблицы
const headers = [
  {
    title: "Дата",
    valueTemplate: "{{formattedDate}}",
    sortable: true,
  },
  {
    title: "Описание",
    valueTemplate: "{{description}}",
    sortable: true,
  },
  {
    title: "Категория",
    valueTemplate: "{{category.name}}",
    sortable: false,
  },
  {
    title: "Сумма",
    valueTemplate: "{{amount}} ₽",
    sortable: true,
  },
];

// Вычисляемые свойства для фильтрации
const filteredTransactions = computed(() => {
  let result = [...transactions.value];

  // Фильтр по поиску
  if (filters.value.search.trim()) {
    const search = filters.value.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(search) ||
        t.category?.name.toLowerCase().includes(search)
    );
  }

  // Фильтр по категории
  if (filters.value.categoryId) {
    result = result.filter((t) => t.categoryId === filters.value.categoryId);
  }

  // Фильтр по датам
  if (filters.value.startDate) {
    const startDate = new Date(filters.value.startDate);
    result = result.filter((t) => new Date(t.date) >= startDate);
  }

  if (filters.value.endDate) {
    const endDate = new Date(filters.value.endDate);
    endDate.setHours(23, 59, 59, 999);
    result = result.filter((t) => new Date(t.date) <= endDate);
  }

  return result;
});

// Подготовка данных для таблицы с форматированной датой
const tableData = computed(() => {
  return filteredTransactions.value.map((transaction) => ({
    ...transaction,
    formattedDate: new Date(transaction.date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));
});

// Опции для фильтра категорий
const categoryOptions = computed(() =>
  categories.value.map((cat) => ({
    text: cat.name,
    value: cat.id,
  }))
);

// Загрузка данных при монтировании
onMounted(async () => {
  await Promise.all([loadCategories(), loadTransactions()]);
});

// Функция сброса фильтров
function resetFilters() {
  filters.value = {
    search: "",
    categoryId: null,
    startDate: "",
    endDate: "",
  };
}

// Функция обновления данных
async function refreshData() {
  await loadTransactions();
}
</script>

<template>
  <HenaketCard class="p-6">
    <div class="flex flex-col gap-6">
      <!-- Заголовок -->
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-800">Транзакции</h2>

        <HenaketButton
          variant="outlined"
          @click="refreshData"
          :disabled="isLoading"
        >
          <HenaketIcon icon="refresh" size="16px" class="mr-2" />
          Обновить
        </HenaketButton>
      </div>

      <!-- Фильтры -->
      <HenaketCard class="p-4" staticDisplay>
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-700">Фильтры</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Поиск -->
            <HenaketInputField
              v-model="filters.search"
              label="Поиск"
              type="text"
              placeholder="Поиск по описанию..."
            />

            <!-- Фильтр категорий -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Категория
              </label>
              <HenaketFilters
                v-model="filters.categoryId"
                :items="categoryOptions"
                :multiple="false"
              />
            </div>

            <!-- Дата начала -->
            <HenaketInputField
              v-model="filters.startDate"
              label="Дата с"
              type="date"
            />

            <!-- Дата окончания -->
            <HenaketInputField
              v-model="filters.endDate"
              label="Дата по"
              type="date"
            />
          </div>

          <!-- Кнопка сброса фильтров -->
          <div class="flex justify-end">
            <HenaketButton variant="outlined" @click="resetFilters">
              <HenaketIcon icon="clear" size="16px" class="mr-2" />
              Сбросить фильтры
            </HenaketButton>
          </div>
        </div>
      </HenaketCard>

      <!-- Уведомление об ошибке -->
      <HenaketAlert
        v-if="error"
        variant="error"
        icon="error"
        title="Ошибка загрузки транзакций"
        :content="error"
      />

      <!-- Загрузка -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <HenaketLoadingSpinner />
      </div>

      <!-- Таблица транзакций -->
      <div v-else-if="tableData.length">
        <HenaketDataTable
          v-model:sort="sortOrder"
          :headers="headers"
          :items="tableData"
          :disabled="isLoading"
          stickyHeader
        />

        <!-- Статистика -->
        <div class="mt-4 text-sm text-gray-600">
          Показано {{ tableData.length }} из
          {{ transactions.length }} транзакций
        </div>
      </div>

      <!-- Пустое состояние -->
      <div v-else class="text-center py-12">
        <HenaketIcon
          icon="receipt_long"
          size="48px"
          class="mb-4 text-gray-400"
        />
        <h3 class="text-lg font-medium text-gray-700 mb-2">Нет транзакций</h3>
        <p class="text-gray-500 mb-4">
          {{
            filters.search ||
            filters.categoryId ||
            filters.startDate ||
            filters.endDate
              ? "По заданным фильтрам транзакции не найдены"
              : "Добавьте первую транзакцию для начала работы"
          }}
        </p>

        <HenaketButton
          v-if="
            filters.search ||
            filters.categoryId ||
            filters.startDate ||
            filters.endDate
          "
          variant="outlined"
          @click="resetFilters"
        >
          Сбросить фильтры
        </HenaketButton>
      </div>
    </div>
  </HenaketCard>
</template>
