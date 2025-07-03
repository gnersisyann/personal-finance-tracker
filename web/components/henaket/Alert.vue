<template>
  <article
    class="app-alert flex gap-4 items-start p-4 border-l-8"
    :class="[variant]"
  >
    <div v-if="icon">
      <HenaketIcon
        v-if="icon"
        :icon="icon"
        size="24px"
      />
    </div>

    <div class="flex flex-col">
      <div class="text-base font-semibold">
        {{ title }}
      </div>

      <HenaketWysiwyg
        v-if="content"
        :content="content"
      />

      <slot />
    </div>
  </article>
</template>

<script setup lang="ts">
export type HenaketAlertVariants = 'success' | 'info' | 'warning' | 'error' | 'standard';

export type HenaketAlert = {
  icon?: string;
  title: string;
  content?: string;
  variant?: HenaketAlertVariants;
};

type Props = HenaketAlert;

withDefaults(defineProps<Props>(), {
  variant: 'standard',
});
</script>

<style>
.app-alert.success {
  @apply bg-systemMessage-successLight border-systemMessage-success;
}

.app-alert.info {
  @apply bg-systemMessage-infoLight border-systemMessage-info;
}

.app-alert.warning {
  @apply bg-systemMessage-warningLight border-systemMessage-warning;
}

.app-alert.error {
  @apply bg-systemMessage-errorLight border-systemMessage-error;
}

.app-alert.yesem {
  @apply bg-white border-yesem-primary;
}

.app-alert.standard {
  @apply bg-white border-primary;
}
</style>
