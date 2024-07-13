import { DocumentData, Firestore, QueryDocumentSnapshot } from "firebase-admin/firestore";
import type { Config } from "../types/config";
import { SiteDomain, SiteId, type Site } from "../types/site";
import { SITE_COLLECTION } from "./types";

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