import type { Article } from './article';
import type { DraftStatus } from '../firebase';

export type DraftId = string;

export type Draft = {
    draftId: DraftId;
    content: string;
    article: string;
    title: string;
    keywords: string[];
    description: string;
    summary: string;
    slug: string;
    categoryId: string;
    publishableArticle: Article;
    status: DraftStatus;
    createdAt: Date;
    updatedAt: Date;
}

export function draftFactory(
    draftId: DraftId,
    content: string,
    article: string,
    title: string,
    keywords: string[],
    description: string,
    summary: string,
    slug: string,
    categoryId: string,
    publishableArticle: Article,
    status: DraftStatus,
    createdAt?: Date,
    updatedAt?: Date
): Draft {
    return {
        draftId,
        content,
        article,
        title,
        keywords,
        description,
        summary,
        slug,
        categoryId,
        publishableArticle,
        status,
        createdAt: createdAt || new Date(),
        updatedAt: updatedAt || new Date()
    }
}