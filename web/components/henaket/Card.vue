<template>
  <component
    :is="component"
    :aria-disabled="disabled"
    :class="
      clsx(
        'app-card opacity-100 flex items-start text-left gap-4 bg-white no-underline rounded border',
        'transition-[border-color,box-shadow] focus:shadow-accessibilityOutline focus:bg-white',
        [
          {
            'opacity-40 select-nonepointer-events-none': disabled,
            'border-primary shadow-cardsHover': active,
            'border-text-300 hover:border-primary hover:shadow-cardsHover':
              !active && !staticDisplay,
          },
          ...customClass,
        ]
      )
    "
    :target="openNewTab ? '_blank' : '_self'"
    :to="link"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import clsx from "clsx";

type Props = {
  to?: string;
  openNewTab?: boolean;
  disabled?: boolean;
  tag?: string;
  active?: boolean;
  customClass?: string[];
  staticDisplay?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  customClass: () => [],
});

const component = computed(() =>
  props.disabled || props.active || props.staticDisplay
    ? "article"
    : props.tag || NuxtLink
);

const link = computed(() => {
  return props.to;
});
</script>
