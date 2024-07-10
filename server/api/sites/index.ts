// /server/api/getData.js
import { db } from '../../firebase';
import { Site, siteFactory,  } from '~/functions/src/shared';
import { DomainQuery, ApiResponse, ErrorResponse } from '~/server/types';

export default defineEventHandler(async (event) => {
    const { name } = getQuery(event) as DomainQuery;

    try {
        const snapshot = await db.collection('sites').doc(name).get();
        const { domain, seo } = (snapshot.data() || {}) as Site;

        return {
            status: 200,
            data: siteFactory(
                domain,
                seo
            )
        } as ApiResponse<Site>;
    } catch (error) {
        return {
            status: 500,
            data: {
                message: 'Error fetching domain data'
            }
        } as ApiResponse<ErrorResponse>
    }
});
