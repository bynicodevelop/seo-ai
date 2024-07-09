// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-09',
  devtools: { enabled: true },

  nitro: {
    firebase: {
      gen: 2,
      nodeVersion: '20'
    }
  },

  modules: ["@nuxtjs/tailwindcss"]
})