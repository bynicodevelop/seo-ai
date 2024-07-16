import { DocumentData, DocumentReference, Firestore } from "firebase-admin/firestore";
import { error, info } from "firebase-functions/logger";
import { Draft, draftFactory, DraftId, SiteEntity, SiteId } from "../types";
import { Article } from "../types/article";
import { getSiteByDomain, getSiteById } from "./site";
import { DRAFT_COLLECTION } from "./types";
import { createArticleToCategory } from "./article";

export const createDraft = async (
    domainId: SiteId,
    content: string,
    db: Firestore
): Promise<DocumentReference> => {
    const siteRef = await getSiteByDomain(domainId, db);

    if (!siteRef) {
        throw new Error("Site not found");
    }

    return await siteRef.ref!.collection(DRAFT_COLLECTION)
        .add({
            content,
            status: 'DRAFT'
        });
}

export const updateDraft = async (draftId: DraftId, site: SiteId | DocumentData, data: any, db: Firestore): Promise<void> => {
    try {
        let siteRef;

        if ((site as DocumentData)!.ref === undefined) {
            siteRef = await getSiteById(site as SiteId, db);
        } else {
            siteRef = site as DocumentData;
        }

        if (!siteRef) {
            throw new Error("Site not found");
        }

        await siteRef.ref.collection(DRAFT_COLLECTION).doc(draftId).set(data, { merge: true });
    } catch (e) {
        error(e);
        throw e;
    }
};

export const updateDraftArticleContent = async (
    draftId: DraftId,
    site: SiteEntity,
    article: string,
) => {
    info(`Updating draft article content for draft ${draftId} in site ${site.id!}`);

    try {
        if (!site) {
            throw new Error("Site not found");
        }

        await site.ref!.collection(DRAFT_COLLECTION).doc(draftId).set({
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
    slug: string,
    db: Firestore
) => {
    info(`Updating draft SEO for draft ${draftId} in site ${siteId}`);

    try {
        const site = await getSiteById(siteId, db);

        if (!site) {
            throw new Error("Site not found");
        }

        await site.ref!.collection(DRAFT_COLLECTION).doc(draftId).set({
            title,
            keywords,
            description,
            summary,
            slug,
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

        await site.ref!.collection(DRAFT_COLLECTION).doc(draftId).set({
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

        await site.ref!.collection(DRAFT_COLLECTION).doc(draftId).set({
            categoryId,
            status: 'CATEGORY_SELECTED'
        }, { merge: true });
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
            siteRef = await getSiteById(site as SiteId, db);
        } else {
            siteRef = site as DocumentData;
        }

        if (!siteRef) {
            throw new Error("Site not found");
        }

        const draft = await siteRef!.ref.collection(DRAFT_COLLECTION).doc(draftId).get();

        if (!draft.exists) {
            throw new Error("Draft not found");
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
    site: SiteId | DocumentData,
    db: Firestore
) => {
    info(`Converting draft ${draftId} to article`);

    const { categoryId, publishableArticle } = await getDraftById(draftId, site, db);

    await createArticleToCategory(
        publishableArticle!,
        categoryId!,
        site,
        db
    );

    await updateDraft(draftId, site as SiteId, {
        status: 'PUBLISHED'
    }, db);
}