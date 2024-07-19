import { db } from '../../firebase';
import type {
 Article, Category 
} from '~/functions/src/shared';
import {
 getSiteByDomain, getLatestArticles 
} from '~/functions/src/shared';
import type {
 ApiResponse, DomainQuery, ErrorResponse, LimitQuery 
} from '~/server/types';

export default defineEventHandler(async (event) => {
    const {
 domain, limit 
} = getQuery(event) as DomainQuery & LimitQuery;

    try {
        const siteRef = await getSiteByDomain(
            domain,
            db
        );

        if (!siteRef) {
            return {
                status: 404,
                data: { message: 'Site not found' }
            } as ApiResponse<ErrorResponse>
        }

        const contents = await getLatestArticles(
siteRef,
+limit,
db
);
        
        return {
            status: 200,
            data: contents,
        } as ApiResponse<{
            article: Article,
            category: Category
        }[]>;

    } catch (error) {
        console.log(error);

        return {
            status: 500,
            data: { message: 'Error fetching categories data', },
        } as ApiResponse<ErrorResponse>
    }
});
