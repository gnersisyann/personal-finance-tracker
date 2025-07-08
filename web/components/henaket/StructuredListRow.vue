<template>
  <component
    :is="hasContent ? 'button' : 'div'"
    :aria-expanded="status"
    class="z-10 focus:z-20"
    :class="[
      hasContent
        ? status
          ? 'bg-green-200 hover:bg-green-200'
          : 'bg-white hover:bg-text-200'
        : '',
    ]"
    role="row"
    v-bind="attrs"
    @click="toggleExpandedRow"
  >
    <slot :status="status" :toggleExpandedRow="toggleExpandedRow" />
  </component>

  <div
    ref="content"
    class="origin-top overflow-hidden duration-300 transition-[height] border-text-400"
    :class="[status ? 'border-b' : 'border-b-0']"
    style="height: 0"
  >
    <div class="bg-white p-3 sm:p-4 pl-3 sm:pl-11 md:pl-14">
      <slot name="expanded-row" />
    </div>
  </div>
</template>

<script setup lang="ts">
const slots = useSlots();
const attrs = useAttrs();

const status = ref(false);
const animationInProcess = ref(false);

const content = ref() as Ref<HTMLElement>;

const hasContent = computed(() => !!slots["expanded-row"]);

function toggleExpandedRow() {
  if (!hasContent.value) return;

  if (status.value) {
    closeExpandedRow();
    return;
  }

  openExpandedRow();
}

function openExpandedRow() {
  if (animationInProcess.value || status.value) return false;

  status.value = true;
  animationInProcess.value = true;

  content.value.style.height = "0";

  setTimeout(() => {
    content.value.style.height = `${content.value.scrollHeight}px`;
  });

  setTimeout(() => {
    content.value.style.height = "";
    animationInProcess.value = false;
  }, 300);
}

function closeExpandedRow() {
  if (animationInProcess.value || !status.value) return false;

  status.value = false;
  animationInProcess.value = true;

  content.value.style.height = `${content.value.scrollHeight}px`;

  setTimeout(() => {
    content.value.style.height = "0";
    animationInProcess.value = false;
  });
}
</script>
