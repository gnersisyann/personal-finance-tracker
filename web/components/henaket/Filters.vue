<template>
  <div class="w-full flex gap-3 flex-wrap">
    <button
      v-for="item of items"
      :key="item.value"
      class="text-text-800 px-3 py-1.5 rounded text-sm border-2 transition-[background-color,border-color,opacity]"
      :class="
        clsx(
          [
            activeItems.includes(item.value)
              ? 'bg-blue-200 border-blue-800'
              : clsx(
                  'bg-white border-text-300',
                  'hover:bg-text-200 hover:border-text-400 active:bg-text-300 focus:bg-text-200 focus:border-text-400'
                ),
          ],
          disabled
            ? 'pointer-events-none select-none opacity-60'
            : 'opacity-100'
        )
      "
      :disabled="disabled"
      @click="toggleItem(item.value)"
    >
      {{ item.text }}
    </button>
  </div>
</template>

<script setup lang="ts">
import clsx from "clsx";

type Props = {
  items: {
    text: string;
    value: string | number;
  }[];
  disabled?: boolean;
  multiple?: boolean;
};

type Emits = {
  (e: "toggle", value: string | number, added: boolean): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const activeItems = defineModel<(string | number)[]>({ default: () => [] });

function toggleItem(value: string | number) {
  const itemSelected = activeItems.value.indexOf(value);

  if (itemSelected === -1) {
    if (!props.multiple) activeItems.value.length = 0;
    activeItems.value.push(value);
  } else {
    activeItems.value.splice(itemSelected, 1);
  }

  emit("toggle", value, itemSelected === -1);
}
</script>
