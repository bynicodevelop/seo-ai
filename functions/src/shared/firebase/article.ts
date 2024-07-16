import { Article, articleFactory, CategoryId, SiteId } from "../types";
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

export const getArticlesByCategory = async (
    site: SiteId | DocumentData,
    categoryId: CategoryId,
    db: Firestore
): Promise<Article[]> => {
    info(`Getting articles in category ${categoryId} in site`)
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

        const articles = await siteRef.ref
            .collection(CATEGORY_COLLECTION)
            .doc(categoryId)
            .collection(ARTICLE_COLLECTION)
            .get();

        return articles.docs.map((doc: any) => {
            const data = doc.data();

            return articleFactory(
                data.title,
                data.keywords,
                data.description,
                data.article,
                data.summary,
                data.slug,
                data.createdAt,
                data.updatedAt
            )
        });
    } catch (e) {
        error(e);
        throw e;
    }
}