import type { MetaSeo } from "./meta-seo";

export type SiteId = string;
export type SiteDomain = string;

export type Site = {
    domain: SiteDomain;
    seo: MetaSeo;
    createdAt?: Date;
    updatedAt?: Date;
}

export function siteFactory(
    id: SiteDomain,
    seo: MetaSeo
): Site;
export function siteFactory(
    domain: SiteDomain,
    seo: MetaSeo,
    createdAt?: Date,
    updatedAt?: Date
): Site {
    return {
        domain,
        seo,
        createdAt: createdAt ?? new Date(),
        updatedAt: updatedAt ?? new Date()
    }
}