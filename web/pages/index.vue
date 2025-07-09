<template>
  <div class="space-y-8">
    <!-- Hero секция -->
    <div class="text-center space-y-6">
      <HenaketIcon
        icon="account_balance_wallet"
        size="80px"
        class="text-blue-600 mx-auto"
      />
      <div class="space-y-4">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800">
          Personal Finance Tracker
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Take control of your financial future with our comprehensive expense
          tracking system. Monitor spending, categorize transactions, and gain
          insights into your financial habits.
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6">
        <HenaketCard class="p-4 text-center cursor-default">
          <HenaketIcon
            icon="trending_up"
            size="32px"
            class="text-green-600 mx-auto mb-2"
          />
          <div class="text-2xl font-bold text-gray-800">Smart</div>
          <div class="text-sm text-gray-600">Analytics</div>
        </HenaketCard>

        <HenaketCard class="p-4 text-center cursor-default">
          <HenaketIcon
            icon="security"
            size="32px"
            class="text-blue-600 mx-auto mb-2"
          />
          <div class="text-2xl font-bold text-gray-800">Secure</div>
          <div class="text-sm text-gray-600">Data Protection</div>
        </HenaketCard>

        <HenaketCard class="p-4 text-center cursor-default">
          <HenaketIcon
            icon="speed"
            size="32px"
            class="text-purple-600 mx-auto mb-2"
          />
          <div class="text-2xl font-bold text-gray-800">Fast</div>
          <div class="text-sm text-gray-600">Performance</div>
        </HenaketCard>
      </div>
    </div>

    <!-- Main Navigation Cards -->
    <HenaketViewport>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Categories Section -->
        <HenaketCard
          class="p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          @click="navigateToCategories"
        >
          <div class="text-center space-y-6">
            <div class="relative">
              <HenaketIcon
                icon="category"
                size="64px"
                class="text-green-600 mx-auto transition-transform group-hover:scale-110"
              />
              <HenaketBadge
                backgroundColor="#10b981"
                class="absolute -top-2 -right-2 text-white"
              >
                New
              </HenaketBadge>
            </div>

            <div class="space-y-3">
              <h3 class="text-2xl font-semibold text-gray-800">
                Category Management
              </h3>
              <p class="text-gray-600">
                Organize your financial life by creating custom categories.
                Color-code your expenses and income for better visual tracking.
              </p>
            </div>

            <div class="space-y-3">
              <div
                class="flex items-center justify-center gap-2 text-sm text-gray-500"
              >
                <HenaketIcon icon="palette" size="16px" />
                <span>Custom Colors</span>
              </div>
              <div
                class="flex items-center justify-center gap-2 text-sm text-gray-500"
              >
                <HenaketIcon icon="edit" size="16px" />
                <span>Easy Editing</span>
              </div>
            </div>

            <div class="pt-4">
              <div
                class="inline-flex items-center gap-2 px-4 py-2 border border-green-300 rounded-md text-green-700 bg-green-50 group-hover:bg-green-100 transition-colors"
              >
                <HenaketIcon icon="arrow_forward" size="20px" />
                Manage Categories
              </div>
            </div>
          </div>
        </HenaketCard>

        <!-- Transactions Section -->
        <HenaketCard
          class="p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          @click="navigateToTransactions"
        >
          <div class="text-center space-y-6">
            <HenaketIcon
              icon="receipt_long"
              size="64px"
              class="text-blue-600 mx-auto transition-transform group-hover:scale-110"
            />

            <div class="space-y-3">
              <h3 class="text-2xl font-semibold text-gray-800">
                Transaction Tracking
              </h3>
              <p class="text-gray-600">
                Record every financial transaction with detailed descriptions,
                amounts, and categories for comprehensive expense monitoring.
              </p>
            </div>

            <div class="space-y-3">
              <div
                class="flex items-center justify-center gap-2 text-sm text-gray-500"
              >
                <HenaketIcon icon="filter_list" size="16px" />
                <span>Advanced Filtering</span>
              </div>
              <div
                class="flex items-center justify-center gap-2 text-sm text-gray-500"
              >
                <HenaketIcon icon="search" size="16px" />
                <span>Quick Search</span>
              </div>
            </div>

            <div class="pt-4">
              <div
                class="inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 group-hover:bg-blue-700 transition-colors"
              >
                <HenaketIcon icon="arrow_forward" size="20px" />
                View Transactions
              </div>
            </div>
          </div>
        </HenaketCard>
      </div>
    </HenaketViewport>

    <!-- Features Section -->
    <HenaketViewport class="py-12">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-800 mb-4 mt-16">
          Why Choose Our Finance Tracker?
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Discover the features that make financial management simple and
          effective
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HenaketCard
          class="p-6 text-center hover:shadow-md transition-shadow cursor-default"
        >
          <HenaketIcon
            icon="analytics"
            size="48px"
            class="text-purple-600 mx-auto mb-4"
          />
          <h4 class="text-lg font-semibold text-gray-800 mb-2">
            Smart Analytics
          </h4>
          <p class="text-gray-600 text-sm">
            Get detailed insights into your spending patterns with visual charts
            and statistics
          </p>
        </HenaketCard>

        <HenaketCard
          class="p-6 text-center hover:shadow-md transition-shadow cursor-default"
        >
          <HenaketIcon
            icon="cloud_sync"
            size="48px"
            class="text-blue-600 mx-auto mb-4"
          />
          <h4 class="text-lg font-semibold text-gray-800 mb-2">
            Real-time Sync
          </h4>
          <p class="text-gray-600 text-sm">
            Your data is automatically synchronized and available across all
            devices
          </p>
        </HenaketCard>

        <HenaketCard
          class="p-6 text-center hover:shadow-md transition-shadow cursor-default"
        >
          <HenaketIcon
            icon="shield"
            size="48px"
            class="text-green-600 mx-auto mb-4"
          />
          <h4 class="text-lg font-semibold text-gray-800 mb-2">
            Secure Storage
          </h4>
          <p class="text-gray-600 text-sm">
            Bank-level security ensures your financial data remains private and
            protected
          </p>
        </HenaketCard>

        <HenaketCard
          class="p-6 text-center hover:shadow-md transition-shadow cursor-default"
        >
          <HenaketIcon
            icon="mobile_friendly"
            size="48px"
            class="text-orange-600 mx-auto mb-4"
          />
          <h4 class="text-lg font-semibold text-gray-800 mb-2">Mobile Ready</h4>
          <p class="text-gray-600 text-sm">
            Responsive design works perfectly on phones, tablets, and desktop
            computers
          </p>
        </HenaketCard>

        <HenaketCard
          class="p-6 text-center hover:shadow-md transition-shadow cursor-default"
        >
          <HenaketIcon
            icon="receipt"
            size="48px"
            class="text-red-600 mx-auto mb-4"
          />
          <h4 class="text-lg font-semibold text-gray-800 mb-2">
            Easy Tracking
          </h4>
          <p class="text-gray-600 text-sm">
            Simple and intuitive interface makes recording transactions quick
            and effortless
          </p>
        </HenaketCard>

        <HenaketCard
          class="p-6 text-center hover:shadow-md transition-shadow cursor-default"
        >
          <HenaketIcon
            icon="category"
            size="48px"
            class="text-indigo-600 mx-auto mb-4"
          />
          <h4 class="text-lg font-semibold text-gray-800 mb-2">
            Custom Categories
          </h4>
          <p class="text-gray-600 text-sm">
            Create personalized categories that match your unique spending
            habits
          </p>
        </HenaketCard>
      </div>
    </HenaketViewport>

    <!-- Call to Action -->
    <HenaketViewport class="py-12">
      <HenaketCard
        class="p-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 cursor-default"
      >
        <HenaketIcon
          icon="rocket_launch"
          size="64px"
          class="text-blue-600 mx-auto mb-6 mt-4"
        />
        <h3 class="text-3xl font-bold text-gray-800 mb-4">
          Ready to Take Control?
        </h3>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto mt-8">
          Start your financial journey today. Create your first category and
          begin tracking your expenses to gain valuable insights into your
          spending habits.
        </p>

        <div
          class="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
        >
          <HenaketButton
            variant="primary"
            size="large"
            @click="navigateToCategories"
            class="whitespace-normal max-w-xs"
          >
            <HenaketIcon icon="add_circle" size="20px" />
            Create Category
          </HenaketButton>

          <HenaketButton
            variant="outlined"
            size="large"
            @click="navigateToTransactions"
          >
            <HenaketIcon icon="trending_up" size="20px" />
            View Analytics
          </HenaketButton>
        </div>
      </HenaketCard>
    </HenaketViewport>

    <!-- Info Cards -->
    <HenaketViewport>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HenaketInfoCard
          icon="lightbulb"
          title="Getting Started Tips"
          content="Begin with basic categories like Food, Transportation, Entertainment, and Housing. You can always add more specific subcategories as your tracking needs evolve."
        />

        <HenaketInfoCard
          icon="trending_up"
          title="Track Your Progress"
          content="Regular transaction recording helps identify spending patterns and opportunities for savings. Aim to record transactions daily for the most accurate insights."
        />
      </div>
    </HenaketViewport>
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

// SEO
useHead({
  title: "Personal Finance Tracker - Take Control of Your Money",
  meta: [
    {
      name: "description",
      content:
        "Comprehensive personal finance tracking application. Manage categories, track transactions, and gain insights into your spending habits.",
    },
  ],
});
</script>

<style scoped>
.transition-shadow {
  transition: box-shadow 0.3s ease;
}
</style>
