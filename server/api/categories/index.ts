// /server/api/getData.js
import { ApiResponse, DomainQuery, ErrorResponse } from '~/server/types';
import { db } from '../../firebase';
import { Category, categoryFactory, getSiteByDomain } from '~/functions/src/shared';

export default defineEventHandler(async (event) => {
    const { domain } = getQuery(event) as DomainQuery;

    try {
        const siteRef = await getSiteByDomain(domain, db);

        if (!siteRef) {
            return {
                status: 404,
                data: {
                    message: 'Site not found'
                }
            } as ApiResponse<ErrorResponse>
        }

        const snapshot = await siteRef.ref.collection('categories').get();

        const categories: Category[] = snapshot.docs.map((doc: any) => {
            const { title, slug, description } = doc.data() as Category;
            return categoryFactory(
                doc.id,
                title,
                description,
                slug
            );
        });

        return {
            status: 200,
            data: categories
        } as ApiResponse<Category[]>;
    } catch (error) {
        console.log(error);

        return {
            status: 500,
            data: {
                message: 'Error fetching categories data',
            },
        } as ApiResponse<ErrorResponse>
    }
});
