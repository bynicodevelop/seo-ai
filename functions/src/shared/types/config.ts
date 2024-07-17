import type { locales } from './i18n';

export type Config = {
    domain: string;
    sitename: string;
    description: string;
    locales: locales[];
    keywords?: string[];
    categories?: [{ [key: string]: string }];
};

export function configFactory(
    domain: string,
    sitename: string,
    description: string,
    locales: locales[]
): Config;
export function configFactory(
    domain: string,
    sitename: string,
    description: string,
    locales: locales[],
    keywords: string[],
    categories: [{ [key: string]: string }]
): Config;
export function configFactory(
    domain: string,
    sitename: string,
    description: string,
    locales: locales[],
    keywords?: string[],
    categories?: [{ [key: string]: string }]
): Config {
    return {
        domain,
        sitename,
        description,
        locales,
        keywords: keywords || [],
        categories: categories || [] as unknown as [{ [key: string]: string }]
    }
}