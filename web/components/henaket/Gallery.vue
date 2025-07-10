<template>
  <div class="grid gap-6 md:gap-8" :class="gridClasses">
    <button
      v-for="(item, index) in items"
      :key="item.image.id"
      class="group/image-box relative flex aspect-[4/3] overflow-hidden rounded border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
      @click="openLightBox(index)"
    >
      <img
        :alt="item.alt || item.image.title || ''"
        :class="
          clsx(
            'cursor-pointer aspect-square transition ease-in-out duration-300 w-full h-full object-cover',
            'group-hover/image-box:scale-[1.1] group-focus/image-box:scale-[1.1]'
          )
        "
        :role="!item.alt && !item.image.title ? 'presentation' : undefined"
        :src="getImageSrc(item.image)"
        loading="lazy"
      />
      <div
        :class="
          clsx(
            'absolute flex items-center justify-center w-full h-full bg-black/50 opacity-0',
            'transition-opacity duration-300 group-hover/image-box:opacity-100 group-focus/image-box:opacity-100'
          )
        "
      >
        <HenaketIcon
          class="invisible text-white group-hover/image-box:visible group-focus/image-box:visible"
          icon="zoom_in"
          size="48px"
        />
      </div>
    </button>
  </div>

  <Teleport to="body">
    <HenaketLightbox
      v-model="lightboxIndex"
      v-model:visible="lightboxVisibility"
      :show-thumbnails="true"
      :slides="items"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { clsx } from "clsx";
import type { HenaketGalleryProps } from "~/types/HenaketGalleryVariants";

type Props = HenaketGalleryProps;

const props = withDefaults(defineProps<Props>(), {
  columns: () => ({
    mobile: 2,
    tablet: 3,
    desktop: 4,
  }),
});

const lightboxIndex = defineModel<number>("lightboxIndex", { default: 0 });
const lightboxVisibility = defineModel<boolean>("lightboxVisible", {
  default: false,
});

const gridClasses = computed(() => {
  const { mobile, tablet, desktop } = props.columns;

  return [
    `grid-cols-${mobile}`,
    `sm:grid-cols-${tablet}`,
    `md:grid-cols-${desktop}`,
  ];
});

function openLightBox(index: number) {
  lightboxIndex.value = index;
  lightboxVisibility.value = true;
}

function getImageSrc(image: any): string {
  if (image.url) return image.url;
  if (image.id && typeof image.id === "string") {
    return `/assets/${image.id}`;
  }
  return image.id || "";
}
</script>
