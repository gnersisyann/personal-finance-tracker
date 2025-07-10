import { ref, watch, nextTick } from "vue";

export function useTextareaAutosize(options: {
  element: Ref<HTMLTextAreaElement | undefined>;
  styleProp: string;
}) {
  const input = ref("");

  const triggerResize = async () => {
    await nextTick();

    if (!options.element.value) return;

    const textarea = options.element.value;

    textarea.style.height = "auto";

    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  watch(input, () => {
    triggerResize();
  });

  return {
    input,
    triggerResize,
  };
}
