<template>
  <div class="henaket-notification w-full flex" :class="[variant]">
    <div
      v-if="icon"
      class="henaket-notification-icon-wrap flex items-center p-2 md:p-4"
    >
      <HenaketIcon
        class="henaket-notification-icon text-2xl md:text-[32px]"
        :icon="icon"
      />
    </div>

    <div class="flex-1 flex flex-col justify-center p-2 md:p-4">
      <h6>{{ title }}</h6>

      <HenaketWysiwyg
        v-if="description"
        class="text-sm md:text-base"
        :content="description"
      />
    </div>

    <div v-if="!hideCloseButton" class="flex items-center p-2 md:p-4">
      <button
        @click="emit('close')"
        class="text-text-700 hover:text-text-900 transition-colors"
      >
        <HenaketIcon icon="close" size="24px" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HenaketNotification } from "~/types/HenaketNotificationVariants";

type Props = HenaketNotification;

type Emits = {
  (e: "close"): void;
};

withDefaults(defineProps<Props>(), {
  variant: "standard",
  hideCloseButton: false,
});

const emit = defineEmits<Emits>();
</script>

<style scoped>
.henaket-notification .henaket-notification-icon {
  @apply text-white;
}

.henaket-notification.success {
  @apply bg-systemMessage-successLight;
}

.henaket-notification.success .henaket-notification-icon-wrap {
  @apply bg-systemMessage-success;
}

.henaket-notification.info {
  @apply bg-systemMessage-infoLight;
}

.henaket-notification.info .henaket-notification-icon-wrap {
  @apply bg-systemMessage-info;
}

.henaket-notification.warning {
  @apply bg-systemMessage-warningLight;
}

.henaket-notification.warning .henaket-notification-icon-wrap {
  @apply bg-systemMessage-warning;
}

.henaket-notification.warning .henaket-notification-icon {
  @apply text-black;
}

.henaket-notification.error {
  @apply bg-systemMessage-errorLight;
}

.henaket-notification.error .henaket-notification-icon-wrap {
  @apply bg-systemMessage-error;
}

.henaket-notification.standard {
  @apply bg-white;
}

.henaket-notification.standard .henaket-notification-icon-wrap {
  @apply bg-primary;
}
</style>
