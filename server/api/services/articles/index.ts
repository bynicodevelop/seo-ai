import { db } from '../../../firebase';
import {
 createArticleServiceValidator, createDraft 
} from '~/functions/src/shared';
import type { ArticleQuery } from '~/server/types';

export default defineEventHandler(async event => {
    const method = event.method;
    const body = await readBody(event) as ArticleQuery;

    if (method !== 'POST') {
        return {
            status: 405,
            body: 'Method Not Allowed'
        }
    }

    try {
        await createArticleServiceValidator(body);
    } catch (error) {
        return {
            status: 400,
            body: 'Request body is not valid'
        }
    }

    await createDraft(
        body.domain,
        body.resume,
        db
    );

    return {
        status: 201,
        body: 'Created'
    }
});