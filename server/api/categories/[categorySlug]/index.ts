// /server/api/getData.js
import { categoryFactory, getSiteByDomain, Category, CATEGORY_COLLECTION } from '~/functions/src/shared';
import { db } from '../../../firebase';
import { ApiResponse, DomainQuery, ErrorResponse, LocaleQuery } from '~/server/types';


export default defineEventHandler(async (event) => {
    const { categorySlug } = event.context.params as { categorySlug: string };
    const { domain, locale } = getQuery(event) as DomainQuery & LocaleQuery;

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

        const doc = await siteRef.ref.collection(CATEGORY_COLLECTION)
            .where(`slug.${locale}`, '==', categorySlug)
            .get();

        if (doc.empty) {
            return {
                status: 404,
                data: {
                    message: 'Category not found',
                },
            } as ApiResponse<ErrorResponse>;
        }

        const docData = doc.docs[0];

        const { title, description, slug } = docData!.data() as Category;

        const category: Category = categoryFactory(
            docData!.id,
            title,
            description,
            slug
        );

        return {
            status: 200,
            data: category,
        } as ApiResponse<Category>;
    } catch (error) {
        console.log(error);

        return {
            status: 500,
            data: {
                message: 'Error fetching category data',
            },
        } as ApiResponse<ErrorResponse>
    }
});
