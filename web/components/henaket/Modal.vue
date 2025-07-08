<template>
  <Transition mode="out-in" name="modal-overlay">
    <div
      v-show="status"
      aria-labelledby="modal-title"
      aria-modal="true"
      class="absolute inset-0 z-[100] w-full h-screen"
      role="dialog"
    >
      <div
        class="fixed inset-0 bg-overlay transition-opacity pointer-events-none"
      />

      <Transition mode="out-in" name="modal">
        <div
          v-show="status"
          class="fixed inset-0 z-10 w-screen overflow-y-auto"
        >
          <div class="flex min-h-full items-center justify-center">
            <div
              class="bg-white shadow-modalWindow overflow-hidden sm:max-w-[800px] m-4 md:m-8 p-6 md:p-10"
            >
              <div class="flex flex-col gap-4">
                <h3 id="modal-title">
                  <slot name="title" />
                </h3>

                <div>
                  <slot name="description" />
                </div>

                <div class="flex items-start mt-4">
                  <slot name="actions" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useAppScroll } from "~/composables/useAppScroll";

const { disableScrolling, enableScrolling } = useAppScroll();

const status = defineModel<boolean>({ default: false });

onMounted(() => {
  watch(
    status,
    () => {
      status.value ? disableScrolling() : enableScrolling();
    },
    { immediate: true }
  );
});
</script>

<style>
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  @apply transition-opacity duration-500;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  @apply opacity-0;
}

.modal-enter-active,
.modal-leave-active {
  @apply duration-300;
}

.modal-enter-from,
.modal-leave-to {
  @apply opacity-0 translate-y-0 scale-95;
}

.modal-enter-to,
.modal-leave-from {
  @apply opacity-100 translate-y-0 scale-100;
}
</style>
