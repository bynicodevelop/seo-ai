import { DocumentReference, Firestore } from "firebase-admin/firestore";
import { Draft } from "../types/draft";
import { DRAFT_COLLECTION } from "./types";
import { getSite } from "./site";

export const createDraft = async (draft: Draft, db: Firestore): Promise<DocumentReference> => {
    const siteRef = await getSite(draft.siteId, db);

    if (!siteRef) {
        throw new Error("Site not found");
    }

    return await siteRef.ref.collection(DRAFT_COLLECTION)
        .add(draft);
}