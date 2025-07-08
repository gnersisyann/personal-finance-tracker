<template>
  <div
    class="henaket-overlay flex fixed z-[2000] pointer-events-none"
    :class="[location.horizontal, location.vertical]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
type Horizontal = 'left' | 'right' | 'center';
type Vertical = 'top' | 'bottom';

type Location = {
  horizontal: Horizontal;
  vertical: Vertical;
};

type Props = {
  location?: Location;
};

withDefaults(defineProps<Props>(), {
  location: () => ({ horizontal: 'center', vertical: 'bottom' }),
});
</script>

<style>
.henaket-overlay.top {
  @apply top-0 left-0 bottom-auto right-0;
}

.henaket-overlay.bottom {
  @apply top-auto left-0 bottom-0 right-0;
}

.henaket-overlay.left {
  @apply justify-start;
}

.henaket-overlay.right {
  @apply justify-end;
}

.henaket-overlay.center {
  @apply justify-center;
}
</style>
