<template>
  <article
    class="henaket-alert flex gap-4 items-start p-4 border-l-8"
    :class="[variant]"
  >
    <div v-if="icon">
      <HenaketIcon v-if="icon" :icon="icon" size="24px" />
    </div>

    <div class="flex flex-col">
      <div class="text-base font-semibold">
        {{ title }}
      </div>

      <HenaketWysiwyg v-if="content" :content="content" />

      <slot />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { HenaketAlert } from "~/types/HenaketAlertVariants";

type Props = HenaketAlert;

withDefaults(defineProps<Props>(), {
  variant: "standard",
});
</script>

<style>
.henaket-alert.success {
  @apply bg-systemMessage-successLight border-systemMessage-success;
}

.henaket-alert.info {
  @apply bg-systemMessage-infoLight border-systemMessage-info;
}

.henaket-alert.warning {
  @apply bg-systemMessage-warningLight border-systemMessage-warning;
}

.henaket-alert.error {
  @apply bg-systemMessage-errorLight border-systemMessage-error;
}

.henaket-alert.standard {
  @apply bg-white border-primary;
}
</style>
