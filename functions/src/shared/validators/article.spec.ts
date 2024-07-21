// validation.test.ts
import { Timestamp } from 'firebase-admin/firestore';
import {
    describe, it, expect
} from 'vitest';

import {
 createArticleServiceValidator, articleValidator 
} from './article';
import type {
    Article, locales
} from '../types';

describe(
'article',
() => {
    describe(
        'articleValidator',
        () => {
            const locales: locales[] = ['en', 'fr'];

            it(
                'should validate a correct article object',
                async () => {
                    const article: Article = {
                        title: {
                            en: 'Title in English',
                            fr: 'Titre en français'
                        },
                        keywords: {
                            en: 'keyword1',
                            fr: 'mot-clé1'
                        },
                        description: {
                            en: 'Description in English',
                            fr: 'Description en français'
                        },
                        article: {
                            en: 'Article content in English',
                            fr: 'Contenu de l\'article en français'
                        },
                        summary: {
                            en: 'Summary in English',
                            fr: 'Résumé en français'
                        },
                        slug: {
                            en: 'title-in-english',
                            fr: 'titre-en-français'
                        },
                        createdAt: Timestamp.now(),
                        updatedAt: Timestamp.now(),
                    };

                    await expect(articleValidator(
                        article,
                        locales
                    )).resolves.toBeUndefined();
                }
            );

            it(
                'should fail validation for an incorrect article object',
                async () => {
                    const invalidArticle = {
                        title: { en: 'Title in English' },
                        keywords: { en: 'keyword1' },
                        description: { en: 'Description in English' },
                        article: { en: 'Article content in English' },
                        summary: { en: 'Summary in English' },
                        slug: { en: 'title-in-english' },
                    };

                    await expect(articleValidator(
                        invalidArticle as Article,
                        locales
                    )).rejects.toThrow();
                }
            );

            it(
                'should fail validation if required fields are missing',
                async () => {
                    const missingFieldsArticle = {
                        title: {
                            en: 'Title in English',
                            fr: 'Titre en français'
                        },
                        keywords: {
                            en: 'keyword1',
                            fr: 'mot-clé1'
                        },
                        description: { en: 'Description in English', },
                        article: {
                            en: 'Article content in English',
                            fr: 'Contenu de l\'article en français'
                        },
                        summary: { fr: 'Résumé en français' },
                        slug: {
                            en: 'title-in-english',
                            fr: 'titre-en-français'
                        },
                    };

                    await expect(articleValidator(
                        missingFieldsArticle,
                        locales
                    )).rejects.toThrow();
                }
            );
        }
    );

    describe(
'createArticleService',
() => {
        it(
            'should validate a correct data object',
            async () => {
                const data = {
                    domain: 'example.com',
                    result: 'success',
                };

                await expect(createArticleServiceValidator(data)).resolves.toBeUndefined();
            }
        );

        it(
            'should fail validation for an incorrect data object',
            async () => {
                const invalidData = { domain: 'example.com', };

                await expect(createArticleServiceValidator(invalidData)).rejects.toThrow();
            }
        );

        it(
            'should fail validation if required fields are missing',
            async () => {
                const missingFieldsData = { result: 'success', };

                await expect(createArticleServiceValidator(missingFieldsData)).rejects.toThrow();
            }
        );
    }
);
}
);