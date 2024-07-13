/**
 * The status of a draft.
 * DRAFT: Le brouillon a été créé mais n'a pas encore été traité.
 * CATEGORY_SELECTED: La catégorie a été sélectionnée pour l'article.
 * ARTICLE_CREATED: Le brouillon a été traité et un article a été créé.
 * SEO_OPTIMIZED: L'article a été optimisé pour le SEO (titre, mots clés, description et extrait).
 * TRANSLATED: L'article a été traduit dans une autre langue.
 * READY_FOR_PUBLISHING: L'article est prêt à être publié (Déplacé dans la collection content).
 */
export type DraftStatus = 'DRAFT' | 'CATEGORY_SELECTED' | 'ARTICLE_CREATED' | 'SEO_OPTIMIZED' | 'TRANSLATED' | 'READY_FOR_PUBLISHING';

export type DraftId = string;

export type Draft = {
    siteId: string;
    content: string;
    status: DraftStatus;
    article?: string;
    title?: string;
    keywords?: string[];
    description?: string;
    summary?: string;
    categorySlug?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export function draftFactory(
    siteId: string,
    content: string
): Draft;
export function draftFactory(
    siteId: string,
    content: string,
    article: string
): Draft;
export function draftFactory(
    siteId: string,
    content: string,
    article: string,
    status: DraftStatus
): Draft;
export function draftFactory(
    siteId: string,
    content: string,
    article: string,
    title: string,
    keywords: string[],
    description: string,
    status: DraftStatus
): Draft;
export function draftFactory(
    siteId: string,
    content: string,
    article?: string,
    title?: string,
    keywords?: string[],
    description?: string,
    status?: DraftStatus,
    createdAt?: Date,
    updatedAt?: Date
): Draft {
    return {
        siteId,
        content,
        article,
        title,
        keywords,
        description,
        summary : '',
        status: status || 'DRAFT',
        createdAt: createdAt || new Date(),
        updatedAt: updatedAt || new Date()
    }
}