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

  i18n: {
    locales: [
      {
        code: 'fr',
        file: 'fr-FR.ts'
      },
      {
        code: 'en',
        file: 'en-US.ts'
      },
    ],
    lazy: true,
    langDir: 'lang',
    defaultLocale: 'en',
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@nuxtjs/mdc",
    "@nuxt/image"
  ],

  alias: {
    '~/shared': '/functions/src/shared'
  }
})