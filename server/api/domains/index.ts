// /server/api/getData.js
import { Domain } from '~/functions/src/shared';
import { db } from '../../firebase';
import { ApiResponse, DomainQuery, ErrorResponse } from '~/server/types';

export default defineEventHandler(async (event) => {
    const { domain } = getQuery(event) as DomainQuery;

    try {
        const snapshot = await db.collection('sites').doc(domain).get();
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
