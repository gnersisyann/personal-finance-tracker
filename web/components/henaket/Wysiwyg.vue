<template>
  <div
    ref="contentElement"
    class="wysiwyg"
    :class="[{ 'custom-color': color }]"
    @click="onClick"
    v-html="contentString"
  />
</template>

<script setup lang="ts">
import { useWysiwyg } from "~/composables/useWysiwyg";
type Props = {
  content: string;
  color?: string;
};

const props = defineProps<Props>();

const { processWysiwyg, handleWysiwygClick, processEmailAddresses } =
  useWysiwyg();

const watchForUpdates = ref(false);
const contentElement = ref<HTMLDivElement | null>(null);

const contentString = computed(() => {
  let processedContent = props.content;

  processedContent = processEmailAddresses(processedContent);

  return processedContent;
});

watch(contentElement, () => {
  if (!contentElement.value) return;
  processWysiwyg(contentElement.value);

  watchForUpdates.value = true;
});

watch(
  () => contentString,
  async () => {
    if (!watchForUpdates.value) return;

    await nextTick();

    if (!contentElement.value) return;

    processWysiwyg(contentElement.value);
  }
);

function onClick(event: MouseEvent) {
  handleWysiwygClick(event);
}
</script>

<style>
.wysiwyg {
  word-break: break-word;
  @apply text-text-700 leading-normal;
}

.wysiwyg a .open-in-new {
  @apply ml-1 select-none;
}

.wysiwyg ul {
  @apply list-disc list-outside pl-6 marker:text-xl marker:text-visualization-orange-main my-2;
}

.wysiwyg ol {
  @apply list-decimal list-outside;
}

.wysiwyg iframe,
.wysiwyg video {
  @apply aspect-video w-full h-auto;
}

.wysiwyg div {
  @apply break-words;
}

.wysiwyg p {
  word-break: break-word;
  @apply py-2;
}

.wysiwyg p:first-child {
  @apply pt-0;
}

.wysiwyg p:last-child {
  @apply pb-0;
}

.wysiwyg table {
  @apply w-full text-base text-left rtl:text-right text-text-800 border-none md:border border-text-600;
}

.wysiwyg table tr {
  @apply transition-colors border-text-400 !h-auto
    first:hidden md:first:table-row first:pointer-events-none
  even:bg-white odd:bg-white md:odd:bg-text-200
    border md:border-b mb-4 last:mb-0 table-row;
}

.wysiwyg table td {
  @apply flex flex-col p-4 !h-auto text-left border-text-400
    md:table-cell md:before:!content-['']
    last:border-none;
}

.wysiwyg table colgroup {
  @apply flex md:table-column-group;
}

.wysiwyg table td::before {
  content: attr(data-label);
  font-weight: bold;
  float: left;
}

.wysiwyg h3 {
  @apply py-4;
}

.wysiwyg h4 {
  @apply py-2;
}

.wysiwyg h3:first-child,
.wysiwyg h4:last-child {
  @apply pt-0;
}

.wysiwyg blockquote {
  @apply border-l-8 border-systemMessage-info bg-systemMessage-infoLight pl-4 pr-2 py-4 my-5;
}

.wysiwyg.custom-color,
.wysiwyg.custom-color a {
  @apply text-[v-bind(color)];
}

.wysiwyg.wysiwyg.custom-color ul {
  @apply marker:text-[v-bind(color)];
}

/* Стили для иконок */
.wysiwyg .app-icon {
  display: inline-block;
  font-family: "Material Symbols Outlined";
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
}

.wysiwyg .app-icon[data-icon-name="open_in_new"]::before {
  content: "open_in_new";
}

.wysiwyg .app-icon[data-icon-name="download"]::before {
  content: "download";
}
</style>
