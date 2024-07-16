import { Article, ArticleEntity, articleFactory, articleFactoryEntity, Category, CategoryEntity, categoryFactory, CategoryId, locales, SiteId } from "../types";
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

export const getLatestArticles = async (site: SiteId | DocumentData, limit: number, db: Firestore): Promise<{
    article: Article,
    category: Category
}[]> => {
    info(`Fetching latest articles from site`);
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

        const articlesSnapshot = await db.collectionGroup(ARTICLE_COLLECTION)
            .orderBy("createdAt", "desc")
            .where("siteId", "==", siteRef.id)
            .limit(limit)
            .get();

        return Promise.all(articlesSnapshot.docs.map(async (doc: DocumentData): Promise<{
            article: Article,
            category: Category
        }> => {
            const parentCategory = doc.ref.parent.parent;
            const categoryDoc = await parentCategory?.get();
            const { title: titleCategory, description: descriptionCategory, slug: slugCategory } = categoryDoc?.data();
            const { title, keywords, slug, article, summary, description, createdAt, updatedAt } = doc.data();

            return {
                article: articleFactory(
                    title,
                    keywords,
                    description,
                    article,
                    summary,
                    slug,
                    createdAt,
                    updatedAt
                ),
                category: categoryFactory(
                    categoryDoc.id,
                    titleCategory,
                    descriptionCategory,
                    slugCategory
                )
            }
        }));
    } catch (e) {
        error(e);
        throw e;
    }
};

export const getArticlesByCategory = async (
    categoryEntity: CategoryEntity,
): Promise<ArticleEntity[]> => {
    info(`Getting articles in category ${categoryEntity.id} in site`)
    try {
        const articles = await categoryEntity.ref!
            .collection(ARTICLE_COLLECTION)
            .get();

        return articles.docs.map((doc: any) => {
            const data = doc.data();

            return articleFactoryEntity(
                doc.ref,
                doc.id,
                data.title,
                data.keywords,
                data.description,
                data.article,
                data.summary,
                data.slug,
                data.createdAt,
                data.updatedAt
            );
        });
    } catch (e) {
        error(e);
        throw e;
    }
}

export const getArticleBySlug = async (
    categoryEntity: CategoryEntity,
    articleSlug: string,
    locale: locales,
    db: Firestore
): Promise<Article | null> => {
    info(`Getting article by slug ${articleSlug} in category ${categoryEntity.id}`)
    try {
        const articleSnapshot = await categoryEntity.ref!
            .collection(ARTICLE_COLLECTION)
            .where(`slug.${locale}`, '==', articleSlug)
            .limit(1)
            .get();

        if (articleSnapshot.empty) {
            return null;
        }

        const doc = articleSnapshot.docs[0];
        const {
            title,
            keywords,
            slug,
            article,
            description,
            createdAt,
            updatedAt
        } = doc.data();

        return articleFactoryEntity(
            doc.ref,
            doc.id,
            title,
            keywords,
            description,
            article,
            description,
            slug,
            createdAt,
            updatedAt
        );
    } catch (e) {
        error(e);
        throw e;
    }
}
