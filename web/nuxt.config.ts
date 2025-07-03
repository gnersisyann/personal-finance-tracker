// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  pages: true,
  css: ["~/assets/css/tailwind.css"],

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts"],

  googleFonts: {
    families: {
      "Noto Sans": {
        wght: "100..900",
      },
      "Noto Sans Armenian": {
        wght: "100..900",
      },
    },
  },

  imports: {
    presets: [
      {
        from: "clsx",
        imports: ["clsx"],
      },
    ],
  },
});
