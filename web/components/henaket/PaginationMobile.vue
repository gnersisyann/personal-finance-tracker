<template>
  <div class="flex gap-2">
    <div class="flex">
      <HenaketButton
        :disabled="disabled || active === 1"
        variant="icon"
        @click="active = 1"
      >
        <HenaketIcon
          v-if="firstPageButton.icon"
          :icon="firstPageButton.icon"
          size="24px"
        />
      </HenaketButton>

      <HenaketButton
        :disabled="disabled || active === 1"
        variant="icon"
        @click="active = active - 1"
      >
        <HenaketIcon
          v-if="previousButton.icon"
          :icon="previousButton.icon"
          size="24px"
        />
      </HenaketButton>
    </div>

    <div class="flex items-center">
      {{ pagesText }}
    </div>

    <div class="flex">
      <HenaketButton
        :disabled="disabled || active === pages"
        variant="icon"
        @click="active = active + 1"
      >
        <HenaketIcon
          v-if="nextButton.icon"
          :icon="nextButton.icon"
          size="24px"
        />
      </HenaketButton>

      <HenaketButton
        :disabled="disabled || active === pages"
        variant="icon"
        @click="active = pages"
      >
        <HenaketIcon
          v-if="lastPageButton.icon"
          :icon="lastPageButton.icon"
          size="24px"
        />
      </HenaketButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HenaketPaginationMobileProps } from "~/types/HenaketPaginationVariants";
import { templateInterpolation } from "~/utils/interpolation";

type Props = HenaketPaginationMobileProps;

const props = defineProps<Props>();

const { perPage, total } = toRefs(props);

const active = defineModel<number>({ default: 1 });

const pages = computed(() => Math.ceil(unref(total) / unref(perPage)));

const pagesText = computed(() => {
  return templateInterpolation(props.text, {
    current: active.value,
    total: pages.value,
  });
});
</script>
