import type { Firestore } from 'firebase-admin/firestore';
import { info } from 'firebase-functions/logger';
import type OpenAI from 'openai';

import {
    articleFactory, convertDraftToArticle, type DraftId, generateArticleFromContent, generateSeoFromArticle, getCategories, getSiteById, type SiteId, translatePrompt, updateDraftArticle, updateDraftArticleContent, updateDraftCategory, updateDraftSeo
} from '../shared';
import { selectCategoryForArticlePrompt } from '../shared/prompts/select-category-for-article';
import { formatingSlug } from "./slug";

export const selectCategoryForArticle = async (
    content: string,
    draftId: string,
    siteId: string,
    openAi: OpenAI,
    db: Firestore
) => {
    const site = await getSiteById(
        siteId,
        db
    );
    const categories = await getCategories(
        site!,
        db
    );

    const categorySelected = await selectCategoryForArticlePrompt(
        content!,
        categories,
        openAi
    );

    await updateDraftCategory(
        draftId,
        siteId,
        categorySelected.id!,
        db
    );
};

export const generateArticle = async (
    siteId: string,
    draftId: string,
    content: string,
    openAi: OpenAI,
    db: Firestore
) => {
    const site = await getSiteById(
        siteId,
        db
    );

    // TODO: généré le cas d'erreur
    // Ajouter un status erreur en BDD
    const article = await generateArticleFromContent(
        content,
        site!,
        openAi
    );
    await updateDraftArticleContent(
        draftId,
        site!,
        article
    );
};

export const generateSeo = async (
    draftId: string,
    siteId: string,
    article: string,
    openAi: OpenAI,
    db: Firestore
) => {
    const seo = await generateSeoFromArticle(
        article,
        openAi
    );

    await updateDraftSeo(
        draftId,
        siteId,
        seo.title,
        seo.keywords,
        seo.description,
        seo.summary,
        seo.slug,
        db
    );
}

export const translate = async (
    draftId: string,
    siteId: string,
    title: string,
    article: string,
    keywords: string[],
    description: string,
    summary: string,
    slug: string,
    openAi: OpenAI,
    db: Firestore
) => {
    const site = await getSiteById(
        siteId,
        db
    );

    // TODO: généré le cas d'erreur
    // Ajouter un status erreur en BDD
    const languages = site!.locales;

    // TODO: Tester dans un Promise.all
    const titleTranslated = await translatePrompt(
        languages,
        title,
        openAi
    );
    const keywordsTranslated = await translatePrompt(
        languages,
        keywords.join(', '),
        openAi
    );
    const descriptionTranslated = await translatePrompt(
        languages,
        description,
        openAi
    );
    const summaryTranslated = await translatePrompt(
        languages,
        summary,
        openAi
    );
    const articleTranslated = await translatePrompt(
        languages,
        article,
        openAi
    );
    const slugTranslated = await translatePrompt(
        languages,
        slug,
        openAi
    );

    await updateDraftArticle(
        draftId,
        siteId,
        articleFactory(
            titleTranslated,
            keywordsTranslated,
            descriptionTranslated,
            articleTranslated,
            summaryTranslated,
            formatingSlug(slugTranslated)
        ),
        db
    );
}

export const moveDraftToArticle = async (
    draftId: DraftId,
    siteId: SiteId,
    db: Firestore
) => {
    info(`Moving draft ${draftId} to article in site ${siteId}`);

    const site = await getSiteById(
        siteId,
        db
    );

    if (!site) {
        throw new Error('Site not found');
    }

    await convertDraftToArticle(
        draftId,
        site,
        db
    );

    info(`Draft ${draftId} moved to article in site ${siteId}`);
}