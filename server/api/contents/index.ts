// /server/api/getData.js
import first from 'lodash/first';
import { db } from '../../firebase';
import { ApiResponse } from '~/functions/src/shared';
import { ErrorResponse } from '~/functions/src/shared';
import { CategoryQuery, DomainQuery } from '~/functions/src/shared';
import { Content } from '~/functions/src/shared';


export default defineEventHandler(async (event) => {
    const { name, categorySlug } = getQuery(event) as DomainQuery & CategoryQuery;

    try {
        const categorySnapshot = await db.collection('sites')
            .doc(name)
            .collection('categories')
            .where('slug', '==', categorySlug)
            .get();

        if (categorySnapshot.empty) {
            return {
                status: 404,
                data: {
                    message: 'Category not found',
                },
            } as ApiResponse<ErrorResponse>;
        }


        const contentsSnapshot = await first(categorySnapshot.docs)?.ref.collection('contents').get();

        if (contentsSnapshot?.empty) {
            return {
                status: 404,
                data: {
                    message: 'Contents not found',
                },
            } as ApiResponse<ErrorResponse>;
        }

        const contents: Content[] = (contentsSnapshot?.docs ?? []).map((doc: any) => {
            const { title, slug, excerpt, content, createdAt, updatedAt, publishedAt } = doc.data();
            return {
                id: doc.id,
                slug,
                title,
                seo: {
                    title,
                    description: excerpt,
                },
                category: categorySlug,
                excerpt,
                content,
                createdAt,
                updatedAt,
                publishedAt,
            } as Content;
        })

        return {
            status: 200,
            data: contents,
        } as ApiResponse<Content[]>;

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
