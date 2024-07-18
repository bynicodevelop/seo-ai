import type { DocumentReference } from 'firebase-admin/firestore';

import type {
 IdType, Reference 
} from './common';
import type { I18n } from './i18n';

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

export type ArticleEntity = Article & Reference & IdType;

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

export function articleFactoryEntity(
    ref: DocumentReference,
    id: string,
    title: I18n,
    keywords: I18n,
    description: I18n,
    article: I18n,
    summary: I18n,
    slug: I18n
): ArticleEntity;

export function articleFactoryEntity(
    ref: DocumentReference,
    id: string,
    title: I18n,
    keywords: I18n,
    description: I18n,
    article: I18n,
    summary: I18n,
    slug: I18n,
    createdAt: Date,
    updatedAt: Date
): ArticleEntity;

export function articleFactoryEntity(
    ref: DocumentReference,
    id: string,
    title: I18n,
    keywords: I18n,
    description: I18n,
    article: I18n,
    summary: I18n,
    slug: I18n,
    createdAt?: Date,
    updatedAt?: Date
): ArticleEntity {
    return {
        ref,
        id,
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