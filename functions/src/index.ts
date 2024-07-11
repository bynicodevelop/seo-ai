import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { Category, categoryFactory, createCategories, createSite, generateCategoriesPrompt, I18n, initOpentAI, locales, Site, siteFactory, translateCategoriesPrompt, translatePrompt } from './shared';
import { defineString } from "firebase-functions/params";
import { first, isEmpty } from "lodash";

admin.initializeApp();

// firebase functions:secrets:set OPENAI_API
const openAIKey = defineString('OPENAI_API');

export const onSiteBuilder = onDocumentCreated('site_builder/{builderId}', async (event) => {
    const db = admin.firestore();
    const openAi = initOpentAI(openAIKey.value());

    const data = event.data as any;

    const { domain, sitename, description, keywords, translate, categories } = data?.data() as any;

    let defaultTranslate: any[] = ['fr'];

    if (translate && translate.length > 0) {
        defaultTranslate = translate;
    }

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
                category.title,
                category.description,
                category.slug
            ))),
        db
    );
});