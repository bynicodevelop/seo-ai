// /server/api/getData.js
import { ApiResponse, CategoryQuery, DomainQuery, ErrorResponse, LocaleQuery } from '~/server/types';
import { Article, articleFactory, getSiteByDomain, ARTICLE_COLLECTION, CATEGORY_COLLECTION } from '~/functions/src/shared';
import { DocumentData } from 'firebase-admin/firestore';
import { db } from '~/server/firebase';

export default defineEventHandler(async (event) => {
    const { categorySlug } = event.context.params as CategoryQuery;
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

        const contentsSnapshot = await categorySnapshot.docs[0]?.ref.collection(ARTICLE_COLLECTION).get();

        if (contentsSnapshot?.empty) {
            return {
                status: 404,
                data: {
                    message: 'Contents not found',
                },
            } as ApiResponse<ErrorResponse>;
        }


        const contents: Article[] = (contentsSnapshot?.docs ?? []).map((doc: DocumentData) => {
            const { title, keywords, slug, article, description, createdAt, updatedAt } = doc.data();

            return articleFactory(
                title,
                keywords,
                description,
                article,
                description,
                slug,
                createdAt,
                updatedAt
            );
        })

        return {
            status: 200,
            data: contents,
        } as ApiResponse<Article[]>;

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
