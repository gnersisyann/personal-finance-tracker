<script setup lang="ts">
const selectedIds = ref<number[]>([]);
const showAddModal = ref(false);
const newCategoryName = ref("");
const newCategoryColor = ref("#3b82f6");
const isSubmitting = ref(false);

// Добавляем состояние для модального окна удаления
const deleteModal = ref(false);
const categoriesToDelete = ref<number[]>([]);
const isDeleting = ref(false);

const {
  categories,
  addCategory,
  removeCategory,
  isLoading: categoriesLoading,
  loadCategories,
  error: categoriesError,
} = useCategories();

const { removeCategoryTransaction } = useTransactions();

onMounted(async () => {
  await loadCategories();
});

// Computed для данных удаляемых категорий
const deleteData = computed(() => {
  if (categoriesToDelete.value.length === 0) return null;

  const categoriesToDeleteData = categories.value.filter((cat) =>
    categoriesToDelete.value.includes(cat.id)
  );

  return {
    categories: categoriesToDeleteData,
    count: categoriesToDeleteData.length,
    isMultiple: categoriesToDeleteData.length > 1,
  };
});

function handleSelectionChanged(ids: number[]) {
  selectedIds.value = ids;
}

// Заменяем старую функцию deleteSelected
function showDeleteConfirmation() {
  if (selectedIds.value.length === 0) return;

  categoriesToDelete.value = [...selectedIds.value];
  deleteModal.value = true;
}

async function confirmDelete() {
  if (categoriesToDelete.value.length === 0) return;

  try {
    isDeleting.value = true;

    for (const id of categoriesToDelete.value) {
      await removeCategoryTransaction(id);
      await removeCategory(id);
    }

    selectedIds.value = [];
    categoriesToDelete.value = [];
    deleteModal.value = false;
  } catch (error) {
    console.error("Failed to delete categories:", error);
  } finally {
    isDeleting.value = false;
  }
}

function cancelDelete() {
  deleteModal.value = false;
  categoriesToDelete.value = [];
}

function openAddModal() {
  newCategoryName.value = "";
  newCategoryColor.value = "#3b82f6";
  showAddModal.value = true;
}

function closeAddModal() {
  showAddModal.value = false;
  newCategoryName.value = "";
  newCategoryColor.value = "#3b82f6";
}

async function submitAddCategory() {
  if (!newCategoryName.value.trim()) return;

  try {
    isSubmitting.value = true;
    await addCategory({
      name: newCategoryName.value.trim(),
      color: newCategoryColor.value,
    });
    closeAddModal();
  } catch (error) {
    console.error("Failed to add category:", error);
  } finally {
    isSubmitting.value = false;
  }
}

// Предустановленные цвета
const colorPresets = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#6366f1",
  "#14b8a6",
  "#eab308",
];
</script>

