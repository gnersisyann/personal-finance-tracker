<script setup lang="ts">
const selectedIds = ref<number[]>([]);
const showAddModal = ref(false);
const newCategoryName = ref("");
const newCategoryColor = ref("#3b82f6");
const isSubmitting = ref(false);

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

function handleSelectionChanged(ids: number[]) {
  selectedIds.value = ids;
}

async function deleteSelected() {
  if (selectedIds.value.length === 0) return;

  const confirmMessage =
    selectedIds.value.length === 1
      ? "Are you sure you want to delete this category?"
      : `Are you sure you want to delete ${selectedIds.value.length} categories?`;

  if (!confirm(confirmMessage)) return;

  try {
    isSubmitting.value = true;

    for (const id of selectedIds.value) {
      await removeCategoryTransaction(id);
      await removeCategory(id);
    }

    selectedIds.value = [];
  } catch (error) {
    console.error("Failed to delete categories:", error);
  } finally {
    isSubmitting.value = false;
  }
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
      <HenaketButton
        variant="primary"
        @click="openAddModal"
        :disabled="isSubmitting"
      >
        <HenaketIcon icon="add" size="20px" />
        Add Category
      </HenaketButton>

      <HenaketButton
        v-if="selectedIds.length > 0"
        variant="outlined"
        @click="deleteSelected"
        :disabled="isSubmitting"
      >
        <HenaketIcon icon="delete" size="20px" />
        Delete Selected ({{ selectedIds.length }})
      </HenaketButton>
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
            <HenaketButton
              variant="outlined"
              @click="closeAddModal"
              :disabled="isSubmitting"
              class="flex-1"
            >
              <HenaketIcon icon="close" size="20px" />
              Cancel
            </HenaketButton>

            <HenaketButton
              variant="primary"
              @click="submitAddCategory"
              :disabled="isSubmitting || !newCategoryName.trim()"
              class="flex-1"
            >
              <HenaketIcon icon="add" size="20px" />
              Add Category
            </HenaketButton>
          </div>
        </div>
      </template>
    </HenaketModal>
  </div>
</template>
