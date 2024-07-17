/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
 DocumentData, DocumentSnapshot, Firestore, QueryDocumentSnapshot, QuerySnapshot 
} from 'firebase-admin/firestore';
import {
 describe, it, expect, vi, beforeEach, type Mock 
} from 'vitest';

import {
 createSite, getSiteByDomain, getSiteById, initSite 
} from './site';
import {
 SITE_BUILDER_COLLECTION, SITE_COLLECTION 
} from './types';
import type {
 Config, SiteDomain, SiteId 
} from '../types';

describe(
    'site',
    () => {
        describe(
            'initSite',
            () => {
                let mockAdd: Mock<any, any>;
                let mockCollection: Mock<any, any>;
                let db: Firestore;

                beforeEach(
                    () => {
                        mockAdd = vi.fn().mockResolvedValue(
                            { id: '12345' }
                        );
                        mockCollection = vi.fn().mockReturnValue(
                            { add: mockAdd, }
                        );
                        db = { collection: mockCollection, } as unknown as Firestore;
                    }
                );

                it(
                    'Doit initialiser un site avec toutes les données',
                    async () => {
                        const config: Config = {
                            domain: 'http://localhost',
                            sitename: 'Test Site',
                            description: 'This is a test site',
                            keywords: ['test',
                                'site'],
                            locales: ['en',
                                'fr'],
                            categories: [
                                {
                                    id: 'cat1',
                                    name: 'Category 1'
                                }
                            ]
                        };

                        await initSite(
                            config,
                            db
                        );

                        expect(
                            mockCollection
                        ).toHaveBeenCalledWith(
                            SITE_BUILDER_COLLECTION
                        );
                        expect(
                            mockAdd
                        ).toHaveBeenCalledWith(
                            {
                                domain: 'localhost',
                                sitename: 'Test Site',
                                description: 'This is a test site',
                                locales: ['en',
                                    'fr'],
                                keywords: ['test',
                                    'site'],
                                categories: [
                                    {
                                        id: 'cat1',
                                        name: 'Category 1'
                                    }
                                ]
                            }
                        );
                    }
                );

                it(
                    'Doit initialiser un site sans les données optionnelles',
                    async () => {
                        const config: Config = {
                            domain: 'http://localhost',
                            sitename: 'Test Site',
                            description: 'This is a test site',
                            locales: ['en',
                                'fr'],
                        };

                        await initSite(
                            config,
                            db
                        );

                        expect(
                            mockCollection
                        ).toHaveBeenCalledWith(
                            SITE_BUILDER_COLLECTION
                        );
                        expect(
                            mockAdd
                        ).toHaveBeenCalledWith(
                            {
                                domain: 'localhost',
                                sitename: 'Test Site',
                                description: 'This is a test site',
                                locales: ['en',
                                    'fr'],
                                keywords: [],
                                categories: []
                            }
                        );
                    }
                );
            }
        );

        describe(
            'createSite',
            () => {
                it(
                    'Doit créer un site',
                    async () => {
                        const mockAdd = vi.fn().mockResolvedValue(
                            { id: '12345' }
                        );
                        const mockCollection = vi.fn().mockReturnValue(
                            { add: mockAdd, }
                        );

                        // Mock Firestore instance
                        const db = { collection: mockCollection, } as unknown as Firestore;

                        await createSite(
                            {
                                domain: 'http://localhost',
                                seo: {
                                    title: { fr: 'Test', },
                                    description: { fr: 'Test', },
                                    keywords: { fr: ['test'], },
                                },
                                locales: ['fr'],
                            },
                            db
                        );

                        // Assertions
                        expect(
                            mockCollection
                        ).toHaveBeenCalledWith(
                            SITE_COLLECTION
                        );
                        expect(
                            mockAdd
                        ).toHaveBeenCalledWith(
                            {
                                domain: 'http://localhost',
                                seo: {
                                    title: { fr: 'Test', },
                                    description: { fr: 'Test', },
                                    keywords: { fr: ['test'], },
                                },
                                locales: ['fr'],
                            }
                        );
                    }
                );
            }
        );

        describe(
            'getSiteById',
            () => {
                const siteId: SiteId = '12345';

                it(
                    'Doit retourner un site existant par son ID',
                    async () => {
                        const mockGet = vi.fn().mockResolvedValue(
{
    exists: true,
    data: () => ({
 id: '12345',
domain: 'localhost' 
})
} as unknown as DocumentSnapshot<DocumentData>
                        );
                        const mockDoc = vi.fn().mockReturnValue(
                            { get: mockGet, }
                        );
                        const mockCollection = vi.fn().mockReturnValue(
                            { doc: mockDoc, }
                        );

                        // Mock Firestore instance
                        const db = { collection: mockCollection, } as unknown as Firestore;

                        const result = await getSiteById(
                            siteId,
                            db
                        );

                        // Assertions
                        expect(
                            mockCollection
                        ).toHaveBeenCalledWith(
                            SITE_COLLECTION
                        );
                        expect(
                            mockDoc
                        ).toHaveBeenCalledWith(
                            siteId
                        );
                        expect(
                            mockGet
                        ).toHaveBeenCalled();
                        expect(
                            result
                        ).toEqual(
                            {
                                exists: true,
                                data: expect.any(
                                    Function
                                )
                            }
                        );
                    }
                );

                it(
                    'Doit retourner null si le site n\'existe pas',
                    async () => {
                        const mockGet = vi.fn().mockResolvedValue(
{ exists: false, } as unknown as DocumentSnapshot<DocumentData>
                        );
                        const mockDoc = vi.fn().mockReturnValue(
                            { get: mockGet, }
                        );
                        const mockCollection = vi.fn().mockReturnValue(
                            { doc: mockDoc, }
                        );

                        // Mock Firestore instance
                        const db = { collection: mockCollection, } as unknown as Firestore;

                        const result = await getSiteById(
                            siteId,
                            db
                        );

                        // Assertions
                        expect(
                            mockCollection
                        ).toHaveBeenCalledWith(
                            SITE_COLLECTION
                        );
                        expect(
                            mockDoc
                        ).toHaveBeenCalledWith(
                            siteId
                        );
                        expect(
                            mockGet
                        ).toHaveBeenCalled();
                        expect(
                            result
                        ).toBeNull();
                    }
                );
            }
        );

        describe(
            'getSiteByDomain',
            () => {
                const domain: SiteDomain = 'localhost';

                it(
                    'Doit retourner un site existant par son domaine',
                    async () => {
                        const mockDocs = [{
 id: '12345',
data: () => ({ domain: 'localhost' }) 
}] as unknown as QueryDocumentSnapshot[];
                        const mockGet = vi.fn().mockResolvedValue(
{
    empty: false,
    docs: mockDocs,
} as unknown as QuerySnapshot
                        );
                        const mockWhere = vi.fn().mockReturnValue(
                            {
                                limit: vi.fn().mockReturnValue(
                                    { get: mockGet, }
                                ),
                            }
                        );
                        const mockCollection = vi.fn().mockReturnValue(
                            { where: mockWhere, }
                        );

                        // Mock Firestore instance
                        const db = { collection: mockCollection, } as unknown as Firestore;

                        const result = await getSiteByDomain(
                            domain,
                            db
                        );

                        // Assertions
                        expect(
                            mockCollection
                        ).toHaveBeenCalledWith(
                            SITE_COLLECTION
                        );
                        expect(
                            mockWhere
                        ).toHaveBeenCalledWith(
                            'domain',
                            '==',
                            domain
                        );
                        expect(
                            mockGet
                        ).toHaveBeenCalled();
                        expect(
                            result
                        ).toEqual(
                            mockDocs[0]
                        );
                    }
                );

                it(
                    'Doit retourner null si aucun site n\'existe pour le domaine',
                    async () => {
                        const mockGet = vi.fn().mockResolvedValue(
{
    empty: true,
    docs: [],
} as unknown as QuerySnapshot
                        );
                        const mockWhere = vi.fn().mockReturnValue(
                            {
                                limit: vi.fn().mockReturnValue(
                                    { get: mockGet, }
                                ),
                            }
                        );
                        const mockCollection = vi.fn().mockReturnValue(
                            { where: mockWhere, }
                        );

                        // Mock Firestore instance
                        const db = { collection: mockCollection, } as unknown as Firestore;

                        const result = await getSiteByDomain(
                            domain,
                            db
                        );

                        // Assertions
                        expect(
                            mockCollection
                        ).toHaveBeenCalledWith(
                            SITE_COLLECTION
                        );
                        expect(
                            mockWhere
                        ).toHaveBeenCalledWith(
                            'domain',
                            '==',
                            domain
                        );
                        expect(
                            mockGet
                        ).toHaveBeenCalled();
                        expect(
                            result
                        ).toBeNull();
                    }
                );
            }
        );
    }
);
