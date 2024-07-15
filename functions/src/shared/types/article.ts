import { I18n } from "./i18n";

export type Article = {
    title: I18n;
    keywords: I18n;
    description: I18n;
    article: I18n;
    summary: I18n;
    slug: I18n;
    createdAt?: Date;
    updatedAt?: Date;
}

export function articleFactory(
    title: I18n,
    keywords: I18n,
    description: I18n,
    article: I18n,
    summary: I18n,
    slug: I18n
): Article;

export function articleFactory(
    title: I18n,
    keywords: I18n,
    description: I18n,
    article: I18n,
    summary: I18n,
    slug: I18n,
    createdAt: Date,
    updatedAt: Date
): Article;

export function articleFactory(
    title: I18n,
    keywords: I18n,
    description: I18n,
    article: I18n,
    summary: I18n,
    slug: I18n,
    createdAt?: Date,
    updatedAt?: Date
): Article {
    return {
        title,
        keywords,
        description,
        article,
        summary,
        slug,
        createdAt: createdAt ?? new Date(),
        updatedAt: updatedAt ?? new Date()
    }
}