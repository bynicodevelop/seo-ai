import type {
    DocumentData, Firestore
} from 'firebase-admin/firestore';

import {
    SITE_BUILDER_COLLECTION, SITE_COLLECTION
} from './types';
import {
    configFactory, siteFactoryEntity
} from '../types';
import type { Config } from '../types/config';
import type {
    SiteDomain, SiteId, Site,
    SiteEntity
} from '../types/site';

export const initSite = async (
    config: Config, db: Firestore
): Promise<void> => {
    const {
        domain, sitename, description, keywords, locales, categories
    } = config;

    const url = new URL(domain);

    await db.collection(SITE_BUILDER_COLLECTION).add(configFactory(
            url.hostname,
            sitename,
            description,
            locales,
            keywords ?? [],
            categories ?? [] as unknown as [{ [key: string]: string }]
        ));
};

export const createSite = async (
    site: Site, db: Firestore
): Promise<DocumentData> => {
    return await db.collection(SITE_COLLECTION)
        .add(site);
};

export const getSiteById = async (
    siteId: SiteId, db: Firestore
): Promise<SiteEntity | null> => {
    const snapshot = await db.collection(SITE_COLLECTION)
        .doc(siteId)
        .get();

    if (!snapshot.exists) {
        return null;
    }

    const {
        domain, seo, locales, createdAt, updatedAt
    } = snapshot.data() as DocumentData;

    return siteFactoryEntity(
        snapshot.ref,
        snapshot.id,
        domain,
        seo,
        locales,
        createdAt,
        updatedAt
    );
}

export const getSiteByDomain = async (
    domain: SiteDomain, db: Firestore
): Promise<SiteEntity | null> => {
    const queryDocumentSnapshot = await db.collection(SITE_COLLECTION)
        .where(
            'domain',
            '==',
            domain
        )
        .limit(1)
        .get();

    if (queryDocumentSnapshot.empty) {
        return null;
    }

    const snapshot = queryDocumentSnapshot.docs[0] as DocumentData;

    const {
        seo, locales, createdAt, updatedAt
    } = snapshot.data() as DocumentData;

    return siteFactoryEntity(
        snapshot.ref,
        snapshot.id,
        domain,
        seo,
        locales,
        createdAt,
        updatedAt
    );
}