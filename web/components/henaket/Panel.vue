<template>
  <article class="henaket-panel flex gap-4 items-start p-16" :class="[variant]">
    <div class="flex flex-col">
      <slot />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { HenaketPanelVariants } from "~/types/HenaketPanelVariants";

export type HenaketPanel = {
  icon?: string;
  content?: string;
  variant?: HenaketPanelVariants;
};

type Props = HenaketPanel;

withDefaults(defineProps<Props>(), {
  variant: "success",
});
</script>

<style>
.henaket-panel.success {
  @apply bg-systemMessage-success;
}

.henaket-panel.info {
  @apply bg-systemMessage-info;
}

.henaket-panel.warning {
  @apply bg-systemMessage-warning;
}

.henaket-panel.error {
  @apply bg-systemMessage-error;
}
</style>
