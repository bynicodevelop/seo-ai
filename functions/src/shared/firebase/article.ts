import { Article, CategoryId, SiteId } from "../types";
import { getSiteById } from "./site";
import { DocumentData, Firestore } from "firebase-admin/firestore";
import { error, info } from "firebase-functions/logger";
import { ARTICLE_COLLECTION, CATEGORY_COLLECTION } from "./types";

export const createArticleToCategory = async (
    article: Article,
    categoryId: CategoryId,
    site: SiteId | DocumentData,
    db: Firestore
) => {
    info(`Creating article in category ${categoryId} in site ${site}`)
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

        await siteRef.ref.collection(CATEGORY_COLLECTION).doc(categoryId).collection(ARTICLE_COLLECTION).add(article);
    } catch (e) {
        error(e);
        throw e;
    }
};