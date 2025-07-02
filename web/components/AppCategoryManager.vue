<script setup lang="ts">
const selectedIds = ref<number[]>([]);
const showAddModal = ref(false);
const newCategoryName = ref("");
const isSubmitting = ref(false);

const {
  addCategory,
  removeCategory,
  isLoading: categoriesLoading,
  error: categoriesError,
  loadCategories,
} = useCategories();
const { removeCategoryTransaction } = useTransactions();

onMounted(async () => {
  await loadCategories();
});

function handleSelectionChanged(ids: number[]) {
  selectedIds.value = ids;
}

async function deleteSelected() {
  if (!selectedIds.value.length) return;

  try {
    isSubmitting.value = true;

    // TODO: batch
    for (const id of selectedIds.value) {
      await removeCategory(id);
      removeCategoryTransaction(id);
    }

    selectedIds.value = [];
  } catch (err) {
    console.error("Failed to delete categories:", err);
  } finally {
    isSubmitting.value = false;
  }
}

function openAddModal() {
  showAddModal.value = true;
  newCategoryName.value = "";
}

function closeAddModal() {
  showAddModal.value = false;
  newCategoryName.value = "";
}

async function submitAddCategory() {
  if (!newCategoryName.value.trim()) return;

  try {
    isSubmitting.value = true;
    await addCategory(newCategoryName.value.trim());
    closeAddModal();
  } catch (err) {
    console.error("Failed to add category:", err);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div>
    <div v-if="categoriesLoading" style="color: #6366f1; margin-bottom: 12px">
      Loading categories...
    </div>

    <div v-if="categoriesError" style="color: red; margin-bottom: 12px">
      Error: {{ categoriesError }}
      <button @click="loadCategories()" style="margin-left: 8px">Retry</button>
    </div>

    <button
      @click="openAddModal"
      style="margin-bottom: 12px"
      :disabled="isSubmitting || categoriesLoading"
    >
      Add category
    </button>

    <AppCategoryList @selectionChanged="handleSelectionChanged" />

    <button
      v-if="selectedIds.length"
      @click="deleteSelected"
      style="margin: 12px 0; color: white; background: #e11d48"
      :disabled="isSubmitting || categoriesLoading"
    >
      {{
        isSubmitting ? "Deleting..." : `Delete selected (${selectedIds.length})`
      }}
    </button>

    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>Add Category</h3>
        <input
          v-model="newCategoryName"
          placeholder="Category name"
          :disabled="isSubmitting"
          @keyup.enter="submitAddCategory"
        />
        <div style="margin-top: 12px">
          <button
            @click="submitAddCategory"
            :disabled="isSubmitting || !newCategoryName.trim()"
          >
            {{ isSubmitting ? "Adding..." : "Add" }}
          </button>
          <button
            @click="closeAddModal"
            style="margin-left: 8px"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 300px;
}
</style>
