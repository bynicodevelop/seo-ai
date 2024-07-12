import { createDraft, draftFactory } from "~/functions/src/shared";
import { db } from "../../../firebase";

export default defineEventHandler(async (event) => {
    const method = event.method;
    const body = await readBody(event);

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

    await createDraft(draftFactory(
        body.siteId,
        body.content
    ), db);

    return {
        status: 201,
        body: 'Created'
    }
});