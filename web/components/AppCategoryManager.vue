<script setup lang="ts">
const selectedIds = ref<number[]>([]);
const { addCategory, removeCategory } = useCategories();
const { removeCategoryTransaction } = useTransactions();

const showAddModal = ref(false);
const newCategoryName = ref("");

function handleSelectionChanged(ids: number[]) {
  selectedIds.value = ids;
}

function deleteSelected() {
  selectedIds.value.forEach((id) => {
    removeCategory(id);
    removeCategoryTransaction(id);
  });
  selectedIds.value = [];
}

function openAddModal() {
  showAddModal.value = true;
  newCategoryName.value = "";
}

function closeAddModal() {
  showAddModal.value = false;
  newCategoryName.value = "";
}

function submitAddCategory() {
  if (newCategoryName.value.trim()) {
    addCategory(newCategoryName.value.trim());
    closeAddModal();
  }
}
</script>

<template>
  <button @click="openAddModal" style="margin-bottom: 12px">
    Add category
  </button>
  <AppCategoryList @selectionChanged="handleSelectionChanged" />
  <button
    v-if="selectedIds.length"
    @click="deleteSelected"
    style="margin: 12px 0; color: white; background: #e11d48"
  >
    Delete selected
  </button>
  <div v-if="showAddModal" class="modal">
    <div class="modal-content">
      <h3>Add Category</h3>
      <input v-model="newCategoryName" placeholder="Category name" />
      <div style="margin-top: 12px">
        <button @click="submitAddCategory">Add</button>
        <button @click="closeAddModal" style="margin-left: 8px">Cancel</button>
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
