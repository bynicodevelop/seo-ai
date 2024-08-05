import {
 describe, it, expect 
} from 'vitest';

import { cleanContentToString } from './extractor';

describe(
'cleanContentToString',
() => {
    it(
'should remove newlines and tabs',
() => {
        const input = 'This is a test.\nThis is only a test.\tPlease remain calm.';
        const expectedOutput = 'This is a test. This is only a test. Please remain calm.';
        expect(cleanContentToString(input)).toBe(expectedOutput);
    }
);

    it(
'should remove iframes',
() => {
        const input = 'Here is some content.<iframe src="http://example.com"></iframe> More content.';
        const expectedOutput = 'Here is some content. More content.';
        expect(cleanContentToString(input)).toBe(expectedOutput);
    }
);

    it(
'should replace multiple spaces with a single space',
() => {
        const input = 'This  is    a    test.';
        const expectedOutput = 'This is a test.';
        expect(cleanContentToString(input)).toBe(expectedOutput);
    }
);

    it(
'should handle a combination of cases',
() => {
        const input = '\tThis is\n some content.<iframe src="http://example.com"></iframe>  With  multiple \t spaces.\n';
        const expectedOutput = 'This is some content. With multiple spaces.';
        expect(cleanContentToString(input)).toBe(expectedOutput);
    }
);

    it(
'should handle empty input',
() => {
        const input = '';
        const expectedOutput = '';
        expect(cleanContentToString(input)).toBe(expectedOutput);
    }
);

    it(
'should handle input with only spaces and newlines',
() => {
        const input = '   \n \t  \n';
        const expectedOutput = '';
        expect(cleanContentToString(input)).toBe(expectedOutput);
    }
);
}
);