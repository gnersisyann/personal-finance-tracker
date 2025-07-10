<template>
  <NuxtLink
    :to="localizedLink"
    :target="target"
    :class="linkClass"
    v-bind="$attrs"
  >
    <slot />
    <HenaketIcon
      v-if="!hideOpenNewTab && isExternal"
      icon="open_in_new"
      size="16px"
      class="ml-1"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
type Props = {
  link: any;
  hideOpenNewTab?: boolean;
  class?: string;
};

const props = defineProps<Props>();

const localeRoute = (link: string) => link;

const isExternal = computed(() => {
  if (typeof props.link === "string") {
    return props.link.startsWith("http") || props.link.startsWith("mailto:");
  }
  return props.link?.external || false;
});

const target = computed(() => (isExternal.value ? "_blank" : "_self"));

const localizedLink = computed(() => {
  if (typeof props.link === "string") {
    return isExternal.value ? props.link : localeRoute(props.link);
  }
  return props.link?.url || "/";
});

const linkClass = computed(() => props.class || "");
</script>
