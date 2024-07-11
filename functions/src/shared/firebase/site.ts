import { DocumentData, Firestore, QueryDocumentSnapshot } from "firebase-admin/firestore";
import type { Config } from "../types/config";
import { siteFactory, type Site } from "../types/site";
import { Category } from "../types";

export const initSite = async (config: Config, db: Firestore): Promise<void> => {
    const { domain, sitename, description, keywords, translate, categories } = config;

    const url = new URL(domain);

    await db.collection("site_builder").add({
        domain: url.hostname,
        sitename,
        description,
        keywords,
        translate,
        categories
    });
};

export const createSite = async (site: Site, db: Firestore): Promise<DocumentData> => {
    return await db.collection("sites")
        .add(site);
};

export const getSite = async (domain: string, db: Firestore): Promise<QueryDocumentSnapshot | null> => {
    const snapshot = await db.collection("sites")
        .where("domain", "==", domain)
        .limit(1)
        .get();

    if (snapshot.empty) {
        return null;
    }

    return (snapshot.docs[0] as QueryDocumentSnapshot);
}

export const createCategories = async (site: Site, categories: Category[], db: Firestore): Promise<void> => {
    const batch = db.batch();

    categories.forEach((category) => {
        const ref = db.collection("sites").doc(site.domain).collection("categories").doc();
        batch.set(ref, category);
    });

    await batch.commit();
}