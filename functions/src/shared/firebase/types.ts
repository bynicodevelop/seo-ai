// Collection names
export const ARTICLE_COLLECTION = 'articles';
export const CATEGORY_COLLECTION = 'categories';
export const DRAFT_COLLECTION = 'drafts';
export const SITE_BUILDER_COLLECTION = 'site_builder';
export const SITE_COLLECTION = 'sites';

/**
 * The status of a draft.
 * DRAFT: Le brouillon a été créé mais n'a pas encore été traité.
 * CATEGORY_SELECTED: La catégorie a été sélectionnée pour l'article.
 * ARTICLE_CREATED: Le brouillon a été traité et un article a été créé.
 * SEO_OPTIMIZED: L'article a été optimisé pour le SEO (titre, mots clés, description et extrait).
 * TRANSLATED: L'article a été traduit dans une autre langue.
 * READY_FOR_PUBLISHING: L'article est prêt à être publié (Déplacé dans la collection content).
 */
export type DraftStatus = 'DRAFT' | 'CATEGORY_SELECTED' | 'ARTICLE_CREATED' | 'SEO_OPTIMIZED' | 'TRANSLATED' | 'READY_FOR_PUBLISHING' | 'ERROR_ARTICLE_NOT_COMPLETE';

// Draft statuses
export const DRAFT_STATUS = {
    DRAFTED: 'DRAFTED',
    CATEGORY_SELECTED: 'CATEGORY_SELECTED',
    ARTICLE_CREATED: 'ARTICLE_CREATED',
    SEO_OPTIMIZED: 'SEO_OPTIMIZED',
    READY_FOR_PUBLISHING: 'READY_FOR_PUBLISHING'
};

// Draft error statuses
export const DRAFT_ERROR_STATUS = {
    ERROR_CATEGORY_NOT_SELECTED: 'ERROR_CATEGORY_NOT_SELECTED',
    ERROR_ARTICLE_NOT_GENERATED: 'ERROR_ARTICLE_NOT_GENERATED',
    ERROR_ARTICLE_SEO_DETAILS_NOT_COMPLETE: 'ERROR_ARTICLE_SEO_DETAILS_NOT_COMPLETE',
    ERROR_TRANSLATION: 'ERROR_TRANSLATION',
    ERROR_ARTICLE_NOT_COMPLETE: 'ERROR_ARTICLE_NOT_COMPLETE',
};