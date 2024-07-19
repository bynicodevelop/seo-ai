import * as admin from 'firebase-admin';
import type {
    DocumentData, QueryDocumentSnapshot
} from 'firebase-admin/firestore';
import { info } from 'firebase-functions/logger';
import { defineString } from 'firebase-functions/params';
import {
    onDocumentCreated, onDocumentWritten
} from 'firebase-functions/v2/firestore';
import {
    first, isEmpty
} from 'lodash';

import {
    type Category, categoryFactory, createCategories, createSite, type Draft, generateCategoriesPrompt, type I18n, initOpentAI, type locales, type Site, siteFactory, translateCategoriesPrompt, translatePrompt
} from './shared';
import { formatingSlug } from './utils';
import {
    generateArticle, generateSeo, moveDraftToArticle, selectCategoryForArticle, translate
} from './utils/draft';

admin.initializeApp();

// firebase functions:secrets:set OPENAI_API
const openAIKey = defineString('OPENAI_API');

export const onSiteBuilder = onDocumentCreated(
    'site_builder/{builderId}',
    async event => {
        info('Site builder triggered');

        const db = admin.firestore();
        const openAi = initOpentAI(openAIKey.value());

        const data = event.data as QueryDocumentSnapshot;

        const {
            domain, sitename, description, keywords, locales, categories
        } = data?.data() as DocumentData;

        const defaultTranslate: locales[] = locales.length > 0 ? locales : ['fr'];

        const defaultCategories = [];

        if (isEmpty(categories)) {
            info('No categories found, generating categories');

            const generateCategories = await generateCategoriesPrompt(
                {
                    domain,
                    sitename,
                    description,
                    keywords
                },
                openAi
            );

            const translatedCategories = await translateCategoriesPrompt(
                defaultTranslate,
                generateCategories.categories,
                openAi

            );

            defaultCategories.push(...translatedCategories.categories.map((category) => ({
                title: category.title,
                description: category.description,
                slug: formatingSlug(category.slug)
            })));
        } else {
            if (first<Category>(categories) && defaultTranslate.find((lang) => first<Category>(categories)?.title[lang])) {
                info('Categories found, translating categories');

                defaultCategories.push(...categories.map((category: Category) => ({
                    title: category.title,
                    description: category.description,
                    slug: formatingSlug(category.slug)
                })));
            } else {
                if (first<Category>(categories) && defaultTranslate.find(lang => first<Category>(categories)?.title[lang])) {
                    info('Categories found, translating categories');

                    defaultCategories.push(...categories);
                } else {
                    info('Categories found, generating categories');

                    const translatedCategories = await translateCategoriesPrompt(
                        defaultTranslate,
                        categories,
                        openAi

                    );

                    defaultCategories.push(...translatedCategories.categories.map((category) => ({
                        title: category.title,
                        description: category.description,
                        slug: formatingSlug(category.slug)
                    })));
                }
            }

            let translatedDescription: I18n;

            if (typeof description === 'string') {
                translatedDescription = await translatePrompt(
                    defaultTranslate,
                    description,
                    openAi
                );
            } else {
                translatedDescription = defaultTranslate.reduce(
                    (
                        acc: {
                            [key: string]: string;
                        }, lang: string
                    ) => {
                        acc[lang] = description[lang];
                        return acc;
                    },
                    {}
                );
            }

            info('Translating keywords');
            let translatedKeywords: I18n = {};
            let convertKeywords: I18n = {};

            if (typeof keywords === 'string') {
                translatedKeywords = await translatePrompt(
                    defaultTranslate,
                    keywords,
                    openAi
                );
            } else {
                convertKeywords = await translatePrompt(
                    defaultTranslate,
                    keywords.join(', '),
                    openAi
                );
            }

            for (const lang in convertKeywords) {
                translatedKeywords[lang] = (convertKeywords[lang] as string).split(', ').map(keyword => keyword.trim());
            }

            const dataSite: Site = siteFactory(
                domain,
                {
                    title: defaultTranslate.reduce(
                        (
                            acc: {
                                [key: string]: string;
                            }, lang: string
                        ) => {
                            acc[lang] = sitename;
                            return acc;
                        },
                        {}
                    ),
                    description: translatedDescription,
                    keywords: translatedKeywords,
                },
                defaultTranslate
            );

            info('Creating site');
            await createSite(
                dataSite,
                db
            );

            info('Creating categories');
            await createCategories(
                dataSite,
                defaultCategories.map(category => (
                    categoryFactory(
                        category.title,
                        category.description,
                        category.slug
                    ))),
                db
            );

            info('Site created');
        }
    }
);

export const onDraftCreated = onDocumentWritten(
    'sites/{siteId}/drafts/{draftId}',
    async event => {
        const db = admin.firestore();
        const openAi = initOpentAI(openAIKey.value());
        const {
            siteId, draftId
        } = event.params;

        const {
            content,
            status,
            article,
            title,
            keywords,
            description,
            summary,
            slug
        } = event.data?.after.data() as Partial<Draft>;

        if (status === 'DRAFT' && content) {
            await selectCategoryForArticle(
                content,
                draftId,
                siteId,
                openAi,
                db
            );
        }

        if (status === 'CATEGORY_SELECTED' && content) {
            await generateArticle(
                siteId,
                draftId,
                content,
                openAi,
                db
            );
        }

        if (status === 'ARTICLE_CREATED' && article) {
            await generateSeo(
                draftId,
                siteId,
                article,
                openAi,
                db
            );
        }

        if (status === 'SEO_OPTIMIZED') {
            translate(
                draftId,
                siteId,
                title!,
                article!,
                keywords!,
                description!,
                summary!,
                slug!,
                openAi,
                db
            )
        }

        if (status === 'READY_FOR_PUBLISHING') {
            await moveDraftToArticle(
                draftId,
                siteId,
                db
            )
        }

    }
);