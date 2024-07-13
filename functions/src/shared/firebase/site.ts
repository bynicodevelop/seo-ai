import { DocumentData, Firestore, QueryDocumentSnapshot } from "firebase-admin/firestore";
import type { Config } from "../types/config";
import { SiteDomain, SiteId, type Site } from "../types/site";
import { Category, configFactory } from "../types";
import { CATEGORY_COLLECTION, SITE_COLLECTION } from "./types";

export const initSite = async (config: Config, db: Firestore): Promise<void> => {
    const { domain, sitename, description, keywords, locales, categories } = config;

    const url = new URL(domain);

    await db.collection("site_builder").add(
        configFactory(
            url.hostname,
            sitename,
            description,
            locales,
            keywords ?? [],
            categories ?? [] as any
        )
    );
};

export const createSite = async (site: Site, db: Firestore): Promise<DocumentData> => {
    return await db.collection(SITE_COLLECTION)
        .add(site);
};

export const getSiteById = async (siteId: SiteId, db: Firestore): Promise<DocumentData | null> => {
    const snapshot = await db.collection(SITE_COLLECTION)
        .doc(siteId)
        .get();

    if (!snapshot.exists) {
        return null;
    }


    return snapshot;
}

export const getSiteByDomain = async (domain: SiteDomain, db: Firestore): Promise<QueryDocumentSnapshot | null> => {
    const snapshot = await db.collection(SITE_COLLECTION)
        .where("domain", "==", domain)
        .limit(1)
        .get();

    if (snapshot.empty) {
        return null;
    }

    return (snapshot.docs[0] as QueryDocumentSnapshot);
}

export const createCategories = async (site: Site, categories: Category[], db: Firestore): Promise<void> => {
    const siteRef = await getSiteByDomain(site.domain, db);

    const batch = db.batch();

    categories.forEach((category) => {
        const ref = siteRef?.ref.collection(CATEGORY_COLLECTION).doc();

        if (ref) {
            batch.set(ref, category);
        }
    });

    await batch.commit();
}