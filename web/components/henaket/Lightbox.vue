<template>
  <Transition name="lightbox-overlay">
    <div
      v-if="visible"
      class="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      @click.self="closeLightbox"
      @keydown.esc="closeLightbox"
      tabindex="-1"
    >
      <!-- Кнопка закрытия -->
      <button
        class="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
        @click="closeLightbox"
      >
        <HenaketIcon icon="close" size="32px" />
      </button>

      <!-- Счетчик изображений -->
      <div
        v-if="showCounter && slides.length > 1"
        class="absolute top-4 left-4 z-10 text-white text-sm bg-black/50 px-3 py-1 rounded"
      >
        {{ currentIndex + 1 }} / {{ slides.length }}
      </div>

      <!-- Навигационные кнопки -->
      <button
        v-if="slides.length > 1"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentIndex === 0"
        @click="previousSlide"
      >
        <HenaketIcon icon="chevron_left" size="48px" />
      </button>

      <button
        v-if="slides.length > 1"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentIndex === slides.length - 1"
        @click="nextSlide"
      >
        <HenaketIcon icon="chevron_right" size="48px" />
      </button>

      <!-- Основное изображение -->
      <div class="max-w-[90vw] max-h-[80vh] flex items-center justify-center">
        <Transition name="lightbox-slide" mode="out-in">
          <div
            :key="currentIndex"
            class="relative flex items-center justify-center"
          >
            <!-- Спиннер загрузки -->
            <div
              v-if="imageLoading"
              class="absolute inset-0 flex items-center justify-center"
            >
              <HenaketLoadingSpinner />
            </div>

            <img
              :src="getImageSrc(currentSlide.image)"
              :alt="currentSlide.alt || currentSlide.image.title || ''"
              class="max-w-full max-h-full object-contain transition-opacity duration-300"
              :class="{ 'opacity-0': imageLoading }"
              @load="imageLoading = false"
              @error="imageLoading = false"
            />
          </div>
        </Transition>
      </div>

      <!-- Миниатюры -->
      <div
        v-if="showThumbnails && slides.length > 1"
        class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded max-w-[90vw] overflow-x-auto"
      >
        <button
          v-for="(slide, index) in slides"
          :key="slide.image.id"
          class="relative w-16 h-16 flex-shrink-0 border-2 rounded overflow-hidden transition-all"
          :class="[
            index === currentIndex
              ? 'border-white'
              : 'border-gray-500 hover:border-gray-300',
          ]"
          @click="goToSlide(index)"
        >
          <img
            :src="getImageSrc(slide.image)"
            :alt="slide.alt || slide.image.title || ''"
            class="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { HenaketLightboxProps } from "~/types/HenaketGalleryVariants";
import { useAppScroll } from "~/composables/useAppScroll";

type Props = HenaketLightboxProps;

const props = withDefaults(defineProps<Props>(), {
  showThumbnails: true,
  showCounter: true,
  autoPlay: false,
  autoPlayInterval: 3000,
});

const { disableScrolling, enableScrolling } = useAppScroll();

const currentIndex = defineModel<number>({ default: 0 });
const visible = defineModel<boolean>("visible", { default: false });

const imageLoading = ref(false);
const autoPlayTimer = ref<NodeJS.Timeout | null>(null);

const currentSlide = computed(() => props.slides[currentIndex.value]);

watch(visible, (newVisible) => {
  if (newVisible) {
    disableScrolling();
    if (props.autoPlay) {
      startAutoPlay();
    }
  } else {
    enableScrolling();
    stopAutoPlay();
  }
});

watch(currentIndex, () => {
  imageLoading.value = true;
  if (props.autoPlay && visible.value) {
    restartAutoPlay();
  }
});

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  stopAutoPlay();
});

function handleKeydown(event: KeyboardEvent) {
  if (!visible.value) return;

  switch (event.key) {
    case "Escape":
      closeLightbox();
      break;
    case "ArrowLeft":
      previousSlide();
      break;
    case "ArrowRight":
      nextSlide();
      break;
  }
}

function closeLightbox() {
  visible.value = false;
}

function previousSlide() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function nextSlide() {
  if (currentIndex.value < props.slides.length - 1) {
    currentIndex.value++;
  } else if (props.autoPlay) {
    currentIndex.value = 0;
  }
}

function goToSlide(index: number) {
  currentIndex.value = index;
}

function getImageSrc(image: any): string {
  if (image.url) return image.url;
  if (image.id && typeof image.id === "string") {
    return `/assets/${image.id}`;
  }
  return image.id || "";
}

function startAutoPlay() {
  if (!props.autoPlay) return;

  autoPlayTimer.value = setInterval(() => {
    nextSlide();
  }, props.autoPlayInterval);
}

function stopAutoPlay() {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value);
    autoPlayTimer.value = null;
  }
}

function restartAutoPlay() {
  stopAutoPlay();
  startAutoPlay();
}
</script>

<style>
.lightbox-overlay-enter-active,
.lightbox-overlay-leave-active {
  @apply transition-opacity duration-300;
}

.lightbox-overlay-enter-from,
.lightbox-overlay-leave-to {
  @apply opacity-0;
}

.lightbox-slide-enter-active,
.lightbox-slide-leave-active {
  @apply transition-all duration-200;
}

.lightbox-slide-enter-from {
  @apply opacity-0 translate-x-4;
}

.lightbox-slide-leave-to {
  @apply opacity-0 -translate-x-4;
}
</style>