<template>
  <div class="space-y-6">
    <!-- Кнопки управления -->
    <div class="flex flex-wrap gap-3">
      <button
        @click="openAddModal"
        :disabled="isSubmitting"
        class="inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <HenaketIcon icon="add" size="20px" />
        Add Category
      </button>

      <button
        v-if="selectedIds.length > 0"
        @click="showDeleteConfirmation"
        :disabled="isSubmitting"
        class="inline-flex items-center gap-2 px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <HenaketIcon icon="delete" size="20px" />
        Delete Selected ({{ selectedIds.length }})
      </button>
    </div>

    <!-- Список категорий -->
    <AppCategoryList @selection-changed="handleSelectionChanged" />

    <!-- Модальное окно добавления категории -->
    <HenaketModal v-model="showAddModal">
      <template #title>
        <div class="flex items-center gap-3">
          <HenaketIcon icon="add_circle" size="24px" class="text-green-600" />
          Add New Category
        </div>
      </template>

      <template #description>
        <div class="space-y-6">
          <!-- Заголовок формы -->
          <div class="text-center pb-4">
            <HenaketIcon
              icon="category"
              size="48px"
              class="text-green-600 mx-auto mb-3"
            />
            <h3 class="text-xl font-semibold text-gray-800">Create Category</h3>
            <p class="text-gray-600 mt-1">
              Add a new category to organize your transactions
            </p>
          </div>

          <!-- Поля формы -->
          <div class="space-y-4">
            <!-- Название категории -->
            <HenaketInputField
              v-model="newCategoryName"
              label="Category Name"
              placeholder="Enter category name..."
              :disabled="isSubmitting"
              required
            >
              <template #prefix>
                <HenaketIcon icon="label" size="20px" />
              </template>
            </HenaketInputField>

            <!-- Выбор цвета -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700">
                Category Color
              </label>

              <!-- Текущий цвет -->
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full border-2 border-gray-300"
                  :style="{ backgroundColor: newCategoryColor }"
                ></div>
                <input
                  v-model="newCategoryColor"
                  type="color"
                  class="w-16 h-8 rounded border border-gray-300 cursor-pointer"
                  :disabled="isSubmitting"
                />
                <span class="text-sm text-gray-500">{{
                  newCategoryColor
                }}</span>
              </div>

              <!-- Предустановленные цвета -->
              <div class="grid grid-cols-6 gap-2">
                <button
                  v-for="color in colorPresets"
                  :key="color"
                  :class="[
                    'w-8 h-8 rounded-full border-2 transition-all',
                    newCategoryColor === color
                      ? 'border-gray-800 scale-110'
                      : 'border-gray-300 hover:border-gray-500',
                  ]"
                  :style="{ backgroundColor: color }"
                  @click="newCategoryColor = color"
                  :disabled="isSubmitting"
                />
              </div>
            </div>
          </div>

          <!-- Предпросмотр -->
          <HenaketCard
            v-if="newCategoryName.trim()"
            class="p-4 bg-green-50 border-green-200"
          >
            <div class="flex items-center gap-3">
              <HenaketIcon icon="preview" size="24px" class="text-green-600" />
              <div>
                <h4 class="font-semibold text-green-800">Preview</h4>
                <div class="flex items-center gap-2 mt-1">
                  <div
                    class="w-4 h-4 rounded-full"
                    :style="{ backgroundColor: newCategoryColor }"
                  ></div>
                  <span class="text-green-700 font-medium">{{
                    newCategoryName.trim()
                  }}</span>
                </div>
              </div>
            </div>
          </HenaketCard>

          <!-- Кнопки -->
          <div class="flex gap-3 pt-4">
            <button
              @click="closeAddModal"
              :disabled="isSubmitting"
              class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HenaketIcon icon="close" size="20px" />
              Cancel
            </button>

            <button
              @click="submitAddCategory"
              :disabled="isSubmitting || !newCategoryName.trim()"
              class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HenaketIcon v-if="!isSubmitting" icon="add" size="20px" />
              <div
                v-else
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              {{ isSubmitting ? "Adding..." : "Add Category" }}
            </button>
          </div>
        </div>
      </template>
    </HenaketModal>

    <!-- Модальное окно подтверждения удаления -->
    <HenaketModal v-model="deleteModal">
      <template #title>
        <div class="flex items-center gap-3">
          <HenaketIcon icon="warning" size="24px" class="text-red-600" />
          {{
            deleteData?.isMultiple
              ? "Delete Multiple Categories"
              : "Delete Category"
          }}
        </div>
      </template>

      <template #description>
        <div class="space-y-6">
          <!-- Предупреждение -->
          <HenaketAlert
            variant="warning"
            icon="warning"
            title="This action cannot be undone"
            :content="
              deleteData?.isMultiple
                ? `Are you sure you want to delete ${deleteData.count} categories? This will also remove all associated transactions.`
                : 'Are you sure you want to delete this category? This will also remove all associated transactions.'
            "
          />

          <!-- Список удаляемых категорий -->
          <div v-if="deleteData" class="space-y-4">
            <h4 class="font-medium text-gray-800">
              {{
                deleteData.isMultiple
                  ? "Categories to Delete:"
                  : "Category to Delete:"
              }}
            </h4>

            <div class="space-y-3 max-h-60 overflow-y-auto">
              <HenaketCard
                v-for="category in deleteData.categories"
                :key="category.id"
                class="p-4 bg-red-50 border-red-200"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-6 h-6 rounded-full border-2 border-red-300"
                    :style="{ backgroundColor: category.color || '#3b82f6' }"
                  ></div>
                  <div class="flex-1">
                    <div class="font-semibold text-red-800">
                      {{ category.name }}
                    </div>
                    <div class="text-sm text-red-600">
                      ID: {{ category.id }} • Color:
                      {{ category.color || "#3b82f6" }}
                    </div>
                  </div>
                  <HenaketIcon icon="delete" size="20px" class="text-red-500" />
                </div>
              </HenaketCard>
            </div>

            <!-- Статистика удаления -->
            <HenaketCard class="p-4 bg-gray-50">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 font-medium"
                    >Categories to delete:</span
                  >
                  <HenaketBadge backgroundColor="#ef4444">
                    {{ deleteData.count }}
                  </HenaketBadge>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 font-medium">Impact:</span>
                  <span class="text-red-600 font-semibold">
                    All related transactions will be removed
                  </span>
                </div>
              </div>
            </HenaketCard>
          </div>

          <!-- Fallback если данные не загружены -->
          <div v-else class="space-y-4">
            <h4 class="font-medium text-gray-800">Category Details:</h4>
            <HenaketCard class="p-4 bg-gray-50">
              <div class="text-center text-gray-500">
                <HenaketIcon icon="error" size="24px" class="mx-auto mb-2" />
                <p>Unable to load category details</p>
              </div>
            </HenaketCard>
          </div>

          <!-- Дополнительные предупреждения -->
          <div class="space-y-3">
            <HenaketInfoCard
              icon="info"
              title="What happens when you delete categories?"
              content="All transactions associated with these categories will also be permanently deleted. This action affects your financial statistics and cannot be undone."
            />

            <HenaketInfoCard
              icon="tips_and_updates"
              title="Alternative Action"
              content="Consider editing category names instead of deleting them if you want to reorganize without losing transaction history."
            />
          </div>

          <!-- Кнопки действий -->
          <div class="flex gap-3 pt-4">
            <button
              @click="cancelDelete"
              :disabled="isDeleting"
              class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <HenaketIcon icon="close" size="20px" />
              Cancel
            </button>

            <button
              @click="confirmDelete"
              :disabled="isDeleting || !deleteData"
              class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <HenaketIcon v-if="!isDeleting" icon="delete" size="20px" />
              <div
                v-else
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              {{
                isDeleting
                  ? "Deleting..."
                  : deleteData?.isMultiple
                  ? `Delete ${deleteData.count} Categories`
                  : "Delete Category"
              }}
            </button>
          </div>
        </div>
      </template>
    </HenaketModal>
  </div>
</template>
