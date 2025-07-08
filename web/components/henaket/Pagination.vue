<template>
  <div v-if="pages > 1" class="flex gap-6">
    <button
      :class="
        clsx(
          'group/previous-button flex items-center text-base text-text-800 transition-[margin,gap]',
          'gap-1 hover:gap-0.5 hover:ml-0.5 focus:bg-accessibility focus:text-white',
          { 'opacity-0': disabled || active === 1 }
        )
      "
      :disabled="disabled || active === 1"
      @click="changePage(active - 1)"
    >
      <HenaketIcon
        v-if="previousButton.icon"
        :icon="previousButton.icon"
        size="24px"
      />
      <span class="underline group-hover/previous-button:decoration-[3px]">
        {{ previousButton.text }}
      </span>
    </button>

    <div class="flex gap-2.5">
      <HenaketButton
        v-if="pages > 1"
        :disabled="disabled"
        :variant="active === 1 ? 'primary' : 'secondary'"
        @click="changePage(1)"
      >
        1
      </HenaketButton>

      <span
        v-if="visiblePages.length > 0 && visiblePages.at(0)! - 1 > 2"
        class="p-2"
      >
        …
      </span>

      <HenaketButton
        v-for="page in visiblePages"
        :key="page"
        :class="{ active: active === page }"
        :disabled="disabled"
        :variant="active === page ? 'primary' : 'secondary'"
        @click="changePage(page)"
      >
        {{ page }}
      </HenaketButton>

      <span
        v-if="visiblePages.length > 0 && pages - visiblePages.at(-1)! > 2"
        class="p-2"
      >
        …
      </span>

      <HenaketButton
        v-if="pages > 1"
        :disabled="disabled"
        :variant="active === pages ? 'primary' : 'secondary'"
        @click="changePage(pages)"
      >
        {{ pages }}
      </HenaketButton>
    </div>

    <button
      :class="
        clsx(
          'group/next-button flex items-center text-base text-text-800 transition-[margin,gap]',
          'gap-1 hover:gap-0.5 hover:mr-0.5 focus:bg-accessibility focus:text-white',
          { 'opacity-0': disabled || active === pages }
        )
      "
      :disabled="disabled || active === pages"
      @click="changePage(active + 1)"
    >
      <span class="underline group-hover/next-button:decoration-[3px]">
        {{ nextButton.text }}
      </span>

      <HenaketIcon v-if="nextButton.icon" :icon="nextButton.icon" size="24px" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { HenaketPaginationProps } from "~/types/HenaketPaginationVariants";
import { clsx } from "clsx";

type Props = HenaketPaginationProps;

const props = withDefaults(defineProps<Props>(), {
  siblings: 1,
});

const { perPage, total } = toRefs(props);

const active = defineModel<number>({ default: 1 });

const pages = computed(() => Math.ceil(unref(total) / unref(perPage)));

const visiblePages = computed(() => {
  const totalPages = unref(pages);
  const current = unref(active);
  const offset = props.siblings;

  const maxPages = 2 * offset + 1;

  if (totalPages <= maxPages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1).slice(
      1,
      -1
    );
  }

  let startPage = Math.max(2, current - offset);
  let endPage = Math.min(totalPages - 1, current + offset);

  if (endPage - startPage < maxPages) {
    if (startPage === 2) {
      endPage = Math.min(totalPages - 1, startPage + maxPages);
    } else if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - maxPages);
    }
  }

  const pagesList = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  if (!pagesList.includes(2) && pagesList.includes(3)) {
    pagesList.unshift(2);
  }

  if (
    !pagesList.includes(totalPages - 1) &&
    pagesList.includes(totalPages - 2)
  ) {
    pagesList.push(totalPages - 1);
  }

  return pagesList;
});

function changePage(page: number) {
  if (page === active.value || page < 1 || page > pages.value) return;

  active.value = page;
}
</script>
