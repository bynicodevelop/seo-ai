import { DocumentData, Firestore } from "firebase-admin/firestore";
import { Category, CategoryEntity, categoryFactoryEntity, locales, SiteEntity } from "../types";
import { CATEGORY_COLLECTION } from "./types";
import { getSiteByDomain } from "./site";
import { error } from "firebase-functions/logger";

export const createCategories = async (site: SiteEntity, categories: Category[], db: Firestore): Promise<void> => {
    try {
        const batch = db.batch();

        const siteByDomain = await getSiteByDomain(site.domain, db);

        categories.forEach((category) => {
            let ref = siteByDomain!.ref!.collection(CATEGORY_COLLECTION).doc();

            batch.set(ref, category);
        });

        await batch.commit();
    } catch (e) {
        error(e);
        throw e;
    }
}

/**
 * Permet de récupérer les catégories d'un site
 * 
 * Site est de type Site ou DocumentData pour permettre 
 * l'utilisation d'une reférence de site par ID de document et pas par domaine
 * 
 * @param site 
 * @param db 
 * @returns 
 */
export const getCategories = async (site: SiteEntity, db: Firestore): Promise<CategoryEntity[]> => {
    try {
        let siteByDomain;

        if ((site)!.ref === undefined) {
            siteByDomain = await getSiteByDomain(site.domain, db);
        } else {
            siteByDomain = site as SiteEntity;
        }

        if (!siteByDomain) {
            return [];
        }

        const categories = await siteByDomain!.ref!.collection(CATEGORY_COLLECTION).get();

        return categories.docs.map((doc: any) => {
            const { title, description, slug } = doc.data();

            return categoryFactoryEntity(
                doc.ref,
                doc.id,
                title,
                description,
                slug
            );
        });
    } catch (e) {
        error(e);
        throw e;
    }
}

export const getCategoryBySlug = async (site: SiteEntity, categorySlug: string, locale: locales, db: Firestore): Promise<CategoryEntity | null> => {
    try {
        let siteByDomain;

        if ((site as SiteEntity)!.ref === undefined) {
            siteByDomain = await getSiteByDomain(site.domain, db);
        } else {
            siteByDomain = site as SiteEntity;
        }

        if (!siteByDomain) {
            return null;
        }

        const categories = await siteByDomain!.ref!
            .collection(CATEGORY_COLLECTION)
            .where(`slug.${locale}`, '==', categorySlug)
            .limit(1)
            .get();

        const doc = categories.docs[0] as DocumentData;
        const { title, description, slug } = doc.data();

        return categoryFactoryEntity(
            doc.ref,
            doc.id,
            title,
            description,
            slug
        );
    } catch (e) {
        error(e);
        throw e;
    }
}