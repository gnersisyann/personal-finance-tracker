<template>
  <div class="henaket-input-field flex">
    <div
      class="shrink-0 bg-systemMessage-error transition-[width,margin] duration-300"
      :class="errorMessage ? 'w-1 mr-4' : 'w-0 mr-0'"
    />

    <label class="w-full flex flex-col gap-1">
      <div v-if="label" class="font-semibold">
        {{ label }}
      </div>

      <div v-if="errorMessage" class="font-semibold text-systemMessage-error">
        {{ errorMessage }}
      </div>

      <div
        class="henaket-input-field-content"
        :class="[errorMessage ? 'border-systemMessage-error' : 'border-black']"
      >
        <div
          v-if="prefix || slots.prefix"
          class="px-3 py-2 shrink-0 border-r bg-text-200 rounded-s-[3px]"
          :class="[
            errorMessage ? 'border-systemMessage-error' : 'border-black',
          ]"
        >
          <slot name="prefix">
            <div>{{ prefix }}</div>
          </slot>
        </div>

        <input
          ref="inputFieldElement"
          v-model="input"
          :type="type"
          @blur="onBlur"
          @input="onInput"
        />

        <div
          v-if="suffix || slots.suffix"
          class="px-3 py-2 shrink-0 border-l bg-text-200 rounded-e-[3px]"
          :class="[
            errorMessage ? 'border-systemMessage-error' : 'border-black',
          ]"
        >
          <slot name="suffix">
            <div>{{ suffix }}</div>
          </slot>
        </div>
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
import type { ValidationRule } from "~/composables/useValidation";
import { useValidation } from "~/composables/useValidation";

type Props = {
  modelValue: string;
  rules?: ValidationRule[];
  type?: string;
  label?: string;
  prefix?: string;
  suffix?: string;
};

type Emit = {
  (e: "update:modelValue", value: Props["modelValue"]): void;
};

const props = withDefaults(defineProps<Props>(), {
  type: "text",
});

const emit = defineEmits<Emit>();

const slots = useSlots();

const inputFieldElement = ref<HTMLInputElement | null>(null);
const input = ref("");

const errorMessage = ref<string | boolean>("");
const { validate } = useValidation(input, props.rules || [], errorMessage);

watch(
  () => props.modelValue,
  () => (input.value = props.modelValue),
  { immediate: true, flush: "sync" }
);

function onInput() {
  if (!inputFieldElement.value) return;

  input.value = inputFieldElement.value.value;
  emit("update:modelValue", input.value);
}

async function onBlur() {
  await validate();
}

function focus() {
  inputFieldElement.value?.focus();
}

defineExpose({
  focus,
  validate,
});
</script>

<style>
.henaket-input-field-content {
  @apply flex border rounded;
}

.henaket-input-field-content input {
  @apply p-2 w-full rounded focus:z-10;
}

/* Chrome, Safari, Edge, Opera */
.henaket-input-field-content input::-webkit-outer-spin-button,
.henaket-input-field-content input::-webkit-inner-spin-button {
  @apply m-0 appearance-none;
}

/* Firefox */
.henaket-input-field-content input[type="number"] {
  appearance: textfield;
}
</style>
