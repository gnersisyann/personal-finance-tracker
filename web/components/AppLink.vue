<template>
  <NuxtLink
    ref="linkElement"
    class="group/link inline no-underline"
    :target="link.open_new_tab ? '_blank' : '_self'"
    :to="localeUri"
    @click="removeLinkFocus"
  >
    <HenaketBadge
      v-if="contentTypeBadge && contentTypeBadge.show_badge_link && showContentTypeBadge"
      :backgroundColor="contentTypeBadge.background_color"
      :borderColor="contentTypeBadge.border_color"
      class="mr-2"
      :textColor="contentTypeBadge.text_color"
    >
      {{ translateField(contentTypeBadge, 'name') }}
    </HenaketBadge>

    <slot>
      <span class="underline group-hover/link:decoration-[3px]">
        {{ text }}
      </span>
    </slot>

    <HenaketIcon
      v-if="!hideOpenNewTab && link.open_new_tab"
      class="ml-1"
      icon="open_in_new"
      size="16px"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Link } from '~/types';

type Props = {
  link: Link;
  withContent?: boolean;
  showContentTypeBadge?: boolean;
  displayText?: string;
  hideOpenNewTab?: boolean;
};

const props = defineProps<Props>();
const localeRoute = useLocaleRoute();
const { translateField } = useTranslation();
const { getLink, getLinkWithContent } = useAppLink();
const { $settings } = useNuxtApp();
const { contentTypes } = $settings;

const linkElement = ref<ComponentPublicInstance | null>();

const processedLink = computed(() => (props.withContent ? getLinkWithContent(props.link) : getLink(props.link)));

const text = computed(
  () => processedLink.value.title ?? translateField(props.link, 'display_text') ?? props.displayText,
);

const localeUri = computed(() => {
  if (processedLink.value.external) return processedLink.value.link;

  return localeRoute(processedLink.value.link);
});

const contentTypeBadge = computed(() => contentTypes.find(type => type.for_link_type === props.link.link_type));

function removeLinkFocus() {
  if (!linkElement.value) return;

  linkElement.value.$el.blur();
}
</script>
