<template>
  <div
    class="henaket-structured-list-cell"
    :data-hide-on-mobile="hideOnMobile"
    role="gridcell"
  >
    <div class="flex items-center gap-3 md:gap-4">
      <div
        v-if="statusIndicator"
        class="relative w-5 h-5 md:w-6 md:h-6 shrink-0 basis-auto"
      >
        <HenaketIcon
          class="absolute inset-0 transition-opacity duration-300 text-xl md:text-2xl"
          :class="status ? 'opacity-0' : 'opacity-100'"
          icon="add"
        />

        <HenaketIcon
          class="absolute inset-0 transition-opacity duration-300 text-xl md:text-2xl"
          :class="status ? 'opacity-100' : 'opacity-0'"
          icon="remove"
        />
      </div>

      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HenaketStructuredListCellProps } from "~/types/HenaketStructuredListVariants";

type Props = HenaketStructuredListCellProps;

defineProps<Props>();
</script>

<style>
.henaket-structured-list-cell {
  grid-column: span v-bind("colspan") / span v-bind("colspan");
  @apply h-full flex flex-col justify-center p-3 md:p-4 text-left;
}

.henaket-structured-list-cell[data-hide-on-mobile="true"] {
  @apply hidden;
}

@screen md {
  .henaket-structured-list-cell[data-hide-on-mobile="true"] {
    @apply flex;
  }
}
</style>
