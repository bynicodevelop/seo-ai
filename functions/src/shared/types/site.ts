import { locales } from "./i18n";
import type { MetaSeo } from "./meta-seo";

export type SiteId = string;
export type SiteDomain = string;

export type Site = {
    domain: SiteDomain;
    seo: MetaSeo;
    locales: locales[];
    createdAt?: Date;
    updatedAt?: Date;
}

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