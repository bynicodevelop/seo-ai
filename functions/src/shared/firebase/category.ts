import { DocumentData, Firestore } from "firebase-admin/firestore";
import { Category, categoryFactory, Site } from "../types";
import { CATEGORY_COLLECTION } from "./types";
import { getSiteByDomain } from "./site";
import { error } from "firebase-functions/logger";

export const createCategories = async (site: Site, categories: Category[], db: Firestore): Promise<void> => {
    try {
        const batch = db.batch();

        const siteByDomain = await getSiteByDomain(site.domain, db);

        categories.forEach((category) => {
            let ref;

            if (!category.id) {
                ref = siteByDomain!.ref.collection(CATEGORY_COLLECTION).doc();
            } else {
                ref = siteByDomain!.ref.collection(CATEGORY_COLLECTION).doc(category.id);
            }

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
export const getCategories = async (site: Site | DocumentData, db: Firestore): Promise<Category[]> => {
    try {
        let siteByDomain;

        if ((site as DocumentData)!.ref === undefined) {
            siteByDomain = await getSiteByDomain(site.domain, db);
        } else {
            siteByDomain = site as DocumentData;
        }

        if (!siteByDomain) {
            return [];
        }

        const categories = await siteByDomain!.ref.collection(CATEGORY_COLLECTION).get();

        return categories.docs.map((doc: any) => {
            const { title, description, slug } = doc.data() as Category;

            return categoryFactory(
                doc.id,
                title,
                description,
                slug
            )
        });
    } catch (e) {
        error(e);
        throw e;
    }
}