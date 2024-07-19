/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    DocumentData, Firestore
} from 'firebase-admin/firestore';
import {
    describe, it, expect, beforeEach, vi
} from 'vitest';

import { createArticleToCategory } from './article';
import { getSiteById } from './site';
import { ARTICLE_COLLECTION } from './types';
import type {
    Article, SiteEntity
} from '../types';

vi.mock(
    './site',
    async (importOriginal) => {
        const original = await importOriginal<typeof import('./site')>();
        return {
            ...original,
            getSiteById: vi.fn()
        };
    }
);

describe(
    'article',
    () => {
        describe(
            'createArticleToCategory',
            () => {
                let mockAdd: any;
                let mockCollection: any;
                let mockDoc: any;
                let mockSiteCollection: any;
                let mockSiteDoc: any;
                let db: Firestore;

                beforeEach(() => {
                    mockAdd = vi.fn().mockResolvedValue({ id: 'articleId' });
                    mockCollection = vi.fn().mockReturnValue({ add: mockAdd });
                    mockDoc = vi.fn().mockReturnValue({ collection: mockCollection });
                    mockSiteCollection = vi.fn().mockReturnValue({ doc: mockDoc });
                    mockSiteDoc = { collection: mockSiteCollection };
                    db = { collection: vi.fn().mockReturnValue(mockSiteCollection) } as unknown as Firestore;

                    vi.clearAllMocks();
                });

                it(
                    'should create article in category for existing site by ID',
                    async () => {
                        const siteId = 'siteId';
                        const categoryId = 'categoryId';
                        const article: Article = {
                            title: {
                                fr: 'Article Title',
                                en: 'Article Title'
                            },
                            keywords: {
                                fr: ['test', 'article'],
                                en: ['test', 'article']
                            },
                            description: {
                                fr: 'This is a test article',
                                en: 'This is a test article'
                            },
                            article: {
                                fr: 'This is the content of the test article.',
                                en: 'This is the content of the test article.'
                            },
                            summary: {
                                fr: 'This is the summary of the test article.',
                                en: 'This is the summary of the test article.'
                            },
                            slug: {
                                fr: 'test-article',
                                en: 'test-article'
                            }
                        };

                        const getSiteByIdSpy = vi.mocked(getSiteById).mockResolvedValue({ ref: mockSiteDoc } as SiteEntity);

                        await createArticleToCategory(
                            article,
                            categoryId,
                            siteId,
                            db
                        );

                        expect(getSiteByIdSpy).toHaveBeenCalledWith(
                            siteId,
                            db
                        );
                        expect(mockDoc).toHaveBeenCalledWith(categoryId);
                        expect(mockCollection).toHaveBeenCalledWith(ARTICLE_COLLECTION);
                        expect(mockAdd).toHaveBeenCalledWith(article);
                    }
                );

                it(
                    'should create article in category for existing site by DocumentData',
                    async () => {
                        const site = { ref: mockSiteDoc } as DocumentData;
                        const categoryId = 'categoryId';
                        const article: Article = {
                            title: {
                                fr: 'Article Title',
                                en: 'Article Title'
                            },
                            keywords: {
                                fr: ['test', 'article'],
                                en: ['test', 'article']
                            },
                            description: {
                                fr: 'This is a test article',
                                en: 'This is a test article'
                            },
                            article: {
                                fr: 'This is the content of the test article.',
                                en: 'This is the content of the test article.'
                            },
                            summary: {
                                fr: 'This is the summary of the test article.',
                                en: 'This is the summary of the test article.'
                            },
                            slug: {
                                fr: 'test-article',
                                en: 'test-article'
                            }
                        };

                        await createArticleToCategory(
                            article,
                            categoryId,
                            site,
                            db
                        );

                        expect(getSiteById).not.toHaveBeenCalled();
                        expect(mockDoc).toHaveBeenCalledWith(categoryId);
                        expect(mockCollection).toHaveBeenCalledWith(ARTICLE_COLLECTION);
                        expect(mockAdd).toHaveBeenCalledWith(article);
                    }
                );

                it(
                    'should throw an error if site is not found',
                    async () => {
                        const siteId = 'siteId';
                        const categoryId = 'categoryId';
                        const article: Article = {
                            title: {
                                fr: 'Article Title',
                                en: 'Article Title'
                            },
                            keywords: {
                                fr: ['test', 'article'],
                                en: ['test', 'article']
                            },
                            description: {
                                fr: 'This is a test article',
                                en: 'This is a test article'
                            },
                            article: {
                                fr: 'This is the content of the test article.',
                                en: 'This is the content of the test article.'
                            },
                            summary: {
                                fr: 'This is the summary of the test article.',
                                en: 'This is the summary of the test article.'
                            },
                            slug: {
                                fr: 'test-article',
                                en: 'test-article'
                            }
                        };

                        const getSiteByIdSpy = vi.mocked(getSiteById).mockResolvedValue(null);

                        await expect(createArticleToCategory(
                            article,
                            categoryId,
                            siteId,
                            db
                        )).rejects.toThrow('Site not found');

                        expect(getSiteByIdSpy).toHaveBeenCalledWith(
                            siteId,
                            db
                        );
                        expect(mockDoc).not.toHaveBeenCalled();
                        expect(mockCollection).not.toHaveBeenCalled();
                        expect(mockAdd).not.toHaveBeenCalled();
                    }
                );

                it(
                    'should throw an error if there is an issue adding the article',
                    async () => {
                        const site = { ref: mockSiteDoc } as DocumentData;
                        const categoryId = 'categoryId';
                        const article: Article = {
                            title: {
                                fr: 'Article Title',
                                en: 'Article Title'
                            },
                            keywords: {
                                fr: ['test', 'article'],
                                en: ['test', 'article']
                            },
                            description: {
                                fr: 'This is a test article',
                                en: 'This is a test article'
                            },
                            article: {
                                fr: 'This is the content of the test article.',
                                en: 'This is the content of the test article.'
                            },
                            summary: {
                                fr: 'This is the summary of the test article.',
                                en: 'This is the summary of the test article.'
                            },
                            slug: {
                                fr: 'test-article',
                                en: 'test-article'
                            }
                        };

                        mockAdd.mockRejectedValue(new Error('Add article failed'));

                        await expect(createArticleToCategory(
                            article,
                            categoryId,
                            site,
                            db
                        )).rejects.toThrow('Add article failed');

                        expect(mockDoc).toHaveBeenCalledWith(categoryId);
                        expect(mockCollection).toHaveBeenCalledWith(ARTICLE_COLLECTION);
                        expect(mockAdd).toHaveBeenCalledWith(article);
                    }
                );
            }
        );
    }
);