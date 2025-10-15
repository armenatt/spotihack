// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/scss/main.scss"],
  modules: ["@pinia/nuxt", "nuxt-icons", "pinia-plugin-persistedstate/nuxt"],
  dir: {
    modules: "-",
  },
  pinia: {
    storesDirs: ["~/modules/*/adapters/store/**"],
  },
  ssr: false,
  devServer: {
    port: 3001,
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL,
      cdnURL: process.env.CDN_URL,
    },
  },
});
