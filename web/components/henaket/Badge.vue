<template>
  <span
    class="uppercase border font-bold break-word"
    :class="[compact ? 'px-[2px] py-0 text-[12px]' : 'px-1 py-px text-sm']"
    :style="{
      backgroundColor,
      color: textColor,
      borderColor: borderColor || backgroundColor,
    }"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
type Props = {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  compact?: boolean;
};

withDefaults(defineProps<Props>(), {
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
});
</script>
