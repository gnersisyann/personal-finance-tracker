<template>
  <div class="space-y-6">
    <!-- Заголовок страницы с навигацией -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <HenaketButton
          variant="outlined"
          size="regular"
          @click="navigateHome"
          class="px-4 py-2"
        >
          <HenaketIcon icon="arrow_back" size="20px" />
          Home
        </HenaketButton>
        <h1 class="text-2xl font-bold text-gray-800">Category Management</h1>
      </div>
    </div>

    <!-- Информация о категориях -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Основной контент -->
      <div class="lg:col-span-2">
        <div class="p-6 bg-white rounded-lg border border-gray-200 shadow">
          <div class="flex items-center gap-3 mb-6">
            <HenaketIcon icon="category" size="24px" class="text-purple-600" />
            <h3 class="text-lg font-semibold text-gray-800">Your Categories</h3>
          </div>
          <AppCategoryManager ref="categoryManager" />
        </div>
      </div>

      <!-- Боковая панель с информацией -->
      <div class="space-y-4">
        <!-- About Categories Info -->
        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-start gap-3">
            <HenaketIcon icon="info" size="20px" class="text-blue-600 mt-0.5" />
            <div>
              <h4 class="font-medium text-blue-800">About Categories</h4>
              <p class="text-blue-700 text-sm mt-1">
                Categories help you organize your expenses and income. Create
                meaningful categories like 'Food', 'Transport', 'Entertainment'
                etc.
              </p>
            </div>
          </div>
        </div>

        <!-- Better Tracking Card -->
        <div class="p-4 bg-white rounded-lg border border-gray-200 shadow">
          <div class="text-center space-y-3">
            <HenaketIcon
              icon="trending_up"
              size="32px"
              class="text-green-600 mx-auto"
            />
            <h4 class="font-semibold text-gray-800">Better Tracking</h4>
            <p class="text-sm text-gray-600">
              Well-organized categories make it easier to analyze your spending
              patterns and budget effectively.
            </p>
          </div>
        </div>

        <!-- Customize Card -->
        <div class="p-4 bg-white rounded-lg border border-gray-200 shadow">
          <div class="text-center space-y-3">
            <HenaketIcon
              icon="palette"
              size="32px"
              class="text-blue-600 mx-auto"
            />
            <h4 class="font-semibold text-gray-800">Customize</h4>
            <p class="text-sm text-gray-600">
              Each category can have its own name and color to make your finance
              tracking more visual and intuitive.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Дополнительные советы -->
    <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div class="flex items-start gap-3">
        <HenaketIcon
          icon="tips_and_updates"
          size="20px"
          class="text-yellow-600 mt-0.5"
        />
        <div>
          <h4 class="font-medium text-yellow-800">Getting Started Tips</h4>
          <p class="text-yellow-700 text-sm mt-1">
            Start with basic categories like Income, Food, Transportation, and
            Entertainment. You can always add more specific categories later as
            your tracking needs grow.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const categoryManager = ref();

// Навигация
const navigateHome = () => {
  navigateTo("/");
};

const scrollToManager = () => {
  categoryManager.value?.$el?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

// SEO
useHead({
  title: "Categories - Personal Finance Tracker",
  meta: [
    {
      name: "description",
      content: "Manage and organize your expense categories",
    },
  ],
});
</script>
