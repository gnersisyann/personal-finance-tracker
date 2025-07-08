// Простая реализация useTextareaAutosize для HenaketTextarea
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

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Set height based on scrollHeight
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
