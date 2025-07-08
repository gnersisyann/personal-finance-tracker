<template>
  <AppLink
    v-if="link"
    :class="buttonClassString"
    hide-open-new-tab
    :link="link"
    :tabindex="disabled ? -1 : 0"
    @click="emit('click')"
  >
    <slot />
  </AppLink>

  <button
    v-else
    ref="buttonElement"
    class="henaket-button"
    :class="buttonClasses"
    :disabled="disabled"
    @click="removeButtonFocus"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { HenaketButton } from "~/types/HenaketButtonVariants";

type Props = HenaketButton;

type Emit = {
  (e: "click"): void;
};

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "regular",
});

const emit = defineEmits<Emit>();

const buttonElement = ref<HTMLButtonElement | null>();

const buttonClasses = computed(() => [
  props.disabled ? "pointer-events-none select-none opacity-30" : "opacity-100",
  props.variant,
  props.size,
]);

const buttonClassString = computed(() => {
  return ["henaket-button", ...buttonClasses.value].join(" ");
});

function removeButtonFocus() {
  emit("click");

  if (!buttonElement.value) return;

  buttonElement.value.blur();
}
</script>

<style>
.henaket-button {
  @apply rounded border-2
    w-full md:w-auto no-underline flex items-center justify-center
    transition-[background-color,border-color,box-shadow];
}

.henaket-button > span {
  @apply no-underline focus:text-text-800;
}

.henaket-button.start {
  @apply bg-button-default text-white border-button-stroke
    hover:bg-button-hover
    active:bg-button-active;
}

.henaket-button.primary {
  @apply bg-primary text-white border-blue-600
    hover:bg-blue-900
    active:bg-blue-1000 active:border-blue-1100;
}

.henaket-button.secondary {
  @apply bg-blue-200 text-text-800 border-blue-700
    hover:bg-blue-300 hover:border-blue-900
    active:bg-blue-500 active:border-blue-1200 focus:!text-text-800;
}

.henaket-button.outlined {
  @apply bg-text-100 text-text-800 border-text-400
    hover:bg-text-200 hover:border-text-700
    active:bg-text-300 active:border-text-800 focus:!text-text-800;
}

.henaket-button.icon {
  @apply border-none bg-transparent text-text-800
    hover:bg-black/10 active:bg-black/15;
}

.henaket-button.floating {
  @apply rounded-full border-text-400 bg-text-100 text-text-800
    hover:bg-blue-300 active:bg-blue-500;
}

.henaket-button.toTop {
  @apply bg-blue-100 text-blue-1200 border-blue-1100
    hover:bg-blue-200
    active:bg-blue-300;
}

.henaket-button.yesem {
  @apply bg-yesem-primary text-white border-yesem-blue-600
    hover:bg-blue-900
    active:bg-blue-1000 active:border-blue-1100;
}

.henaket-button.regular {
  @apply text-sm px-3 md:px-4 py-2;
}

.henaket-button.regular.icon,
.henaket-button.regular.floating {
  @apply text-sm p-1 md:p-2;
}

.henaket-button.large {
  @apply text-base font-bold leading-tight px-3 md:px-4 py-3;
}

.henaket-button.large.icon,
.henaket-button.large.floating {
  @apply text-base font-bold p-4;
}
</style>
