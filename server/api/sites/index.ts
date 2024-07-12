// /server/api/getData.js
import { db } from '../../firebase';
import { getSite, Site, siteFactory, } from '~/functions/src/shared';
import { DomainQuery, ApiResponse, ErrorResponse } from '~/server/types';

export default defineEventHandler(async (event) => {
    const { name } = getQuery(event) as DomainQuery;

    try {
        const siteRef = await getSite(name, db);

        if (siteRef === null) {
            return {
                status: 404,
                data: {
                    message: 'Site not found'
                }
            } as ApiResponse<ErrorResponse>
        }

        const { domain, seo } = siteRef.data() as Site;

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
