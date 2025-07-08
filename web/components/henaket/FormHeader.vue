<template>
  <div class="border-b border-text-600">
    <HenaketViewport class="py-6" :innerClass="['justify-between']">
      <slot>
        <h4>
          {{ title }}
        </h4>
      </slot>
      <slot name="append" />
    </HenaketViewport>
  </div>
</template>

<script setup lang="ts">
type Props = {
  title?: string;
};

defineProps<Props>();
</script>
