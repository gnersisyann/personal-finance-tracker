<template>
  <label
    class="henaket-checkbox flex items-start cursor-pointer"
    :class="checkboxClasses"
  >
    <input
      v-model="modelValue"
      class="shrink-0"
      :falseValue="falseValue"
      :name="name"
      :trueValue="trueValue"
      type="checkbox"
      :value="value"
    >

    <div>
      <slot name="label">
        <div class="flex flex-col">
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
export type HenaketCheckboxSizes = 'regular' | 'large';

type Props = {
  name: string;
  value: string;
  modelValue?: any;
  size?: HenaketCheckboxSizes;
  label?: string;
  hint?: string;
  trueValue?: any;
  falseValue?: any;
};

type Emit = {
  (e: 'update:modelValue', value: Props['modelValue']): void;
};

const props = withDefaults(defineProps<Props>(), {
  size: 'regular',
  trueValue: true,
  falseValue: false,
});

const emit = defineEmits<Emit>();

const checkboxClasses = computed(() => [props.size]);

const modelValue = computed({
  get() {
    return props.modelValue;
  },

  set(value) {
    emit('update:modelValue', value);
  },
});
</script>

<style>
.henaket-checkbox input[type='checkbox'] {
  @apply grid place-content-center appearance-none bg-white m-0 border-2 border-black;
}

.henaket-checkbox input[type='checkbox']:hover:not(:focus) {
  @apply shadow-[0_0_0_10px_#B1B4B6];
}

.henaket-checkbox input[type='checkbox']::before {
  @apply content-[''] scale-0 transition-transform origin-center;
  clip-path: polygon(
    77.93125% 18.75%,
    39.84375% 56.25%,
    22.06875% 38.75%,
    9.375% 51.25%,
    39.84375% 81.25%,
    90.625% 31.25%,
    77.93125% 18.7%
  );
}

.henaket-checkbox input[type='checkbox']:checked::before {
  @apply scale-100;
}

/* Large */
.henaket-checkbox.large {
  @apply gap-4;
}

.henaket-checkbox.large input[type='checkbox'] {
  @apply w-10 h-10;
}

.henaket-checkbox.large input[type='checkbox']::before {
  @apply w-6 h-6 shadow-[inset_0_20px_20px_#000000];
}

/* Regular */
.henaket-checkbox.regular {
  @apply gap-2;
}

.henaket-checkbox.regular input[type='checkbox'] {
  @apply w-6 h-6;
}

.henaket-checkbox.regular input[type='checkbox']::before {
  @apply w-4 h-4 shadow-[inset_0_12px_12px_#000000];
}
</style>
