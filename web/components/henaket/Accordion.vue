<template>
  <article :id="anchor" class="henaket-accordion w-full flex flex-col bg-white">
    <header
      class="w-full flex rounded-[3px] border border-text-300"
      :class="{ 'rounded-b-none': isExpanded }"
    >
      <component
        :is="hasContent ? 'button' : 'div'"
        ref="headerButtonElement"
        :class="
          clsx(
            'flex-1 flex gap-2 md:gap-4 p-3 sm:p-4 items-center text-left transition-[background-color,box-shadow] z-10',
            [
              isExpanded
                ? 'bg-green-200 hover:!bg-green-200'
                : 'hover:bg-text-200',
              { 'pointer-events-none': !hasContent },
            ]
          )
        "
        @click="toggleAccordion"
      >
        <div
          class="relative w-5 h-5 md:w-6 md:h-6 shrink-0 basis-auto"
          :class="[hasContent ? 'opacity-100' : 'opacity-0']"
        >
          <HenaketIcon
            class="absolute inset-0 transition-opacity duration-300 text-xl md:text-2xl"
            :class="isExpanded ? 'opacity-0' : 'opacity-100'"
            icon="add"
          />

          <HenaketIcon
            class="absolute inset-0 transition-opacity duration-300 text-xl md:text-2xl"
            :class="isExpanded ? 'opacity-100' : 'opacity-0'"
            icon="remove"
          />
        </div>

        <div class="flex flex-col gap-2 items-start">
          <h6 class="text-text-800 font-normal break-words">
            {{ title }}
          </h6>
        </div>
      </component>

      <HenaketButton
        v-if="actionButtonLink"
        class="henaket-accordion-button"
        :class="[isExpanded ? '!rounded-br-none' : '!rounded-br-sm']"
        :variant="actionVariant"
        @click="handleActionClick"
      >
        <div class="font-semibold text-sm md:text-base">
          {{ actionButtonLink.title }}
        </div>

        <HenaketIcon
          v-if="actionButtonIcon"
          :icon="actionButtonIcon"
          size="24px"
        />
      </HenaketButton>
    </header>

    <section
      ref="contentElement"
      class="origin-top duration-300 transition-[height,border]"
      :style="{
        height: '0px',
        visibility: 'hidden',
        overflow: 'hidden',
      }"
    >
      <div
        class="p-4 pl-4 md:pl-14 rounded-b border border-t-0 border-text-300"
      >
        <div
          v-if="content"
          class="prose prose-sm max-w-none"
          v-html="content"
        />
        <slot v-else />
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import type { HenaketAccordionProps } from "~/types/HenaketAccordionVariants";
import { useExpansion } from "~/composables/useExpansion";
import { clsx } from "clsx";

type Props = HenaketAccordionProps;

const props = withDefaults(defineProps<Props>(), {
  actionVariant: "primary",
  actionButtonIcon: "keyboard_arrow_right",
});

const slots = useSlots();

const status = defineModel<boolean>({ default: false });

const headerButtonElement = ref<HTMLElement>();
const contentElement = ref<HTMLElement>();

const { isExpanded, expand, collapse } = useExpansion(contentElement, {
  animationDurationInMs: 300,
});

const hasContent = computed(() => !!(props.content || slots.default));

function toggleAccordion() {
  if (!hasContent.value) return;
  isExpanded.value ? collapse() : expand();
}

function handleActionClick() {
  if (props.actionButtonLink) {
    if (props.actionButtonLink.target === "_blank") {
      window.open(props.actionButtonLink.href, "_blank");
    } else {
      window.location.href = props.actionButtonLink.href;
    }
  }
}

watch(status, (newStatus) => {
  if (newStatus && hasContent.value && !isExpanded.value) {
    expand();
  } else if (!newStatus && isExpanded.value) {
    collapse();
  }
});

watch(isExpanded, (newExpanded) => {
  status.value = newExpanded;
});

function focus() {
  headerButtonElement.value?.focus();
}

defineExpose({
  focus,
});
</script>

<style scoped>
.henaket-accordion :deep(.henaket-accordion-button) {
  @apply w-min md:w-auto !text-base gap-1 md:gap-2 border-none !rounded-l-none !rounded-tr-sm
    transition-[background-color,box-shadow,border-color,gap,padding]
    hover:gap-1.5 hover:!pr-2.5
    md:hover:gap-3 md:hover:!pr-3
    focus:z-10 focus:gap-1.5 focus:!pr-2.5 md:focus:gap-3 md:focus:!pr-3;
}

.break-words {
  word-break: break-word;
}
</style>
