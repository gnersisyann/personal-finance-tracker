<template>
  <HenaketContainer>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </HenaketContainer>
</template>

<script setup>
useHead({
  title: "Personal Finance Tracker",
  meta: [
    { name: "description", content: "Track your personal finances with ease" },
  ],
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
    },
  ],
});
</script>
