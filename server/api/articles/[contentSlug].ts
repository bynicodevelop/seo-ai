// /server/api/getData.js
import { ApiResponse, CategoryQuery, DomainQuery, ErrorResponse, LocaleQuery } from '~/server/types';
import { Article, articleFactory, getSiteByDomain, ARTICLE_COLLECTION, CATEGORY_COLLECTION } from '~/functions/src/shared';
import { db } from '../../firebase';


export default defineEventHandler(async (event) => {
    const { contentSlug } = event.context.params as { contentSlug: string };
    const { domain, categorySlug, locale } = getQuery(event) as DomainQuery & CategoryQuery & LocaleQuery;

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
        const categorySnapshot = await siteRef.ref
            .collection(CATEGORY_COLLECTION)
            .where(`slug.${locale}`, '==', categorySlug)
            .get();

        if (categorySnapshot.empty) {
            return {
                status: 404,
                data: {
                    message: 'Category not found',
                },
            } as ApiResponse<ErrorResponse>;
        }

        const contentSnapshot = await categorySnapshot.docs[0]?.ref
            .collection(ARTICLE_COLLECTION)
            .where(`slug.${locale}`, '==', contentSlug)
            .get();

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
        const { title, keywords, slug, article, description, createdAt, updatedAt } = data.data();

        const contentData = articleFactory(
            title,
            keywords,
            description,
            article,
            description,
            slug,
            createdAt,
            updatedAt
        );

        return {
            status: 200,
            data: contentData,
        } as ApiResponse<Article>;
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
