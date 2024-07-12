import { DocumentReference, Firestore } from "firebase-admin/firestore";
import { Draft, DraftId, SiteId } from "../types";
import { getSiteByDomain, getSiteById } from "./site";
import { DRAFT_COLLECTION } from "./types";
import { Article } from "../types/article";

export const updateDraft = async (draftId: DraftId, siteId: SiteId, data: any, db: Firestore): Promise<void> => {
    const site = await getSiteById(siteId, db);

    if (!site) {
        throw new Error("Site not found");
    }

    await site.ref.collection(DRAFT_COLLECTION).doc(draftId).set(data, { merge: true });
};

export const updateDraftArticle = async (draftId: DraftId, siteId: SiteId, article: Article, db: Firestore): Promise<void> => {
    const site = await getSiteById(siteId, db);

    if (!site) {
        throw new Error("Site not found");
    }

    await site.ref.collection(DRAFT_COLLECTION).doc(draftId).set({
        publishableArticle: article,
        status: 'READY_FOR_PUBLISHING'
    }, { merge: true });
};

export const createDraft = async (draft: Draft, db: Firestore): Promise<DocumentReference> => {
    const siteRef = await getSiteByDomain(draft.siteId, db);

    if (!siteRef) {
        throw new Error("Site not found");
    }

    return await siteRef.ref.collection(DRAFT_COLLECTION)
        .add(draft);
}