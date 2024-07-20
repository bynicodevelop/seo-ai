// /server/api/getData.js
import { db } from '../../../firebase';
import type { Category } from '~/functions/src/shared';
import {
    categoryFactory, getSiteByDomain, getCategoryBySlug
} from '~/functions/src/shared';
import type {
    ApiResponse, DomainQuery, ErrorResponse, LocaleQuery
} from '~/server/types';
import { getDomain } from '~/utils/domain';


export default defineEventHandler(async (event) => {
    const { categorySlug } = event.context.params as { categorySlug: string };
    const { locale } = getQuery(event) as DomainQuery & LocaleQuery;
    const domain = getDomain(event);

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

        return {
            status: 200,
            data: categoryFactory(
                categoryEntity.title,
                categoryEntity.description,
                categoryEntity.slug
            ),
        } as ApiResponse<Category>;
    } catch (error) {
        console.log(error);

        return {
            status: 500,
            data: { message: 'Error fetching category data', },
        } as ApiResponse<ErrorResponse>
    }
});