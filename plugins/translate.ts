import type { I18n, locales } from "~/shared/types/i18n";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('translate', (field: I18n, locale: locales) => typeof field === 'string' ? field : field[locale])
});
