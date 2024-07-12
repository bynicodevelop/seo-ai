// /server/api/getData.js
import { db } from '../../firebase';
import { Content, getSiteByDomain } from '~/functions/src/shared';
import { ApiResponse, CategoryQuery, DomainQuery, ErrorResponse } from '~/server/types';


export default defineEventHandler(async (event) => {
    const { name, categorySlug } = getQuery(event) as DomainQuery & CategoryQuery;

    try {
        const siteRef = await getSiteByDomain(name, db);

        if (!siteRef) {
            return {
                status: 404,
                data: {
                    message: 'Site not found'
                }
            } as ApiResponse<ErrorResponse>
        }

        const categorySnapshot = await siteRef.ref
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

        const contentsSnapshot = await categorySnapshot.docs[0]?.ref.collection('contents').get();

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
