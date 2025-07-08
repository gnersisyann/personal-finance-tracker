<template>
  <label
    class="henaket-radio flex items-start cursor-pointer"
    :class="radioClasses"
  >
    <input
      v-model="status"
      class="shrink-0"
      :name="name"
      type="radio"
      :value="value"
    >

    <div>
      <slot name="label">
        <div class="flex flex-col gap-1">
          <span class="text-base">
            {{ label }}
          </span>

          <span
            v-if="hint"
            class="text-base text-text-600"
          >
            {{ hint }}
          </span>
        </div>
      </slot>
    </div>
  </label>
</template>

<script setup lang="ts">
export type HenaketRadioSizes = 'regular' | 'large';

type Props = {
  value: any;
  name: string;
  label?: string;
  hint?: string;
  size?: HenaketRadioSizes;
};

const props = withDefaults(defineProps<Props>(), {
  size: 'regular',
});

const status = defineModel<Props['value']>({ default: '' });

const radioClasses = computed(() => [props.size]);
</script>

<style>
.henaket-radio input[type='radio'] {
  @apply grid place-content-center appearance-none bg-white m-0 border-2 border-black rounded-full;
}

.henaket-radio input[type='radio']:hover:not(:focus) {
  @apply shadow-[0_0_0_10px_#B1B4B6];
}

.henaket-radio input[type='radio']::before {
  @apply content-[''] rounded-full scale-0 transition-transform;
}

.henaket-radio input[type='radio']:checked::before {
  @apply scale-100;
}

/* Large */
.henaket-radio.large {
  @apply gap-4;
}

.henaket-radio.large input[type='radio'] {
  @apply w-10 h-10;
}

.henaket-radio.large input[type='radio']::before {
  @apply w-5 h-5 shadow-[inset_0_20px_20px_#000000];
}

/* Regular */
.henaket-radio.regular {
  @apply gap-2;
}

.henaket-radio.regular input[type='radio'] {
  @apply w-6 h-6;
}

.henaket-radio.regular input[type='radio']::before {
  @apply w-3 h-3 shadow-[inset_0_12px_12px_#000000];
}
</style>
