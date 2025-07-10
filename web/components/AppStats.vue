<script setup lang="ts">
const { transactions, loadTransactions } = useTransactions();
const { categories, loadCategories } = useCategories();

onMounted(async () => {
  await Promise.all([loadTransactions(), loadCategories()]);
});

const totalAmount = computed(() => {
  if (!transactions.value || transactions.value.length === 0) return 0;
  return transactions.value.reduce((sum, t) => sum + Number(t.amount), 0);
});

const amountByCategory = computed(() => {
  if (!categories.value || !transactions.value) return [];
  return categories.value.map((cat) => ({
    name: cat.name,
    color: cat.color || "#3b82f6",
    amount: transactions.value
      .filter((t) => t.categoryId === cat.id)
      .reduce((sum, t) => sum + Number(t.amount), 0),
  }));
});

const transactionCount = computed(() => {
  return transactions.value ? transactions.value.length : 0;
});

const countByCategory = computed(() => {
  if (!categories.value || !transactions.value) return [];
  return categories.value.map((cat) => ({
    name: cat.name,
    color: cat.color || "#3b82f6",
    count: transactions.value.filter((t) => t.categoryId === cat.id).length,
  }));
});

const averageTransaction = computed(() => {
  if (transactionCount.value === 0) return "0";
  return (totalAmount.value / transactionCount.value).toFixed(2);
});

const topCategory = computed(() => {
  if (!amountByCategory.value || amountByCategory.value.length === 0)
    return null;
  const sorted = amountByCategory.value.sort((a, b) => b.amount - a.amount);
  return sorted.length > 0 && sorted[0].amount > 0 ? sorted[0] : null;
});
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div
        class="p-4 text-center bg-white rounded-lg border border-gray-200 shadow"
      >
        <div class="space-y-2">
          <HenaketIcon
            icon="receipt_long"
            size="32px"
            class="text-blue-600 mx-auto"
          />
          <div class="text-2xl font-bold text-gray-800">
            {{ transactionCount }}
          </div>
          <div class="text-sm text-gray-600">Total Transactions</div>
        </div>
      </div>

      <div
        class="p-4 text-center bg-white rounded-lg border border-gray-200 shadow"
      >
        <div class="space-y-2">
          <HenaketIcon
            icon="payments"
            size="32px"
            class="text-green-600 mx-auto"
          />
          <div class="text-2xl font-bold text-gray-800">
            ${{ totalAmount.toFixed(2) }}
          </div>
          <div class="text-sm text-gray-600">Total Amount</div>
        </div>
      </div>

      <div
        class="p-4 text-center bg-white rounded-lg border border-gray-200 shadow"
      >
        <div class="space-y-2">
          <HenaketIcon
            icon="calculate"
            size="32px"
            class="text-purple-600 mx-auto"
          />
          <div class="text-2xl font-bold text-gray-800">
            ${{ averageTransaction }}
          </div>
          <div class="text-sm text-gray-600">Average Transaction</div>
        </div>
      </div>

      <div
        class="p-4 text-center bg-white rounded-lg border border-gray-200 shadow"
      >
        <div class="space-y-2">
          <HenaketIcon
            icon="trending_up"
            size="32px"
            class="text-orange-600 mx-auto"
          />
          <div class="text-lg font-bold text-gray-800">
            {{ topCategory?.name || "N/A" }}
          </div>
          <div class="text-sm text-gray-600">Top Category</div>
          <div v-if="topCategory" class="text-xs text-gray-500">
            ${{ topCategory.amount.toFixed(2) }}
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="p-6 bg-white rounded-lg border border-gray-200 shadow">
        <div class="flex items-center gap-3 mb-4">
          <HenaketIcon icon="category" size="24px" class="text-blue-600" />
          <h4 class="text-lg font-semibold text-gray-800">
            Transactions by Category
          </h4>
        </div>

        <div v-if="countByCategory.length" class="space-y-3">
          <div
            v-for="cat in countByCategory"
            :key="cat.name"
            class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: cat.color }"
              ></div>
              <span class="font-medium text-gray-700">{{ cat.name }}</span>
            </div>
            <span
              :class="[
                'px-2 py-1 rounded text-xs font-medium',
                cat.count > 0
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600',
              ]"
            >
              {{ cat.count }}
            </span>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          No categories available
        </div>
      </div>

      <div class="p-6 bg-white rounded-lg border border-gray-200 shadow">
        <div class="flex items-center gap-3 mb-4">
          <HenaketIcon
            icon="account_balance"
            size="24px"
            class="text-green-600"
          />
          <h4 class="text-lg font-semibold text-gray-800">
            Amount by Category
          </h4>
        </div>

        <div v-if="amountByCategory.length" class="space-y-3">
          <div
            v-for="cat in amountByCategory"
            :key="cat.name"
            class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: cat.color }"
              ></div>
              <span class="font-medium text-gray-700">{{ cat.name }}</span>
            </div>
            <div class="text-right">
              <div class="font-semibold text-gray-800">
                ${{ cat.amount.toFixed(2) }}
              </div>
              <div class="text-xs text-gray-500">
                {{
                  totalAmount > 0
                    ? ((cat.amount / totalAmount) * 100).toFixed(1)
                    : 0
                }}%
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          No transactions available
        </div>
      </div>
    </div>

    <div
      v-if="transactionCount === 0"
      class="p-4 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <div class="flex items-start gap-3">
        <HenaketIcon icon="info" size="20px" class="text-blue-600 mt-0.5" />
        <div>
          <h4 class="font-medium text-blue-800">Getting Started</h4>
          <p class="text-blue-700 text-sm mt-1">
            Add your first transaction to see detailed statistics and spending
            patterns.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
