import { useScroll } from "@vueuse/core";
export function useAppScroll() {
  const appElement = (selector = "#app") => document.querySelector(selector);
  const scroll = useScroll(window, { behavior: "smooth" });

  const smoothScroll = () => {
    const app = appElement("html");

    if (!app) return;

    app.classList.add("app-smooth-scrolling");

    setTimeout(() => {
      app.classList.remove("app-smooth-scrolling");
    }, 100);
  };

  const enableScrolling = () => {
    const app = appElement();

    if (!app) return;

    app.classList.remove("app-disable-scrolling");
  };

  const disableScrolling = () => {
    const app = appElement();

    if (!app) return;

    app.classList.add("app-disable-scrolling");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollDepth = () => {
    return computed(() => {
      const innerHeight = window?.innerHeight ?? 0;
      const offsetHeight = document?.querySelector("#app")?.scrollHeight ?? 1;

      return Math.round(((scroll.y.value + innerHeight) / offsetHeight) * 100);
    });
  };

  return {
    smoothScroll,
    enableScrolling,
    disableScrolling,
    scrollToTop,
    scrollDepth,
  };
}
