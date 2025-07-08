<template>
  <div class="henaket-textarea">
    <label class="flex flex-col gap-1">
      <div v-if="label" class="font-semibold">
        {{ label }}
      </div>

      <div class="henaket-textarea-content">
        <textarea
          ref="textareaElement"
          v-model="input"
          :autofocus="autofocus"
          class="resize-none"
          :rows="rows"
          :style="{
            maxHeight,
            minHeight,
          }"
          @input="onInput"
        />
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
import { useTextareaAutosize } from "~/composables/useTextareaAutosize";
type Props = {
  modelValue: string;
  label?: string;
  autofocus?: boolean;
  rows?: number;
  maxRows?: number;
};

type Emit = {
  (e: "update:modelValue", value: Props["modelValue"]): void;
};

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  maxRows: 5,
});

const emit = defineEmits<Emit>();

const textareaElement = ref<HTMLTextAreaElement | undefined>(undefined);

const maxHeight = ref("0px");
const minHeight = ref("0px");

const { input, triggerResize } = useTextareaAutosize({
  element: textareaElement,
  styleProp: "height",
});

function onInput() {
  if (!textareaElement.value) return;

  input.value = textareaElement.value.value;
  emit("update:modelValue", input.value);
}

function calculateInputHeight() {
  if (!textareaElement.value) return;

  const style = getComputedStyle(textareaElement.value);

  const lineHeight = Number.parseFloat(style.lineHeight);
  const paddingTop = Number.parseFloat(style.paddingTop);
  const paddingBottom = Number.parseFloat(style.paddingBottom);

  const paddingY = paddingTop + paddingBottom;

  minHeight.value = `${props.rows * lineHeight + paddingY}px`;
  maxHeight.value = `${props.maxRows * lineHeight + paddingY}px`;
}

onMounted(() => {
  calculateInputHeight();
  triggerResize();
});

watch(() => props.rows, calculateInputHeight);
watch(() => props.maxRows, calculateInputHeight);
watch(
  () => props.modelValue,
  () => (input.value = props.modelValue),
  { immediate: true }
);

function focus() {
  textareaElement.value?.focus();
}

defineExpose({
  focus,
});
</script>

<style>
.henaket-textarea-content {
  @apply flex border border-black rounded;
}

.henaket-textarea-content textarea {
  @apply text-base p-2 w-full rounded;
}
</style>
