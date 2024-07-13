import * as admin from "firebase-admin";
import { defineString } from "firebase-functions/params";
import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import { first, isEmpty } from "lodash";
import { Category, categoryFactory, createCategories, createSite, Draft, generateCategoriesPrompt, I18n, initOpentAI, Site, siteFactory, translateCategoriesPrompt, translatePrompt } from './shared';
import { generateArticle, generateSeo, selectCategoryForArticle, translate } from "./utils/draft";

admin.initializeApp();

// firebase functions:secrets:set OPENAI_API
const openAIKey = defineString('OPENAI_API');

export const onSiteBuilder = onDocumentCreated('site_builder/{builderId}', async (event) => {
    const db = admin.firestore();
    const openAi = initOpentAI(openAIKey.value());

    const data = event.data as any;

    const { domain, sitename, description, keywords, translate, categories } = data?.data() as any;

    const defaultTranslate: any[] = translate.length > 0 ? translate : ['fr'];

    const defaultCategories = [];

    if (isEmpty(categories)) {
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
            slug: category.slug,
        })));
    } else {
        if (first<Category>(categories) && defaultTranslate.find((lang) => first<Category>(categories)?.title[lang])) {
            defaultCategories.push(...categories);
        } else {
            const translatedCategories = await translateCategoriesPrompt(
                defaultTranslate,
                categories,
                openAi

            );

            defaultCategories.push(...translatedCategories.categories);
        }
    }

    let translatedDescription: I18n;

    if (typeof description === 'string') {
        translatedDescription = await translatePrompt(defaultTranslate, description, openAi);
    } else {
        translatedDescription = defaultTranslate.reduce((acc: any, lang: string) => {
            acc[lang] = description[lang];
            return acc;
        }, {});
    }

    const dataSite: Site = siteFactory(
        domain,
        {
            title: defaultTranslate.reduce((acc: any, lang: string) => {
                acc[lang] = sitename;
                return acc;
            }, {}),
            description: translatedDescription,
            keywords: defaultTranslate.reduce((acc: any, lang: string) => {
                acc[lang] = keywords;
                return acc;
            }, {}),
        },
    );

    await createSite(dataSite, db);

    await createCategories(
        dataSite,
        defaultCategories.map((category) => (
            categoryFactory(
                undefined,
                category.title,
                category.description,
                category.slug
            ))),
        db
    );
});

export const onDraftCreated = onDocumentWritten('sites/{siteId}/drafts/{draftId}', async (event) => {
    const db = admin.firestore();
    const openAi = initOpentAI(openAIKey.value());
    const { siteId, draftId } = event.params;

    const {
        content,
        status,
        article,
        title,
        keywords,
        description,
        summary
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
            openAi,
            db
        )
    }
});