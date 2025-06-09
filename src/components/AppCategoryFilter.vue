<script setup lang="ts">
import { ref, watch } from "vue";
import { categories } from "../composables/useCategories";

const selectedCategory = ref<number | null>(null);

const emit = defineEmits<{
  (e: "chooseCategory", category: number | null): void;
}>();

watch(selectedCategory, (val) => {
  if (val == null) emit("chooseCategory", null);
  else emit("chooseCategory", Number(val));
});
</script>

<template>
  <select v-model="selectedCategory">
    <option :value="null">All categories</option>
    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
      {{ cat.name }}
    </option>
  </select>
</template>
