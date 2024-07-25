import slugify from 'slugify';

import type { I18n } from '../shared';

export const formatingSlug = (slug: I18n): I18n => {
    return Object.keys(slug).reduce(
        (
            acc: I18n, locale: string
        ) => {
            acc[locale] = slugify(
                slug[locale] as string,
                {
                    lower: true,
                    strict: true
                }
            );
            return acc;
        },
        {} as I18n
    );
}