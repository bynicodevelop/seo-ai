import { createData } from '~/functions/src/shared';
import { db } from '~/server/firebase';

export default defineEventHandler(async (event) => {
    const {
        urls, command, domain, convertToArticle = false
    } = await readBody(event) as { urls: string[], domain: string, command?: string, convertToArticle: boolean };

    const data: { urls: string[], domain: string, command?: string, convertToArticle: boolean } = {
        urls,
        domain,
        convertToArticle
    };

    if (command) {
        data.command = command;
    }

    await createData(
        data,
        db
    );

    return {
        status: 200,
        data: { message: 'Extracted data', },
    }
});