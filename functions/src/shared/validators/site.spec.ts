import {
 describe, it, expect 
} from 'vitest';

import { createSiteServiceValidator } from './site';

describe(
'createSiteServiceValidator',
() => {
    it(
'should validate the data',
async () => {
        const data = {
            domain: 'https://example.com',
            sitename: 'Example',
            keywords: ['example', 'test'],
            description: 'This is an example site',
            locales: ['en', 'es'],
            categories: [
                { category: 'example' },
                { category: 'test' }
            ] as unknown as [{ [key: string]: string }]
        };

        await expect(createSiteServiceValidator(data)).resolves.toBeUndefined();
    }
);

    it(
'should throw an error if the domain is missing',
async () => {
        const data = {
            sitename: 'Example',
            keywords: ['example', 'test'],
            description: 'This is an example site',
            locales: ['en', 'es'],
            categories: [
                { category: 'example' },
                { category: 'test' }
            ] as unknown as [{ [key: string]: string }]
        };

        await expect(createSiteServiceValidator(data)).rejects.toThrow();
    }
);

    it(
'should throw an error if the sitename is missing',
async () => {
        const data = {
            domain: 'https://example.com',
            keywords: ['example', 'test'],
            description: 'This is an example site',
            locales: ['en', 'es'],
            categories: [
                { category: 'example' },
                { category: 'test' }
            ] as unknown as [{ [key: string]: string }]
        };

        await expect(createSiteServiceValidator(data)).rejects.toThrow();
    }
);

    it(
'should throw an error if the keywords are missing',
async () => {
        const data = {
            domain: 'https://example.com',
            sitename: 'Example',
            description: 'This is an example site',
            locales: ['en', 'es'],
            categories: [
                { category: 'example' },
                { category: 'test' }
            ] as unknown as [{ [key: string]: string }]
        };

        await expect(createSiteServiceValidator(data)).rejects.toThrow();
    }
);

    it(
'should throw an error if the description is missing',
async () => {
        const data = {
            domain: 'https://example.com',
            sitename: 'Example',
            keywords: ['example', 'test'],
            locales: ['en', 'es'],
            categories: [
                { category: 'example' },
                { category: 'test' }
            ] as unknown as [{ [key: string]: string }]
        };

        await expect(createSiteServiceValidator(data)).rejects.toThrow();
    }
);

    it(
'should validate if locales and categories are missing',
async () => {
        const data = {
            domain: 'https://example.com',
            sitename: 'Example',
            keywords: ['example', 'test'],
            description: 'This is an example site',
        };

        await expect(createSiteServiceValidator(data)).resolves.toBeUndefined();
    }
);

    it(
'should validate if a category is missing the category key',
async () => {
        const data = {
            domain: 'https://example.com',
            sitename: 'Example',
            keywords: ['example', 'test'],
            description: 'This is an example site',
            locales: ['en', 'es'],
            categories: [
                { category: 'example' },
                { missingKey: 'test' }
            ] as unknown as [{ [key: string]: string }]
        };

        await expect(createSiteServiceValidator(data)).resolves.toBeUndefined();
    }
);
}
);