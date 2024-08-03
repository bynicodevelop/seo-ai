import { createData } from '~/functions/src/shared';
import { db } from '~/server/firebase';

export default defineEventHandler(async (event) => {
    const { urls, } = await readBody(event) as { urls: string[] };

    await createData(
{ urls, },
db
);

    return {
        status: 200,
        data: { message: 'Extracted data', },
    }
});