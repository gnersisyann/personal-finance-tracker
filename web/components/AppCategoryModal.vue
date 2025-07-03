<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const { addCategory } = useCategories();

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const categoryName = ref("");
const isSubmitting = ref(false);

async function handleSubmit() {
  if (!categoryName.value.trim()) return;

  try {
    isSubmitting.value = true;
    await addCategory(categoryName.value.trim());
    categoryName.value = "";
    isVisible.value = false;
  } catch (error) {
    console.error("Failed to create category:", error);
  } finally {
    isSubmitting.value = false;
  }
}

function handleClose() {
  categoryName.value = "";
  isVisible.value = false;
}
</script>

<template>
  <HenaketModal v-model="isVisible">
    <template #title> Добавить категорию </template>

    <template #description>
      <div class="space-y-4">
        <HenaketInputField
          v-model="categoryName"
          label="Название категории"
          type="text"
          placeholder="Введите название..."
        />
      </div>
    </template>

    <template #actions>
      <div class="flex gap-3">
        <HenaketButton
          variant="primary"
          :disabled="!categoryName.trim() || isSubmitting"
          @click="handleSubmit"
        >
          <HenaketLoadingSpinner v-if="isSubmitting" class="w-4 h-4 mr-2" />
          Добавить
        </HenaketButton>

        <HenaketButton variant="outlined" @click="handleClose">
          Отмена
        </HenaketButton>
      </div>
    </template>
  </HenaketModal>
</template>
