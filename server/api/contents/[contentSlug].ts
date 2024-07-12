// /server/api/getData.js
import { db } from '../../firebase';
import { Content, getSite } from '~/functions/src/shared';
import { ApiResponse, CategoryQuery, DomainQuery, ErrorResponse } from '~/server/types';


export default defineEventHandler(async (event) => {
    const { contentSlug } = event.context.params as { contentSlug: string };
    const { name, categorySlug } = getQuery(event) as DomainQuery & CategoryQuery;

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

        const contentSnapshot = await siteRef.ref
            .collection('categories')
            .doc(categorySlug)
            .collection('contents')
            .where('slug', '==', contentSlug)
            .get() as any;

        if (contentSnapshot.empty) {
            return {
                status: 404,
                data: {
                    message: 'Content not found',
                },
            } as ApiResponse<ErrorResponse>;
        }

        if (contentSnapshot.empty) {
            return {
                status: 500,
                data: {
                    message: 'Multiple contents found',
                },
            } as ApiResponse<ErrorResponse>;
        }

        const data = contentSnapshot.docs[0] ?? {} as any;
        const { title, slug, excerpt, seo, content, createdAt, updatedAt, publishedAt } = data.data();

        const contentData: Content = {
            id: data.id,
            slug,
            title,
            seo: {
                title: seo.title,
                description: seo.description,
            },
            category: categorySlug,
            excerpt,
            content,
            createdAt,
            updatedAt,
            publishedAt,
        } as Content;

        return {
            status: 200,
            data: contentData,
        } as ApiResponse<Content>;
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
