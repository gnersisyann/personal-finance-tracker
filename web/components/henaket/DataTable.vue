<template>
  <table
    class="henaket-data-table w-full text-left ring-text-600 ring-1 border-collapse text-base md:text-sm lg:text-base"
    :class="[disabled ? 'opacity-30 pointer-events-none' : 'opacity-100']"
  >
    <thead
      class="bg-text-200 shadow-[inset_0_-1px] shadow-text-400"
      :class="[stickyHeader ? 'sticky top-0' : '']"
    >
      <tr
        class="hidden md:table-row"
        scope="row"
      >
        <th
          v-for="(header, index) in headers"
          scope="col"
        >
          <component
            :is="header.sortable ? 'button' : 'div'"
            class="group/header flex items-center gap-1.5 text-start w-full h-full p-4"
            @click="enableSorting(index)"
          >
            <div class="flex items-center">
              <span class="w-auto lg:w-max word-break">{{ header.title }}</span>

              <HenaketIcon
                v-if="header.sortable"
                class="transition-[opacity,transform]"
                :class="[
                  sortHeaderIndex === index
                    ? `opacity-100 ${sortOrder ? 'rotate-0' : 'rotate-180'}`
                    : 'opacity-30 group-hover/header:opacity-50',
                ]"
                icon="arrow_drop_up"
                size="24px"
              />
            </div>
          </component>
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="item in items"
        class="border-text-400 border-b last:border-none"
        scope="row"
      >
        <td
          v-for="header in headers"
          class="flex flex-col md:table-cell p-4 word-break"
          :data-label="header.title"
        >
          {{ getItemValue(header.valueTemplate, item) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
type HenaketDataTableHeader = {
  title: string;
  valueTemplate: string;
  sortable?: boolean;
};

type Props = {
  headers: HenaketDataTableHeader[];
  items: any[];
  disabled?: boolean;
  stickyHeader?: boolean;
};

const props = defineProps<Props>();

const sortHeaderIndex = ref(-1);
const sortOrder = ref(true);

const sort = defineModel<string[]>('sort', { default: () => [] });

watch([sortHeaderIndex, sortOrder], () => {
  const header = props.headers[sortHeaderIndex.value];

  if (!header) {
    sort.value = [];
    return;
  }

  const fields = extractTemplatePlaceholders(header.valueTemplate);

  sort.value = fields.map(field => `${sortOrder.value ? '' : '-'}${field}`);
});

function getItemValue(valueTemplate: string, item: any) {
  return templateInterpolation(valueTemplate, item);
}

function enableSorting(index: number) {
  const header = props.headers[index];

  if (!header || !header.sortable) return;

  if (sortHeaderIndex.value === index) {
    if (sortOrder.value) {
      sortOrder.value = false;
      return;
    }

    if (!sortOrder.value) {
      sortHeaderIndex.value = -1;
      sortOrder.value = true;
      return;
    }
  }

  sortHeaderIndex.value = index;
  sortOrder.value = true;
}
</script>

<style>
.henaket-data-table td::before {
  @apply font-bold float-left content-[attr(data-label)] md:content-[''];
}
</style>
