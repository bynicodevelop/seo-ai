import {
 describe, it, expect 
} from 'vitest';

import { formatingSlug } from './slug';

describe(
'formatingSlug',
() => {
    it(
'should return a slugified string',
() => {
        const slug = {
            en: 'Hello World',
            fr: 'Bonjour le monde'
        };

        const result = formatingSlug(slug);

        expect(result).toEqual({
            en: 'hello-world',
            fr: 'bonjour-le-monde'
        });
    }
)

    it(
'should return a slugified string with special characters',
() => {
        const slug = {
            en: 'Hello World!',
            fr: 'Bonjour le monde!'
        };

        const result = formatingSlug(slug);

        expect(result).toEqual({
            en: 'hello-world',
            fr: 'bonjour-le-monde'
        });
    }
);

    it(
'should return a slugified string with empty characters',
() => {
        const slug = {
            en: '',
            fr: ''
        };

        const result = formatingSlug(slug);

        expect(result).toEqual({
            en: '',
            fr: ''
        });
    }
);
}
);