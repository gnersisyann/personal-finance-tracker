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
      await updateCategory(catId, { name: editingName.value.trim() });
      editingId.value = null;
      editingName.value = "";
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  }
}

function cancelEdit() {
  editingId.value = null;
  editingName.value = "";
}
</script>

<template>
  <HenaketCard class="p-6">
    <div class="flex flex-col gap-4">
      <h2 class="text-xl font-semibold text-gray-800">Категории</h2>

      <!-- Поиск -->
      <HenaketInputField
        v-model="search"
        label="Поиск категорий"
        type="text"
        placeholder="Введите название категории..."
      />

      <!-- Уведомление об ошибке -->
      <HenaketAlert
        v-if="error"
        variant="error"
        icon="error"
        title="Ошибка"
        :content="error"
      />

      <!-- Загрузка -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <HenaketLoadingSpinner />
      </div>

      <!-- Список категорий -->
      <div v-else class="space-y-2">
        <HenaketCard
          v-for="category in filteredCategories"
          :key="category.id"
          class="p-4"
          staticDisplay
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <HenaketCheckbox
                :name="`category-${category.id}`"
                :value="category.id.toString()"
                :modelValue="selectedIds.includes(category.id)"
                @update:modelValue="toggleSelect(category.id)"
              />

              <div
                v-if="editingId === category.id"
                class="flex items-center gap-2"
              >
                <HenaketInputField
                  v-model="editingName"
                  type="text"
                  class="min-w-0"
                />
                <HenaketButton
                  variant="primary"
                  size="regular"
                  @click="saveEdit(category.id)"
                >
                  <HenaketIcon icon="check" size="16px" />
                </HenaketButton>
                <HenaketButton
                  variant="outlined"
                  size="regular"
                  @click="cancelEdit"
                >
                  <HenaketIcon icon="close" size="16px" />
                </HenaketButton>
              </div>

              <span v-else class="text-gray-800 font-medium">
                {{ category.name }}
              </span>
            </div>

            <HenaketButton
              v-if="editingId !== category.id"
              variant="icon"
              @click="startEdit(category.id, category.name)"
            >
              <HenaketIcon icon="edit" size="16px" />
            </HenaketButton>
          </div>
        </HenaketCard>

        <!-- Сообщение об отсутствии данных -->
        <div
          v-if="!filteredCategories.length"
          class="text-center py-8 text-gray-500"
        >
          <HenaketIcon icon="folder_open" size="48px" class="mb-2" />
          <p>Категории не найдены</p>
        </div>
      </div>
    </div>
  </HenaketCard>
</template>
