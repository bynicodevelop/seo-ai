// /server/api/getData.js
import { db } from '../../firebase';
import { ApiResponse } from '~/functions/src/shared';
import { Category } from '~/functions/src/shared';
import { ErrorResponse } from '~/functions/src/shared';
import { DomainQuery } from '~/functions/src/shared';


export default defineEventHandler(async (event) => {
    const { name } = getQuery(event) as DomainQuery;

    try {
        const snapshot = await db.collection('sites').doc(name).collection('categories').get();

        const categories: Category[] = snapshot.docs.map((doc) => {
            const { title, slug, seo, description, createdAt, updatedAt } = doc.data() as Category;
            return {
                id: doc.id,
                title,
                slug,
                seo,
                description,
                createdAt,
                updatedAt
            };
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
