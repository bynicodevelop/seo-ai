import type { Firestore } from 'firebase-admin/firestore';
import {
    error, info
} from 'firebase-functions/logger';
import type OpenAI from 'openai';

import { formatingSlug } from './slug';
import {
    Draft,
    articleFactory, convertDraftToArticle, DRAFT_ERROR_STATUS, type DraftId, generateArticleFromContent, generateSeoFromArticle, getCategories, getSiteById, type SiteId, translatePrompt, updateDraft, updateDraftArticle, updateDraftArticleContent, updateDraftCategory, updateDraftSeo
} from '../shared';
import { selectCategoryForArticlePrompt } from '../shared/prompts/select-category-for-article';
import { validateCategoryId } from '../shared/validators/category';
import { validateArticleSeoDetails } from '../shared/validators/seo';
import { validateTranslation } from '../shared/validators/translate';

export const selectCategoryForArticle = async (
    content: string,
    draftId: string,
    siteId: SiteId,
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

    // TODO: TRY CATCH
    const categorySelected = await selectCategoryForArticlePrompt(
        content!,
        categories,
        openAi
    );

    try {
        await validateCategoryId(categorySelected);
    } catch (e) {
        error(e);

        await updateDraft(
            draftId,
            siteId as SiteId,
            { status: DRAFT_ERROR_STATUS.ERROR_CATEGORY_NOT_SELECTED } as unknown as Partial<Draft>,
            db
        );

        return;
    }

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

    // TODO: TRY CATCH
    const article = await generateArticleFromContent(
        content,
        site!,
        openAi
    );

    if (!article) {
        await updateDraft(
            draftId,
            siteId,
            { status: DRAFT_ERROR_STATUS.ERROR_ARTICLE_NOT_GENERATED } as unknown as Partial<Draft>,
            db
        );

        return;
    }

    await updateDraftArticleContent(
        draftId,
        site!,
        article,
        db
    );
};

export const generateSeo = async (
    draftId: string,
    siteId: string,
    article: string,
    openAi: OpenAI,
    db: Firestore
) => {
    // TODO: TRY CATCH

    const seo = await generateSeoFromArticle(
        article,
        openAi
    );

    try {
        await validateArticleSeoDetails(seo);
    } catch (e) {
        error(e);

        await updateDraft(
            draftId,
            siteId,
            { status: DRAFT_ERROR_STATUS.ERROR_ARTICLE_SEO_DETAILS_NOT_COMPLETE } as unknown as Partial<Draft>,
            db
        );

        return;
    }

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

// TODO: Tester dans un Promise.all
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

    // TODO: TRY CATCH
    const languages = site!.locales;


    const titleTranslated = await translatePrompt(
        languages,
        title,
        openAi
    );

    try {
        await validateTranslation(
            titleTranslated,
            languages
        );
    } catch (e) {
        error(e);

        await updateDraft(
            draftId,
            siteId,
            { status: DRAFT_ERROR_STATUS.ERROR_TRANSLATION } as unknown as Partial<Draft>,
            db
        );

        return;
    }

    const keywordsTranslated = await translatePrompt(
        languages,
        keywords.join(', '),
        openAi
    );

    try {
        await validateTranslation(
            keywordsTranslated,
            languages
        );
    } catch (e) {
        error(e);

        await updateDraft(
            draftId,
            siteId,
            { status: DRAFT_ERROR_STATUS.ERROR_TRANSLATION } as unknown as Partial<Draft>,
            db
        );

        return;
    }

    const descriptionTranslated = await translatePrompt(
        languages,
        description,
        openAi
    );

    try {
        await validateTranslation(
            descriptionTranslated,
            languages
        );
    } catch (e) {
        error(e);

        await updateDraft(
            draftId,
            siteId,
            { status: DRAFT_ERROR_STATUS.ERROR_TRANSLATION } as unknown as Partial<Draft>,
            db
        );

        return;
    }

    const summaryTranslated = await translatePrompt(
        languages,
        summary,
        openAi
    );

    try {
        await validateTranslation(
            summaryTranslated,
            languages
        );
    } catch (e) {
        error(e);

        await updateDraft(
            draftId,
            siteId,
            { status: DRAFT_ERROR_STATUS.ERROR_TRANSLATION } as unknown as Partial<Draft>,
            db
        );

        return;
    }

    const articleTranslated = await translatePrompt(
        languages,
        article,
        openAi
    );

    try {
        await validateTranslation(
            articleTranslated,
            languages
        );
    } catch (e) {
        error(e);

        await updateDraft(
            draftId,
            siteId,
            { status: DRAFT_ERROR_STATUS.ERROR_TRANSLATION } as unknown as Partial<Draft>,
            db
        );

        return;
    }

    const slugTranslated = await translatePrompt(
        languages,
        slug,
        openAi
    );

    try {
        await validateTranslation(
            slugTranslated,
            languages
        );
    } catch (e) {
        error(e);

        await updateDraft(
            draftId,
            siteId,
            { status: DRAFT_ERROR_STATUS.ERROR_TRANSLATION } as unknown as Partial<Draft>,
            db
        );

        return;
    }

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