import clsx from "clsx";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      clsx,
    },
  };
});
