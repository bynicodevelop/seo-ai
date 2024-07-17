// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig(
  {
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
      strategy: 'prefix',
    },

    modules: [
      '@nuxt/image',
      '@nuxt/test-utils/module',
      '@nuxtjs/i18n',
      '@nuxtjs/mdc',
      '@nuxtjs/tailwindcss',
      'nuxt-schema-org',
      '@nuxt/eslint'
    ],

    runtimeConfig: { public: { limitArticles: process.env.LIMIT_ARTICLES ?? 10 } },
  }
)