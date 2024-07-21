import type {
    DocumentData, DocumentReference, Firestore
} from 'firebase-admin/firestore';
import {
    error, info
} from 'firebase-functions/logger';

import { createArticleToCategory } from './article';
import {
    getSiteByDomain, getSiteById
} from './site';
import {
    DRAFT_COLLECTION, DRAFT_STATUS
} from './types';
import type {
    Draft, DraftId, SiteEntity, SiteId
} from '../types';
import { draftFactory } from '../types';
import type { Article } from '../types/article';
import type { ArticlePrompt } from '../types/article-prompt';
import { articleValidator } from '../validators';

export const createDraft = async (
    domainId: SiteId,
    content: string,
    db: Firestore
): Promise<DocumentReference> => {
    const siteRef = await getSiteByDomain(
        domainId,
        db
    );

    if (!siteRef) {
        throw new Error('Site not found');
    }

    return await siteRef.ref!.collection(DRAFT_COLLECTION)
        .add({
            content,
            status: DRAFT_STATUS.DRAFTED
        });
}

export const updateDraft = async (
    draftId: DraftId, site: SiteId | DocumentData, data: Partial<Draft>, db: Firestore
): Promise<void> => {
    try {
        let siteRef;

        if ((site as DocumentData)!.ref === undefined) {
            siteRef = await getSiteById(
                site as SiteId,
                db
            );
        } else {
            siteRef = site as DocumentData;
        }

        if (!siteRef) {
            throw new Error('Site not found');
        }

        await siteRef.ref.collection(DRAFT_COLLECTION).doc(draftId).set(
            data,
            { merge: true }
        );
    } catch (e) {
        error(e);
        throw e;
    }
};

export const updateDraftArticleContent = async (
    draftId: DraftId,
    site: SiteEntity,
    article: string,
    db: Firestore
) => {
    info(`Updating draft article content for draft ${draftId} in site ${site.id!}`);

    try {
        if (!site) {
            throw new Error('Site not found');
        }

        await updateDraft(
            draftId,
            site.id as SiteId,
            {
                article,
                status: DRAFT_STATUS.ARTICLE_CREATED
            } as unknown as Partial<Draft>,
            db
        );
    } catch (e) {
        error(e);
        throw e;
    }
}

export const updateDraftSeo = async (
    draftId: DraftId,
    siteId: SiteId,
    title: string,
    keywords: string[],
    description: string,
    summary: string,
    slug: string,
    db: Firestore
) => {
    info(`Updating draft SEO for draft ${draftId} in site ${siteId}`);

    try {
        const site = await getSiteById(
            siteId,
            db
        );

        if (!site) {
            throw new Error('Site not found');
        }

        await updateDraft(
            draftId,
            siteId,
            {
                title,
                keywords,
                description,
                summary,
                slug,
                status: DRAFT_STATUS.SEO_OPTIMIZED
            } as unknown as Partial<Draft>,
            db
        );
    } catch (e) {
        error(e);
        throw e;
    }
}

export const updateDraftGeneratedArticle = async (
    draftId: DraftId,
    siteId: SiteId,
    article: ArticlePrompt,
    db: Firestore
): Promise<void> => {
    info(`Updating draft generated article for draft ${draftId} in site ${siteId}`);

    try {
        const site = await getSiteById(
            siteId,
            db
        );

        if (!site) {
            throw new Error('Site not found');
        }

        await site.ref!.collection(DRAFT_COLLECTION).doc(draftId).set(
            {
                article,
                status: 'ARTICLE_CREATED'
            },
            { merge: true }
        );
    } catch (e) {
        error(e);
        throw e;
    }
}

export const updateDraftArticle = async (
    draftId: DraftId,
    siteId: SiteId,
    article: Article,
    db: Firestore
): Promise<void> => {
    info(`Updating draft article for draft ${draftId} in site ${siteId}`);

    try {
        const site = await getSiteById(
            siteId,
            db
        );

        if (!site) {
            throw new Error('Site not found');
        }

        await updateDraft(
            draftId,
            siteId,
            {
                publishableArticle: article,
                status: DRAFT_STATUS.READY_FOR_PUBLISHING
            } as unknown as Partial<Draft>,
            db
        );
    } catch (e) {
        error(e);
        throw e;
    }
};

export const updateDraftCategory = async (
    draftId: DraftId,
    siteId: SiteId,
    categoryId: string,
    db: Firestore
): Promise<void> => {
    info(`Updating draft category for draft ${draftId} in site ${siteId}`);

    try {
        const site = await getSiteById(
            siteId,
            db
        );

        if (!site) {
            throw new Error('Site not found');
        }

        await updateDraft(
            draftId,
            siteId,
            {
                categoryId,
                status: DRAFT_STATUS.CATEGORY_SELECTED
            } as unknown as Partial<Draft>,
            db
        );
    } catch (e) {
        error(e);
        throw e;
    }
};

export const getDraftById = async (
    draftId: DraftId,
    site: SiteId | DocumentData,
    db: Firestore
): Promise<Draft> => {
    info(`Getting draft ${draftId} in site`);

    try {
        let siteRef;

        if ((site as DocumentData)!.ref === undefined) {
            siteRef = await getSiteById(
                site as SiteId,
                db
            );
        } else {
            siteRef = site as DocumentData;
        }

        if (!siteRef) {
            throw new Error('Site not found');
        }

        const draft = await siteRef!.ref.collection(DRAFT_COLLECTION).doc(draftId).get();

        if (!draft.exists) {
            throw new Error('Draft not found');
        }

        const {
            content,
            article,
            title,
            keywords,
            description,
            summary,
            slug,
            categoryId,
            publishableArticle,
            status,
        } = draft.data();

        return draftFactory(
            draft.id,
            content,
            article,
            title,
            keywords,
            description,
            summary,
            slug,
            categoryId,
            publishableArticle,
            status,
        );
    } catch (e) {
        error(e);
        throw e;
    }
}

export const convertDraftToArticle = async (
    draftId: DraftId,
    site: SiteEntity,
    db: Firestore
) => {
    info(`Converting draft ${draftId} to article`);

    const {
        categoryId, publishableArticle
    } = await getDraftById(
        draftId,
        site,
        db
    );

    let status = 'PUBLISHED';

    try {
        await articleValidator(
            publishableArticle!,
            site.locales
        );

        await createArticleToCategory(
            publishableArticle!,
            categoryId!,
            site,
            db
        );
    } catch (e) {
        error(e);

        status = 'ERROR_ARTICLE_NOT_COMPLETE';
    }

    await updateDraft(
        draftId,
        site.id as SiteId,
        { status } as unknown as Partial<Draft>,
        db
    );
}