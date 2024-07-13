import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { Category, categoryFactory, createCategories, createSite, Draft, draftFactory, generateCategoriesPrompt, getSiteById, I18n, initOpentAI, Site, siteFactory, translateCategoriesPrompt, translatePrompt } from './shared';
import { defineString } from "firebase-functions/params";
import { first, isEmpty } from "lodash";
import { updateDraft, updateDraftArticle } from "./shared/firebase/draft";
import { Firestore } from "firebase-admin/firestore";
import OpenAI from "openai";
import { generateArticleFromContent, generateSeoFromArticle } from "./shared/prompts/generate-content";
import { articleFactory } from "./shared/types/article";

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

    const article = await generateArticleFromContent(content, site, openAi);

    const draft = draftFactory(
        siteId,
        content,
        article,
        'ARTICLE_CREATED'
    )

    await updateDraft(draftId, siteId, draft, db);
};

const generateSeo = async (
    draftId: string,
    draft: Draft,
    openAi: OpenAI,
    db: Firestore
) => {
    if (!draft.article) {
        return;
    }
    const seo = await generateSeoFromArticle(draft.article, openAi);

    await updateDraft(
        draftId,
        draft.siteId,
        draftFactory(
            draft.siteId,
            draft.content,
            draft.article,
            seo.title,
            seo.keywords,
            seo.description,
            'SEO_OPTIMIZED'
        ),
        db
    );
}

const translate = async (
    draftId: string,
    draft: Draft,
    openAi: OpenAI,
    db: Firestore
) => {
    // const siteRef = await getSiteById(draft.siteId, db);

    // const site = siteRef?.data() as Site;
    // TODO: Manque les langes de traduction dans le site
    const languages = ['fr', 'en'];

    // TODO: Tester dans un Promise.all
    const title = await translatePrompt(languages, draft.title!, openAi);
    const keywords = await translatePrompt(languages, draft.keywords!.join(', '), openAi);
    const description = await translatePrompt(languages, draft.description!, openAi);
    const article = await translatePrompt(languages, draft.article!, openAi);

    const articleEntity = articleFactory(
        title,
        keywords,
        description,
        article
    );

    await updateDraftArticle(draftId, draft.siteId, articleEntity, db);
}

export const onDraftCreated = onDocumentWritten('sites/{siteId}/drafts/{draftId}', async (event) => {
    const db = admin.firestore();
    const openAi = initOpentAI(openAIKey.value());
    const { siteId, draftId } = event.params;

    const { content, status, article, title, keywords, description } = event.data?.after.data() as Partial<Draft>;

    if (status === 'DRAFT' && content) {
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
            draftFactory(
                siteId,
                content!,
                article,
                status
            ),
            openAi,
            db
        );
    }

    if (status === 'SEO_OPTIMIZED') {
        translate(
            draftId,
            draftFactory(
                siteId,
                content!,
                article!,
                title!,
                keywords!,
                description!,
                status,
            ),
            openAi,
            db
        )
    }
});