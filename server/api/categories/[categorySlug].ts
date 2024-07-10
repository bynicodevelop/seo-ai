// /server/api/getData.js
import { ErrorResponse } from '~/shared/types/error';
import { db } from '../../firebase';
import { DomainQuery } from '~/shared/types/queries';
import { ApiResponse } from '~/shared/types/api-response';
import { Category } from '~/shared/types/category';
import first from 'lodash/first';


export default defineEventHandler(async (event) => {
    const { categorySlug } = event.context.params as { categorySlug: string };
    const { name } = getQuery(event) as DomainQuery;

    try {
        const doc = await db.collection('sites').doc(name).collection('categories')
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

        const { title, seo, description, createdAt, updatedAt } = first(doc.docs)!.data() as Category;

        const category: Category = {
            id: first(doc.docs)!.id,
            title,
            slug: categorySlug,
            seo,
            description,
            createdAt,
            updatedAt,
        };

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
