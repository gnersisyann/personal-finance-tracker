<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
    <!-- Заголовок -->
    <div class="text-center space-y-4">
      <HenaketIcon
        icon="account_balance_wallet"
        size="80px"
        class="text-blue-600 mx-auto"
      />
      <h1 class="text-4xl font-bold text-gray-800">Finance Tracker</h1>
      <p class="text-lg text-gray-600 max-w-md">
        Manage your personal finances with ease. Track transactions, categorize
        expenses, and monitor your budget.
      </p>
    </div>

    <!-- Карточки навигации -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
      <!-- Категории -->
      <HenaketCard
        class="p-8 hover:shadow-lg transition-shadow cursor-pointer"
        @click="navigateToCategories"
      >
        <div class="text-center space-y-4">
          <HenaketIcon
            icon="category"
            size="48px"
            class="text-green-600 mx-auto"
          />
          <h3 class="text-xl font-semibold text-gray-800">Categories</h3>
          <p class="text-gray-600">
            Organize your expenses by creating and managing categories
          </p>
          <HenaketButton variant="outlined" class="w-full">
            <HenaketIcon icon="arrow_forward" size="20px" />
            Manage Categories
          </HenaketButton>
        </div>
      </HenaketCard>

      <!-- Транзакции -->
      <HenaketCard
        class="p-8 hover:shadow-lg transition-shadow cursor-pointer"
        @click="navigateToTransactions"
      >
        <div class="text-center space-y-4">
          <HenaketIcon
            icon="receipt_long"
            size="48px"
            class="text-blue-600 mx-auto"
          />
          <h3 class="text-xl font-semibold text-gray-800">Transactions</h3>
          <p class="text-gray-600">
            Add, edit, and track all your financial transactions
          </p>
          <HenaketButton variant="primary" class="w-full">
            <HenaketIcon icon="arrow_forward" size="20px" />
            View Transactions
          </HenaketButton>
        </div>
      </HenaketCard>
    </div>

    <!-- Дополнительная информация -->
    <HenaketInfoCard
      class="max-w-2xl"
      icon="info"
      title="Getting Started"
      content="Start by creating categories for your expenses, then add transactions to track your spending patterns."
    />
  </div>
</template>

<script lang="ts" setup>
// Навигация
const navigateToCategories = () => {
  navigateTo("/category");
};

const navigateToTransactions = () => {
  navigateTo("/transactions");
};
</script>

<style scoped>
.transition-shadow {
  transition: box-shadow 0.3s ease;
}
</style>
