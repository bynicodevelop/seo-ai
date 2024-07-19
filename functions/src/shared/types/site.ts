import type { DocumentReference } from 'firebase-admin/firestore';

import type {
 ID, IdType, Reference 
} from './common';
import type { locales } from './i18n';
import type { MetaSeo } from './meta-seo';

export type SiteId = string;
export type SiteDomain = string;

export type Site = {
    ref?: DocumentReference;
    domain: SiteDomain;
    seo: MetaSeo;
    locales: locales[];
    createdAt?: Date;
    updatedAt?: Date;
}

export type SiteEntity = Site & Reference & IdType;

export function siteFactory(
    id: SiteDomain,
    seo: MetaSeo,
    locales: locales[],
): Site;
export function siteFactory(
    domain: SiteDomain,
    seo: MetaSeo,
    locales: locales[],
    createdAt?: Date,
    updatedAt?: Date
): Site {
    return {
        domain,
        seo,
        locales,
        createdAt: createdAt ?? new Date(),
        updatedAt: updatedAt ?? new Date()
    }
}

export function siteFactoryEntity(
    ref: DocumentReference,
    id: ID,
    domain: SiteDomain,
    seo: MetaSeo,
    locales: locales[],
): SiteEntity;

export function siteFactoryEntity(
    ref: DocumentReference,
    id: ID,
    domain: SiteDomain,
    seo: MetaSeo,
    locales: locales[],
    createdAt: Date,
    updatedAt: Date
): SiteEntity;

export function siteFactoryEntity(
    ref: DocumentReference,
    id: ID,
    domain: SiteDomain,
    seo: MetaSeo,
    locales: locales[],
    createdAt?: Date,
    updatedAt?: Date
): SiteEntity {
    return {
        ref,
        id,
        domain,
        seo,
        locales,
        createdAt: createdAt ?? new Date(),
        updatedAt: updatedAt ?? new Date()
    }
}