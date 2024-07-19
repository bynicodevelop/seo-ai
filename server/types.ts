import type { locales } from '~/functions/src/shared';

export type DomainQuery = {
    domain: string;
}

export type LocaleQuery = {
    locale: locales;
}

export type LimitQuery = {
    limit: string;
}

export type ApiResponse<T> = {
    status: number;
    data: T;
}

export type ErrorResponse = {
    message: string;
}

export type CategoryQuery = {
    categorySlug: string;
}

export type ArticleQuery = {
    siteId: string;
    content: string;
}