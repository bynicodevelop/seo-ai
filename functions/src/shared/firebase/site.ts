import type { Firestore } from "firebase-admin/firestore";
import type { Config } from "../types/config";
import { siteFactory, type Site } from "../types/site";

export const initSite = async (config: Config, db: Firestore): Promise<void> => {
    const { domain, sitename, description, keywords, translate } = config;

    const url = new URL(domain);

    await db.collection("site_builder").add({
        domain: url.hostname,
        sitename,
        description,
        keywords,
        translate,
    });
};

export const createSite = async (site: Site, db: Firestore): Promise<void> => {
    await db.collection("sites")
        .doc(site.domain)
        .set(siteFactory(site.domain, site.seo));
};