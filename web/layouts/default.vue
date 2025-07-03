<template>
  <div class="flex flex-col min-h-screen font-sans">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script lang="ts" setup></script>
