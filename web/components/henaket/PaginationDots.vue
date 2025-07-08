<template>
  <nav
    :class="
      clsx(
        'flex items-center rounded-full border text-text-400 bg-background-alternative backdrop-blur',
        'p-1 md:p-2.5 gap-1.5 md:gap-2 '
      )
    "
    role="tablist"
  >
    <button
      v-for="index in total"
      :key="index"
      :aria-current="currentItemIndex === index - 1"
      :aria-label="ariaLabelDot && ariaLabelDot(index)"
      :disabled="disabled"
      class="rounded-full border border-primary transition-[background-color,width,height]"
      :class="[
        currentItemIndex === index - 1
          ? 'w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-white hover:bg-text-200 active:bg-text-300 focus:bg-text-300'
          : 'w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-blue-400 hover:bg-blue-500 active:bg-blue-600 focus:bg-blue-600',
        disabled && 'opacity-50 pointer-events-none',
      ]"
      role="tab"
      @click="currentItemIndex = index - 1"
    />
  </nav>
</template>

<script setup lang="ts">
import type { HenaketPaginationDotsProps } from "~/types/HenaketPaginationVariants";
import { clsx } from "clsx";

type Props = HenaketPaginationDotsProps;

defineProps<Props>();

const currentItemIndex = defineModel<number>({ default: 0 });
</script>
