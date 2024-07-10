// /server/api/getData.js
import { Domain } from '~/functions/src/shared';
import { db } from '../../firebase';
import { ApiResponse } from '~/functions/src/shared';
import { ErrorResponse } from '~/functions/src/shared';
import { DomainQuery } from '~/functions/src/shared';

export default defineEventHandler(async (event) => {
    const { name } = getQuery(event) as DomainQuery;

    try {
        const snapshot = await db.collection('sites').doc(name).get();
        const { title, description } = (snapshot.data() || {}) as Domain;

        return {
            status: 200,
            data: {
                title,
                description
            }
        } as ApiResponse<Domain>;
    } catch (error) {
        return {
            status: 500,
            data: {
                message: 'Error fetching domain data'
            }
        } as ApiResponse<ErrorResponse>
    }
});
