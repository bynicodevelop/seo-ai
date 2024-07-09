// /server/api/getData.js
import { db } from '../../config/firebase';
import { ApiResponse } from '~/shared/types/api-response';
import { Category } from '~/shared/types/category';
import { ErrorResponse } from '~/shared/types/error';
import { DomainQuery } from '~/shared/types/queries';


export default defineEventHandler(async (event) => {
    const { name } = getQuery(event) as DomainQuery;

    try {
        const snapshot = await db.collection('domains').doc(name).collection('categories').get();

        const categories: Category[] = snapshot.docs.map((doc) => {
            const { name, slug, seo, description, createdAt, updatedAt } = doc.data() as Category;
            return {
                id: doc.id,
                name,
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
