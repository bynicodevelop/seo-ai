import {
 describe, it, expect 
} from 'vitest';

import { validateCategoryId } from './category';

describe(
'validateCategoryId',
() => {
    it(
'should validate a correct category object',
async () => {
        const category = { id: '12345' };
        await expect(validateCategoryId(category)).resolves.toBeUndefined();
    }
);

    it(
'should fail validation if id is missing',
async () => {
        const category = { id: '' };
        await expect(validateCategoryId(category)).rejects.toThrow();
    }
);

    it(
'should fail validation if category is missing',
async () => {
        const category = undefined;
        await expect(validateCategoryId(category)).rejects.toThrow();
    }
);
}
);