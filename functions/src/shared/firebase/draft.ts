import { DocumentReference, Firestore } from "firebase-admin/firestore";
import { error, info } from "firebase-functions/logger";
import { DraftId, SiteId } from "../types";
import { Article } from "../types/article";
import { getSiteByDomain, getSiteById } from "./site";
import { DRAFT_COLLECTION } from "./types";

export const createDraft = async (
    domainId: SiteId,
    content: string,
    db: Firestore
): Promise<DocumentReference> => {
    const siteRef = await getSiteByDomain(domainId, db);

    if (!siteRef) {
        throw new Error("Site not found");
    }

    return await siteRef.ref.collection(DRAFT_COLLECTION)
        .add({
            content,
            status: 'DRAFT'
        });
}

export const updateDraft = async (draftId: DraftId, siteId: SiteId, data: any, db: Firestore): Promise<void> => {
    const site = await getSiteById(siteId, db);

    if (!site) {
        throw new Error("Site not found");
    }

    await site.ref.collection(DRAFT_COLLECTION).doc(draftId).set(data, { merge: true });
};

export const updateDraftArticleContent = async (
    draftId: DraftId,
    siteId: SiteId,
    article: string,
    db: Firestore
) => {
    info(`Updating draft article content for draft ${draftId} in site ${siteId}`);

    try {
        const site = await getSiteById(siteId, db);

        if (!site) {
            throw new Error("Site not found");
        }

        await site.ref.collection(DRAFT_COLLECTION).doc(draftId).set({
            article,
            status: 'ARTICLE_CREATED'
        }, { merge: true });
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
    db: Firestore
) => {
    info(`Updating draft SEO for draft ${draftId} in site ${siteId}`);

    try {
        const site = await getSiteById(siteId, db);

        if (!site) {
            throw new Error("Site not found");
        }

        await site.ref.collection(DRAFT_COLLECTION).doc(draftId).set({
            title,
            keywords,
            description,
            summary,
            status: 'SEO_OPTIMIZED'
        }, { merge: true });
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
        const site = await getSiteById(siteId, db);

        if (!site) {
            throw new Error("Site not found");
        }

        await site.ref.collection(DRAFT_COLLECTION).doc(draftId).set({
            publishableArticle: article,
            status: 'READY_FOR_PUBLISHING'
        }, { merge: true });
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
        const site = await getSiteById(siteId, db);

        if (!site) {
            throw new Error("Site not found");
        }

        await site.ref.collection(DRAFT_COLLECTION).doc(draftId).set({
            categoryId,
            status: 'CATEGORY_SELECTED'
        }, { merge: true });
    } catch (e) {
        error(e);
        throw e;
    }
};