import * as yup from 'yup';

import type { locales } from '../types';

export const validateTranslation = async (
    value: { [key: string]: string | undefined | null }, locales: locales[]
): Promise<void> => {
    const i18nSchema = yup.object().shape(locales.reduce(
        (
            acc, locale
        ) => ({
            ...acc,
            [locale]: yup.string().required(),
        }),
        {}
    ));

    await i18nSchema.validate(
        value,
        { abortEarly: false }
    );
}