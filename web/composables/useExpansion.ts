export type UseExpansionOptions = {
  animationDurationInMs: number;
};

export function useExpansion(
  contentElement: Ref<HTMLElement | undefined>,
  options: UseExpansionOptions = { animationDurationInMs: 300 }
) {
  const isExpanded = ref(false);
  const animationInProcess = ref(false);
  const { animationDurationInMs } = options;

  const expand = () => {
    if (animationInProcess.value || !contentElement.value) return false;

    isExpanded.value = true;
    animationInProcess.value = true;

    const element = contentElement.value;
    element.style.height = "0";
    element.style.visibility = "hidden";
    element.style.overflow = "hidden";

    setTimeout(() => {
      if (!element) return;
      element.style.height = `${element.scrollHeight}px`;
      element.style.visibility = "visible";
    });

    setTimeout(() => {
      if (!element) return;
      element.style.height = "";
      element.style.overflow = "visible";
      animationInProcess.value = false;
    }, animationDurationInMs);
  };

  const collapse = () => {
    if (animationInProcess.value || !contentElement.value) return false;

    isExpanded.value = false;
    animationInProcess.value = true;

    const element = contentElement.value;
    element.style.height = `${element.scrollHeight}px`;
    element.style.visibility = "visible";

    setTimeout(() => {
      if (!element) return;
      element.style.height = "0";
      element.style.overflow = "hidden";
    });

    setTimeout(() => {
      if (!element) return;
      element.style.visibility = "hidden";
      animationInProcess.value = false;
    }, animationDurationInMs);
  };

  return {
    isExpanded,
    expand,
    collapse,
  };
}
