import {
 describe, it, expect 
} from 'vitest';

import { validateArticleSeoDetails } from './seo';

describe(
'validateArticleSeoDetails',
() => {
    it(
'should validate a correct details object',
async () => {
        const details = {
            description: 'This is a description',
            keywords: ['keyword1', 'keyword2'],
            slug: 'this-is-a-slug',
            summary: 'This is a summary',
            title: 'This is a title'
        };

        await expect(validateArticleSeoDetails(details)).resolves.toBeUndefined();
    }
);

    it(
'should fail validation if description is missing',
async () => {
        const details = {
            keywords: ['keyword1', 'keyword2'],
            slug: 'this-is-a-slug',
            summary: 'This is a summary',
            title: 'This is a title'
        };

        await expect(validateArticleSeoDetails(details)).rejects.toThrow();
    }
);

    it(
'should fail validation if keywords are missing',
async () => {
        const details = {
            description: 'This is a description',
            slug: 'this-is-a-slug',
            summary: 'This is a summary',
            title: 'This is a title'
        };

        await expect(validateArticleSeoDetails(details)).rejects.toThrow();
    }
);

    it(
'should fail validation if slug is missing',
async () => {
        const details = {
            description: 'This is a description',
            keywords: ['keyword1', 'keyword2'],
            summary: 'This is a summary',
            title: 'This is a title'
        };

        await expect(validateArticleSeoDetails(details)).rejects.toThrow();
    }
);

    it(
'should fail validation if summary is missing',
async () => {
        const details = {
            description: 'This is a description',
            keywords: ['keyword1', 'keyword2'],
            slug: 'this-is-a-slug',
            title: 'This is a title'
        };

        await expect(validateArticleSeoDetails(details)).rejects.toThrow();
    }
);

    it(
'should fail validation if title is missing',
async () => {
        const details = {
            description: 'This is a description',
            keywords: ['keyword1', 'keyword2'],
            slug: 'this-is-a-slug',
            summary: 'This is a summary'
        };

        await expect(validateArticleSeoDetails(details)).rejects.toThrow();
    }
);

    it(
'should fail validation if keywords contain an empty string',
async () => {
        const details = {
            description: 'This is a description',
            keywords: ['keyword1', ''],
            slug: 'this-is-a-slug',
            summary: 'This is a summary',
            title: 'This is a title'
        };

        await expect(validateArticleSeoDetails(details)).rejects.toThrow();
    }
);

    it(
'should fail validation if keywords is an empty array',
async () => {
        const details = {
            description: 'This is a description',
            keywords: [],
            slug: 'this-is-a-slug',
            summary: 'This is a summary',
            title: 'This is a title'
        };

        await expect(validateArticleSeoDetails(details)).rejects.toThrow();
    }
);
}
);