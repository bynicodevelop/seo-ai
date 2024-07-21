import type { Firestore } from 'firebase-admin/firestore';
import {
    error, info
} from 'firebase-functions/logger';
import type OpenAI from 'openai';

import { formatingSlug } from './slug';
import type {
    ArticlePrompt, Draft, DraftId, SiteId, SiteEntity
} from '../shared';
import {

    articleFactory, convertDraftToArticle, DRAFT_ERROR_STATUS, generatePrompts, getCategories, getSiteById, translatePrompt, updateDraft, updateDraftArticle, updateDraftCategory, updateDraftGeneratedArticle
} from '../shared';
import { ArticleGenerationException } from '../shared/exceptions/article-generation';
import { selectCategoryForArticlePrompt } from '../shared/prompts/select-category-for-article';
import { validateCategoryId } from '../shared/validators/category';

const getSite = async (
    siteId: SiteId,
    db: Firestore
): Promise<SiteEntity> => {
    const site = await getSiteById(
        siteId,
        db
    );

    if (!site) {
        throw new Error('Site not found');
    }

    return site;
}

export const selectCategoryForArticle = async (
    content: string,
    draftId: string,
    siteId: SiteId,
    openAi: OpenAI,
    db: Firestore
) => {
    const site = await getSite(
        siteId,
        db
    );


    const categories = await getCategories(
        site,
        db
    );

    try {
        const categorySelected = await selectCategoryForArticlePrompt(
            content!,
            categories,
            openAi
        );

        try {
            await validateCategoryId(categorySelected);

            await updateDraftCategory(
                draftId,
                siteId,
                categorySelected.id!,
                db
            );
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
    } catch (e) {
        error(e);

        await updateDraft(
            draftId,
            siteId as SiteId,
            { status: DRAFT_ERROR_STATUS.ERROR_OPENAI_API } as unknown as Partial<Draft>,
            db
        );

        return;
    }
};

export const generateArticle = async (
    draftId: string,
    siteId: string,
    content: string,
    openAi: OpenAI,
    db: Firestore
) => {
    const site = await getSite(
        siteId,
        db
    );

    let article: ArticlePrompt;

    try {
        article = await generatePrompts(
            site,
            content,
            openAi
        );
    } catch (e: unknown) {
        if (e instanceof ArticleGenerationException) {
            await updateDraft(
                draftId,
                siteId,
                { status: e.message } as Partial<Draft>,
                db
            );

            return;
        }

        throw e;
    }

    await updateDraftGeneratedArticle(
        draftId,
        siteId,
        article,
        db
    );
}

export const translate = async (
    draftId: string,
    siteId: string,
    article: ArticlePrompt,
    openAi: OpenAI,
    db: Firestore
) => {
    const site = await getSite(
        siteId,
        db
    );

    const languages = site!.locales;

    // TODO: Tester dans un Promise.all
    try {
        const titleTranslated = await translatePrompt(
            languages,
            article.title,
            openAi
        );
        const keywordsTranslated = await translatePrompt(
            languages,
            article.keywords.join(', '),
            openAi
        );
        const descriptionTranslated = await translatePrompt(
            languages,
            article.description,
            openAi
        );
        const summaryTranslated = await translatePrompt(
            languages,
            article.summary,
            openAi
        );
        const articleTranslated = await translatePrompt(
            languages,
            article.article,
            openAi
        );
        const slugTranslated = await translatePrompt(
            languages,
            article.slug,
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
    } catch (e) {
        error(e);

        await updateDraft(
            draftId,
            siteId,
            { status: DRAFT_ERROR_STATUS.ERROR_OPENAI_API } as unknown as Partial<Draft>,
            db
        );
    }
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