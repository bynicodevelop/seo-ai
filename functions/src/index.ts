import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { Category, categoryFactory, createCategories, createSite, Draft, generateCategoriesPrompt, getSiteById, I18n, initOpentAI, Site, siteFactory, translateCategoriesPrompt, translatePrompt } from './shared';
import { defineString } from "firebase-functions/params";
import { first, isEmpty } from "lodash";
import { updateDraft } from "./shared/firebase/draft";
import { Firestore } from "firebase-admin/firestore";
import OpenAI from "openai";
import { generateContent } from "./shared/prompts/generate-content";

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
                category.title,
                category.description,
                category.slug
            ))),
        db
    );
});

const generateArticle = async (
    siteId: string,
    draftId: string,
    content: string,
    openAi: OpenAI,
    db: Firestore
) => {
    const siteRef = await getSiteById(siteId, db);
    const site = siteRef?.data() as Site;

    const article = await generateContent(site, {
        content
    }, openAi);

    const draft = {
        article,
        status: 'ARTICLE_CREATED',
    }

    await updateDraft(draftId, siteId, draft, db);
};

export const onDraftCreated = onDocumentWritten('sites/{siteId}/drafts/{draftId}', async (event) => {
    const db = admin.firestore();
    const openAi = initOpentAI(openAIKey.value());
    const { siteId, draftId } = event.params;

    const { content, status } = event.data?.after.data() as Partial<Draft>;

    if (status === 'DRAFT' && content) {
        await generateArticle(
            siteId,
            draftId,
            content,
            openAi,
            db
        );
    }
});