<template>
  <div class="flex flex-col h-full">
    <slot name="append" />

    <div class="flex flex-col flex-1">
      <slot />
    </div>

    <slot name="prepend" />
  </div>
</template>

<script setup lang="ts">
type Props = {
  hidePhaseBanner?: boolean;
  hideFeedbackBarFloating?: boolean;
};

withDefaults(defineProps<Props>(), {
  hidePhaseBanner: false,
  hideFeedbackBarFloating: false,
});
</script>
