// /server/api/getData.js
import { ApiResponse, DomainQuery, ErrorResponse } from '~/server/types';
import { getSiteByDomain, Site, siteFactory } from '~/functions/src/shared';
import { db } from '../../firebase';

export default defineEventHandler(async (event) => {
    const { domain } = getQuery(event) as DomainQuery;

    try {
        const siteRef = await getSiteByDomain(domain, db);

        if (siteRef === null) {
            return {
                status: 404,
                data: {
                    message: 'Site not found'
                }
            } as ApiResponse<ErrorResponse>
        }

        const site = siteRef.data() as Site;

        return {
            status: 200,
            data: siteFactory(
                site.domain,
                site.seo,
                site.locales
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
