<template>
  <article class="p-4 flex flex-col gap-0.5 rounded border border-green-400">
    <div class="flex items-center gap-2.5">
      <HenaketIcon
        v-if="icon"
        class="text-green-900"
        :icon="icon"
        size="32px"
      />

      <div class="text-text-800 font-semibold">
        {{ title }}
      </div>
    </div>

    <div class="flex gap-2.5">
      <div class="px-4" />

      <HenaketWysiwyg class="text-text-700" :content="content" />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { HenaketInfoCardItem } from "~/types/HenaketInfoCardItem";

type Props = HenaketInfoCardItem;

defineProps<Props>();
</script>
