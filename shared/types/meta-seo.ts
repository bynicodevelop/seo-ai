import type { I18n } from "./i18n";

export type MetaSeo = {
    title: I18n;
    description: I18n;
    keywords?: I18n;
    image?: string;
};
