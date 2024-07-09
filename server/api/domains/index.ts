// /server/api/getData.js
import { Domain } from '~/shared/types/domain';
import { db } from '../../config/firebase';
import { ApiResponse } from '~/shared/types/api-response';
import { ErrorResponse } from '~/shared/types/error';
import { DomainQuery } from '~/shared/types/queries';

export default defineEventHandler(async (event) => {
    const { name } = getQuery(event) as DomainQuery;

    try {
        const snapshot = await db.collection('domains').doc(name).get();
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
