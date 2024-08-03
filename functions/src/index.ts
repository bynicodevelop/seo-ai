import axios from 'axios';
import { load } from 'cheerio';
import * as admin from 'firebase-admin';
import type {
    DocumentData, QueryDocumentSnapshot
} from 'firebase-admin/firestore';
import {
    error, info
} from 'firebase-functions/logger';
import { defineString } from 'firebase-functions/params';
import {
    onDocumentCreated, onDocumentWritten
} from 'firebase-functions/v2/firestore';
import {
    first, isEmpty
} from 'lodash';

import type {
    ArticlePrompt, Category, Draft, I18n, locales, Site,
    SiteId
} from './shared';
import {
    articlePromptFactory, categoryFactory, createCategories, createDraft, createSite, DRAFT_STATUS, generateCategoriesPrompt, initOpentAI, siteFactory, translateCategoriesPrompt, translatePrompt
} from './shared';
import { resumeContentPrompt } from './shared/prompts/resume';
import {
    cleanContentToString, formatingSlug
} from './utils';
import {
    generateArticle, moveDraftToArticle, selectCategoryForArticle, translate
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
        }

        info('Translating site description and keywords');
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
            article: articlePrompt,
        } = event.data?.after.data() as Partial<Draft>;

        if (status === DRAFT_STATUS.DRAFTED) {
            await selectCategoryForArticle(
                content!,
                draftId,
                siteId,
                openAi,
                db
            );
        }

        if (status === DRAFT_STATUS.CATEGORY_SELECTED) {
            await generateArticle(
                draftId,
                siteId,
                content!,
                openAi,
                db
            );
        }

        if (status === DRAFT_STATUS.ARTICLE_CREATED) {
            const {
                title, keywords, description, article, summary, slug
            } = articlePrompt as unknown as ArticlePrompt;

            await translate(
                draftId,
                siteId,
                articlePromptFactory(
                    title,
                    keywords,
                    description,
                    article,
                    summary,
                    slug
                ),
                openAi,
                db
            )
        }

        if (status === DRAFT_STATUS.TRANSLATED) {
            await moveDraftToArticle(
                draftId,
                siteId,
                db
            )
        }
    }
);

export const onDataCreated = onDocumentWritten(
    'data/{dataId}',
    async (event) => {
        const openAi = initOpentAI(openAIKey.value());
        const { dataId } = event.params;
        const {
            domain,
            urls,
            command,
            resumes,
            convertToArticle
        } = event.data?.after.data() as { domain: SiteId, urls: string[], command: string, resumes?: { [key: string]: string | string[] }, convertToArticle: boolean };

        if (resumes) return;

        try {
            const texts = await Promise.all(urls!.map(async (url) => {
                const response = await axios.get(url);
                const selector = await load(response.data);

                let content = selector('body article').text();

                if (isEmpty(content)) {
                    content = selector('body main').text();
                }

                if (isEmpty(content)) {
                    content = selector('body').text()
                }

                return content;
            }));

            const contents = texts.map((text: string) => cleanContentToString(text));

            const resumes = await resumeContentPrompt(
                contents,
                openAi
            );

            resumes.resume = `${resumes.resume} ${command}`;

            await admin.firestore().collection('data').doc(dataId).set(
                {
                    contents,
                    resumes
                },
                { merge: true }
            );

            if (convertToArticle) {
                await createDraft(
                    domain,
                    resumes.resume,
                    admin.firestore()
                );
            }
        } catch (e) {
            error(e);
            return
        }

        info(
            'Data created',
            urls
        );
    }
);