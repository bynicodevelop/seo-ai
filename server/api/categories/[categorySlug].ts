// /server/api/getData.js
import { categoryFactory, getSite } from '~/functions/src/shared';
import { db } from '../../firebase';
import { Category } from '~/functions/src/shared';
import { ApiResponse, DomainQuery, ErrorResponse } from '~/server/types';


export default defineEventHandler(async (event) => {
    const { categorySlug } = event.context.params as { categorySlug: string };
    const { name } = getQuery(event) as DomainQuery;

    try {
        const siteRef = await getSite(name, db);

        if (!siteRef) {
            return {
                status: 404,
                data: {
                    message: 'Site not found'
                }
            } as ApiResponse<ErrorResponse>
        }

        const doc = await siteRef.ref.collection('categories')
            .where('slug', '==', categorySlug)
            .get();

        if (doc.empty) {
            return {
                status: 404,
                data: {
                    message: 'Category not found',
                },
            } as ApiResponse<ErrorResponse>;
        }

        const { title, description, createdAt, updatedAt } = doc.docs[0]!.data() as Category;

        const category: Category = categoryFactory(
            title,
            description,
            categorySlug
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
