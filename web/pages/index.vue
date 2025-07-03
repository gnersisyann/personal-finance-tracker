<script setup lang="ts">
const showCategoryModal = ref(false);
const selectedCategoryIds = ref<number[]>([]);

function handleCategorySelection(ids: number[]) {
  selectedCategoryIds.value = ids;
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Личные финансы</h1>

      <div class="flex gap-3">
        <HenaketButton variant="primary" @click="showCategoryModal = true">
          <HenaketIcon icon="add" size="16px" class="mr-2" />
          Добавить категорию
        </HenaketButton>

        <HenaketButton
          variant="outlined"
          :disabled="!selectedCategoryIds.length"
        >
          <HenaketIcon icon="delete" size="16px" class="mr-2" />
          Удалить выбранные
        </HenaketButton>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AppCategoryList @selectionChanged="handleCategorySelection" />
      <AppTransactionList />
    </div>

    <AppCategoryModal v-model="showCategoryModal" />
  </div>
</template>
