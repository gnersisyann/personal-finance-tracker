<template>
  <HenaketViewport variant="standard" class="min-h-screen bg-gray-50">
    <div class="py-6">
      <slot />
    </div>
  </HenaketViewport>
</template>

<script lang="ts" setup>
// Добавим базовые стили для всего приложения
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #f9fafb;
  margin: 0;
  padding: 0;
}
</style>
