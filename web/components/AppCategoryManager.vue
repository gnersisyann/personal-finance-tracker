<script setup lang="ts">
const selectedIds = ref<number[]>([]);
const showAddModal = ref(false);
const newCategoryName = ref("");
const newCategoryColor = ref("#3b82f6");
const isSubmitting = ref(false);

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
    <div class="flex flex-wrap gap-3">
      <HenaketButton
        @click="openAddModal"
        :disabled="isSubmitting"
        variant="primary"
        size="regular"
      >
        <HenaketIcon icon="add" size="20px" />
        Add Category
      </HenaketButton>

      <HenaketButton
        v-if="selectedIds.length > 0"
        @click="showDeleteConfirmation"
        :disabled="isSubmitting"
        variant="outlined"
        color="red"
        size="regular"
      >
        <HenaketIcon icon="delete" size="20px" />
        Delete Selected ({{ selectedIds.length }})
      </HenaketButton>
    </div>

    <AppCategoryList @selection-changed="handleSelectionChanged" />

    <HenaketModal v-model="showAddModal">
      <template #title>
        <div class="flex items-center gap-3">
          <HenaketIcon icon="add_circle" size="24px" class="text-green-600" />
          Add New Category
        </div>
      </template>

      <template #description>
        <div class="space-y-6">
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

          <div class="space-y-4">
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

            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700">
                Category Color
              </label>

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

          <div class="flex gap-3 pt-4">
            <HenaketButton
              @click="closeAddModal"
              :disabled="isSubmitting"
              variant="outlined"
              size="regular"
              class="flex-1"
            >
              <HenaketIcon icon="close" size="20px" />
              Cancel
            </HenaketButton>

            <HenaketButton
              @click="submitAddCategory"
              :disabled="isSubmitting || !newCategoryName.trim()"
              variant="primary"
              size="regular"
              class="flex-1"
            >
              <HenaketIcon v-if="!isSubmitting" icon="add" size="20px" />
              <div
                v-else
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              {{ isSubmitting ? "Adding..." : "Add Category" }}
            </HenaketButton>
          </div>
        </div>
      </template>
    </HenaketModal>

    <HenaketModal v-model="deleteModal">
      <template #title>
        <div class="flex items-center gap-3">
          <HenaketIcon icon="warning" size="28px" class="text-red-600" />
          <span class="text-xl font-semibold text-red-700">
            {{
              deleteData?.isMultiple
                ? "Delete Multiple Categories"
                : "Delete Category"
            }}
          </span>
        </div>
      </template>

      <template #description>
        <div class="max-w-full space-y-6">
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
                  <HenaketIcon
                    icon="delete"
                    size="20px"
                    class="text-red-500 mb-4"
                  />
                </div>
              </HenaketCard>
            </div>

            <HenaketCard class="p-4 bg-gray-50">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 font-medium"
                    >Categories to delete:</span
                  >
                  <HenaketBadge class="mr-44" backgroundColor="#ef4444">
                    {{ deleteData.count }}
                  </HenaketBadge>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 font-medium">Impact:</span>
                  <span class="ml-4 text-red-600 font-semibold">
                    All related transactions will be removed
                  </span>
                </div>
              </div>
            </HenaketCard>
          </div>

          <div v-else class="space-y-4">
            <h4 class="font-medium text-gray-800">Category Details:</h4>
            <HenaketCard class="p-4 bg-gray-50">
              <div class="text-center text-gray-500">
                <HenaketIcon icon="error" size="24px" class="mx-auto mb-2" />
                <p>Unable to load category details</p>
              </div>
            </HenaketCard>
          </div>

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
              :disabled="isDeleting || !deleteData"
              variant="danger"
              size="regular"
              class="flex-1"
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
            </HenaketButton>
          </div>
        </div>
      </template>
    </HenaketModal>
  </div>
</template>
