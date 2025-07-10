<script setup lang="ts">
const emit = defineEmits(["selectionChanged"]);

const { categories, updateCategory, loadCategories, isLoading, error } =
  useCategories();

const search = ref("");
const selectedIds = ref<number[]>([]);
const editingId = ref<number | null>(null);
const editingName = ref("");
const editingColor = ref("#3b82f6");

onMounted(async () => {
  await loadCategories();
});

const filteredCategories = computed(() =>
  categories.value.filter((cat) =>
    cat.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

function toggleSelect(id: number) {
  const index = selectedIds.value.indexOf(id);
  if (index > -1) {
    selectedIds.value.splice(index, 1);
  } else {
    selectedIds.value.push(id);
  }
  emit("selectionChanged", selectedIds.value);
}

function selectAll() {
  if (selectedIds.value.length === filteredCategories.value.length) {
    selectedIds.value = [];
  } else {
    selectedIds.value = filteredCategories.value.map((cat) => cat.id);
  }
  emit("selectionChanged", selectedIds.value);
}

function startEdit(catId: number, name: string, color?: string) {
  editingId.value = catId;
  editingName.value = name;
  editingColor.value = color || "#3b82f6";
}

async function saveEdit(catId: number) {
  if (!editingName.value.trim()) {
    cancelEdit();
    return;
  }

  try {
    await updateCategory(catId, {
      name: editingName.value.trim(),
      color: editingColor.value,
    });
    cancelEdit();
  } catch (error) {
    console.error("Failed to update category:", error);
  }
}

function cancelEdit() {
  editingId.value = null;
  editingName.value = "";
  editingColor.value = "#3b82f6";
}

const isAllSelected = computed(
  () =>
    filteredCategories.value.length > 0 &&
    selectedIds.value.length === filteredCategories.value.length
);

const isPartiallySelected = computed(
  () =>
    selectedIds.value.length > 0 &&
    selectedIds.value.length < filteredCategories.value.length
);
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-4">
      <HenaketInputField
        v-model="search"
        label="Search categories"
        placeholder="Search by name..."
      >
        <template #prefix>
          <HenaketIcon icon="search" size="20px" />
        </template>
        <template #suffix v-if="search">
          <button
            @click="search = ''"
            class="text-gray-400 hover:text-gray-600"
          >
            <HenaketIcon icon="close" size="18px" />
          </button>
        </template>
      </HenaketInputField>

      <div
        v-if="filteredCategories.length > 0"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center gap-3">
          <HenaketCheckbox
            name="selectAll"
            value="selectAll"
            :modelValue="isAllSelected"
            @update:modelValue="selectAll"
          />
          <span class="text-sm font-medium text-gray-700">
            {{ selectedIds.length }} of {{ filteredCategories.length }} selected
          </span>
        </div>

        <div class="flex items-center gap-2">
          <HenaketBadge backgroundColor="#3b82f6">
            {{ filteredCategories.length }} categories
          </HenaketBadge>
        </div>
      </div>
    </div>

    <HenaketAlert
      v-if="isLoading"
      variant="info"
      title="Loading categories..."
      icon="hourglass_empty"
    />

    <HenaketAlert
      v-else-if="error"
      variant="error"
      title="Error loading categories"
      :content="error"
      icon="error"
    />

    <div v-else-if="filteredCategories.length > 0" class="space-y-2">
      <HenaketCard
        v-for="category in filteredCategories"
        :key="category.id"
        class="p-4 transition-all hover:shadow-md"
        :class="{ 'ring-2 ring-blue-500': selectedIds.includes(category.id) }"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 flex-1">
            <HenaketCheckbox
              :name="`category-${category.id}`"
              :value="category.id.toString()"
              :modelValue="selectedIds.includes(category.id)"
              @update:modelValue="toggleSelect(category.id)"
            />

            <div class="flex items-center gap-3 flex-1">
              <div
                class="w-4 h-4 rounded-full flex-shrink-0"
                :style="{ backgroundColor: category.color || '#3b82f6' }"
              ></div>

              <div v-if="editingId !== category.id" class="flex-1">
                <div class="font-medium text-gray-800">{{ category.name }}</div>
                <div class="text-xs text-gray-500">
                  ID: {{ category.id }} • {{ category.color || "#3b82f6" }}
                </div>
              </div>

              <div v-else class="flex-1">
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <input
                      v-model="editingName"
                      type="text"
                      class="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      @keyup.enter="saveEdit(category.id)"
                      @keyup.escape="cancelEdit"
                      ref="editInput"
                    />
                  </div>
                  <div class="flex items-center gap-2">
                    <input
                      v-model="editingColor"
                      type="color"
                      class="w-8 h-6 rounded border border-gray-300 cursor-pointer"
                    />
                    <span class="text-xs text-gray-500">{{
                      editingColor
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <template v-if="editingId !== category.id">
              <HenaketButton
                variant="icon"
                @click="startEdit(category.id, category.name, category.color)"
              >
                <HenaketIcon icon="edit" size="16px" />
              </HenaketButton>
            </template>

            <template v-else>
              <HenaketButton
                variant="icon"
                @click="saveEdit(category.id)"
                :disabled="!editingName.trim()"
              >
                <HenaketIcon icon="check" size="16px" />
              </HenaketButton>

              <HenaketButton variant="icon" @click="cancelEdit">
                <HenaketIcon icon="close" size="16px" />
              </HenaketButton>
            </template>
          </div>
        </div>

        <div
          v-if="selectedIds.includes(category.id)"
          class="mt-3 pt-3 border-t border-gray-200"
        >
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <HenaketIcon icon="info" size="14px" />
            <span>This category is selected for bulk actions</span>
          </div>
        </div>
      </HenaketCard>
    </div>

    <HenaketCard v-else-if="!isLoading && !error" class="p-8">
      <div class="text-center space-y-4">
        <HenaketIcon
          icon="category"
          size="48px"
          class="text-gray-400 mx-auto"
        />
        <div>
          <h4 class="text-lg font-medium text-gray-600">
            {{ search ? "No categories found" : "No categories yet" }}
          </h4>
          <p class="text-gray-500 mt-1">
            {{
              search
                ? `No categories match "${search}". Try a different search term.`
                : "Create your first category to get started with organizing your transactions."
            }}
          </p>
        </div>

        <HenaketButton v-if="search" variant="outlined" @click="search = ''">
          <HenaketIcon icon="clear" size="18px" />
          Clear Search
        </HenaketButton>
      </div>
    </HenaketCard>

    <HenaketInfoCard
      v-if="selectedIds.length > 0"
      icon="info"
      title="Selection Info"
      :content="`${selectedIds.length} ${
        selectedIds.length === 1 ? 'category' : 'categories'
      } selected. Use the delete button above to remove selected categories.`"
    />

    <div v-if="filteredCategories.length > 0" class="flex flex-wrap gap-2 pt-2">
      <HenaketButton variant="outlined" @click="selectAll">
        <HenaketIcon icon="select_all" size="16px" />
        {{ isAllSelected ? "Deselect All" : "Select All" }}
      </HenaketButton>

      <HenaketButton
        v-if="selectedIds.length > 0"
        variant="outlined"
        @click="
          selectedIds = [];
          emit('selectionChanged', []);
        "
      >
        <HenaketIcon icon="deselect" size="16px" />
        Clear Selection
      </HenaketButton>
    </div>
  </div>
</template>
