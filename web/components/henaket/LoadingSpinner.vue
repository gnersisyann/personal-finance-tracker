<template>
  <div class="henaket-loading-spinner">
    <svg
      class="w-[62px] h-[62px]"
      fill="none"
      viewBox="0 0 62 62"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <circle
          v-for="(circle, index) of circles"
          :cx="circle.cx"
          :cy="circle.cy"
          r="5"
          :style="{ 'animation-delay': `${index * 0.2}s` }"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
const circles = ref([
  { cx: 31, cy: 5 },
  { cx: 49, cy: 13 },
  { cx: 57, cy: 31 },
  { cx: 49, cy: 49 },
  { cx: 31, cy: 57 },
  { cx: 13, cy: 49 },
  { cx: 5, cy: 31 },
  { cx: 13, cy: 13 },
]);
</script>

<style>
.henaket-loading-spinner circle {
  animation: henaket-loading-spinner-pulse 1.6s linear infinite;
}

@keyframes henaket-loading-spinner-pulse {
  0%,
  20%,
  80%,
  100% {
    @apply fill-text-700;
  }
  50% {
    @apply fill-text-300;
  }
}
</style>
