// /server/api/getData.js
import { db } from '../../firebase';
import type { Article } from '~/functions/src/shared';
import {
    articleFactory, getSiteByDomain, getCategoryBySlug, getArticleBySlug
} from '~/functions/src/shared';
import type {
    ApiResponse, CategoryQuery, DomainQuery, ErrorResponse, LocaleQuery
} from '~/server/types';

export default defineEventHandler(
    async event => {
        const { contentSlug } = event.context.params as { contentSlug: string };
        const {
            domain, categorySlug, locale
        } = getQuery(
            event
        ) as DomainQuery & CategoryQuery & LocaleQuery;

        try {
            const siteRef = await getSiteByDomain(
                domain,
                db
            );

            if (!siteRef) {
                return {
                    status: 404,
                    data: { message: 'Site not found' }
                } as ApiResponse<ErrorResponse>
            }

            const categoryEntity = await getCategoryBySlug(
                siteRef,
                categorySlug,
                locale,
                db
            );

            if (categoryEntity === null) {
                return {
                    status: 404,
                    data: { message: 'Category not found', },
                } as ApiResponse<ErrorResponse>;
            }

            const contentSnapshot = await getArticleBySlug(
                categoryEntity,
                contentSlug,
                locale
            );

            if (contentSnapshot === null) {
                return {
                    status: 404,
                    data: { message: 'Content not found', },
                } as ApiResponse<ErrorResponse>;
            }

            return {
                status: 200,
                data: articleFactory(
                    contentSnapshot.title,
                    contentSnapshot.keywords,
                    contentSnapshot.description,
                    contentSnapshot.article,
                    contentSnapshot.summary,
                    contentSnapshot.slug,
                    contentSnapshot.createdAt!,
                    contentSnapshot.updatedAt!
                ),
            } as ApiResponse<Article>;
        } catch (error) {
            console.log(
                error
            );

            return {
                status: 500,
                data: { message: 'Error fetching categories data', },
            } as ApiResponse<ErrorResponse>
        }
    }
);
