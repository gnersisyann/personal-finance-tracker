<template>
  <HenaketCard
    tag="button"
    class="henaket-file-attachment-card"
    @click.stop.prevent="openFile"
  >
    <div
      class="w-full flex flex-wrap px-4 items-center"
      :class="[compact ? 'py-1.5 gap-1.5' : 'py-3 gap-2']"
    >
      <img
        v-if="!attachment.hideFileIcon && attachment.fileType && fileIcon"
        alt=""
        class="object-contain -ml-2"
        :class="[compact ? 'w-9 h-9' : 'w-12 h-12']"
        role="presentation"
        :src="fileIcon"
      />

      <HenaketIcon
        v-else-if="!attachment.hideFileIcon"
        class="text-text-600 -ml-2"
        icon="description"
        :size="compact ? '36px' : '48px'"
      />

      <div class="flex-1 flex flex-col gap-0">
        <div
          class="henaket-file-attachment-card-title text-text-800 text-left"
          :class="[compact ? 'text-sm font-medium' : 'text-base font-semibold']"
        >
          {{ attachment.title }}
        </div>

        <div
          v-if="!attachment.hideFileSize && attachment.fileSize"
          class="text-text-700 text-left"
          :class="[compact ? 'text-[13px]' : 'text-sm']"
        >
          {{ fileSizeHumanReadable }}
        </div>
      </div>

      <div class="flex">
        <HenaketIcon
          class="text-text-800"
          :icon="attachment.downloadable ? 'download' : 'open_in_new'"
          :size="compact ? '20px' : '24px'"
        />
      </div>
    </div>
  </HenaketCard>
</template>

<script setup lang="ts">
import type { HenaketFileAttachmentCardProps } from "~/types/HenaketFileAttachmentVariants";
import { useFile } from "~/composables/useFile";
import { importFolder } from "~/utils/importFolder";
import { getFileIconsByType } from "~/utils/getFileIconsByType";

type Props = HenaketFileAttachmentCardProps;

const props = defineProps<Props>();

const { humanizeFileSize } = useFile();

// Импорт иконок файлов (если есть)
const icons = computed(() => {
  try {
    return importFolder(import.meta.glob("@/assets/icons/*", { eager: true }));
  } catch {
    return {};
  }
});

const fileIcon = computed(() => {
  if (!props.attachment.fileType) return null;

  const iconName = getFileIconsByType(props.attachment.fileType);
  return icons.value[iconName] || null;
});

const fileSizeHumanReadable = computed(() =>
  props.attachment.fileSize ? humanizeFileSize(props.attachment.fileSize) : ""
);

function openFile() {
  if (props.attachment.downloadable) {
    // Для загрузки используем программный download
    const link = document.createElement("a");
    link.href = props.attachment.fileUrl;
    link.download = props.attachment.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Для просмотра открываем в новой вкладке
    window.open(props.attachment.fileUrl, "_blank");
  }
}
</script>

<style scoped>
.henaket-file-attachment-card {
  @apply transition-all duration-200 hover:shadow-md active:shadow-sm;
}

.henaket-file-attachment-card-title {
  word-break: break-word;
  line-height: 1.3;
}
</style>
