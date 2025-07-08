<template>
  <div class="henaket-structured-list">
    <div
      class="w-full grid grid-cols-1 text-base sm:text-sm md:text-base text-left text-text-800"
      role="grid"
    >
      <HenaketStructuredListRow v-if="!hideHeaders" class="!hidden md:!grid">
        <HenaketStructuredListCell
          v-for="(header, index) in headers"
          :key="index"
          class="font-bold"
          :colspan="header.colspan"
        >
          {{ header.title }}
        </HenaketStructuredListCell>
      </HenaketStructuredListRow>

      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HenaketStructuredListProps } from "~/types/HenaketStructuredListVariants";

type Props = HenaketStructuredListProps;

const props = defineProps<Props>();

const colspan = computed(() =>
  props.headers.reduce(
    (accumulator, currentValue) => accumulator + currentValue.colspan,
    0
  )
);
</script>

<style>
.henaket-structured-list *[role="row"] {
  @apply grid transition-[border,background-color] border-b border-text-400 text-left grid-cols-1;
  grid-template-columns: repeat(v-bind("colspan"), minmax(0, 1fr));
}

@screen sm {
  .henaket-structured-list *[role="row"] {
    grid-template-columns: repeat(v-bind("colspan"), minmax(0, 1fr));
  }
}

.henaket-structured-list *[role="row"][aria-expanded="true"] {
  @apply border-b-0;
}
</style>
