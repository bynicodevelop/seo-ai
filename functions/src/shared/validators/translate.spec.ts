import {
    describe, it, expect
} from 'vitest';

import { validateTranslation } from './translate';
import type { locales } from '../types';

describe(
    'validateTranslation',
    () => {
        const locales: locales[] = ['en', 'fr'];

        it(
            'should validate a correct translation object',
            async () => {
                const translation = {
                    en: 'Translation in English',
                    fr: 'Traduction en français',
                };

                await expect(validateTranslation(
                    translation,
                    locales
                )).resolves.toBeUndefined();
            }
        );

        it(
            'should fail validation if a locale is missing',
            async () => {
                const translation = { en: 'Translation in English', };

                await expect(validateTranslation(
                    translation,
                    locales
                )).rejects.toThrow();
            }
        );

        it(
            'should fail validation if a translation is empty',
            async () => {
                const translation = {
                    en: 'Translation in English',
                    fr: '',
                };

                await expect(validateTranslation(
                    translation,
                    locales
                )).rejects.toThrow();
            }
        );

        it(
            'should fail validation if a translation is null',
            async () => {
                const translation = {
                    en: 'Translation in English',
                    fr: null,
                };

                await expect(validateTranslation(
                    translation,
                    locales
                )).rejects.toThrow();
            }
        );

        it(
            'should fail validation if a translation is undefined',
            async () => {
                const translation = {
                    en: 'Translation in English',
                    fr: undefined,
                };

                await expect(validateTranslation(
                    translation,
                    locales
                )).rejects.toThrow();
            }
        );
    }
);