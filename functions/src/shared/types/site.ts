import type { MetaSeo } from "./meta-seo";

export type Site = {
    domain: string;
    seo: MetaSeo;
    createdAt?: Date;
    updatedAt?: Date;
}

export function siteFactory(
    domain: string,
    seo: MetaSeo
): Site;
export function siteFactory (
    domain: string,
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