<script setup lang="ts">
const emit = defineEmits(["selectionChanged"]);

const { categories, updateCategory, isLoading, error } = useCategories();

const search = ref("");
const selectedIds = ref<number[]>([]);
const editingId = ref<number | null>(null);
const editingName = ref("");

const filteredCategories = computed(() =>
  categories.value.filter((cat) =>
    cat.name.toLowerCase().includes(search.value.trim().toLowerCase())
  )
);

function toggleSelect(id: number) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((catId) => catId !== id);
  } else {
    selectedIds.value = [...selectedIds.value, id];
  }
  emit("selectionChanged", selectedIds.value);
}

function startEdit(catId: number, name: string) {
  editingId.value = catId;
  editingName.value = name;
}

async function saveEdit(catId: number) {
  if (editingName.value.trim()) {
    try {
      await updateCategory(catId, { name: editingName.value.trim() }); // Исправлено
      editingId.value = null;
      editingName.value = "";
    } catch (err) {
      console.error("Failed to update category:", err);
    }
  }
}

function cancelEdit() {
  editingId.value = null;
  editingName.value = "";
}
</script>

<template>
  <div>
    <div v-if="isLoading" style="text-align: center; padding: 20px">
      Loading categories...
    </div>

    <div v-if="error" style="color: red; margin-bottom: 12px">
      Error: {{ error }}
    </div>

    <div v-if="!isLoading" style="margin-bottom: 16px">
      <label>
        Search:
        <input type="text" v-model="search" placeholder="Category name..." />
      </label>
    </div>

    <table v-if="filteredCategories.length && !isLoading" border="1">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in filteredCategories" :key="cat.id">
          <td>
            <input
              type="checkbox"
              :value="cat.id"
              :checked="selectedIds.includes(cat.id)"
              @change="toggleSelect(cat.id)"
            />
          </td>
          <td>
            <template v-if="editingId === cat.id">
              <input v-model="editingName" @keyup.enter="saveEdit(cat.id)" />
            </template>
            <template v-else>
              {{ cat.name }}
            </template>
          </td>
          <td>
            <template v-if="editingId === cat.id">
              <button @click="saveEdit(cat.id)">Save</button>
              <button @click="cancelEdit">Cancel</button>
            </template>
            <template v-else>
              <button @click="startEdit(cat.id, cat.name)">Edit</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      class="no-data"
      v-else-if="!isLoading && !filteredCategories.length"
      style="text-align: center; color: #888; margin: 24px 0"
    >
      No categories to display
    </div>
  </div>
</template>
