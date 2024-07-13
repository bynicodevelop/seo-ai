import { createDraft } from "~/functions/src/shared";
import { db } from "../../../firebase";
import { ArticleQuery } from "~/server/types";

export default defineEventHandler(async (event) => {
    const method = event.method;
    const body = await readBody(event) as ArticleQuery;

    if (method !== 'POST') {
        return {
            status: 405,
            body: 'Method Not Allowed'
        }
    }

    if (!body.siteId || !body.content) {
        return {
            status: 400,
            body: 'Bad Request'
        }
    }

    await createDraft(
        body.siteId,
        body.content, 
        db
    );

    return {
        status: 201,
        body: 'Created'
    }
});