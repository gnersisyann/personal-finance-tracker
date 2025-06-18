<template>
  <div>
    <h2>Transactions</h2>
    <AppStats />
    <AppTransactionManager />
    <NuxtLink to="/" style="margin-left: 16px">
      <button>Home</button>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
const selectedCategory = ref<number | null>(null);
</script>

<style></style>
