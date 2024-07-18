import type { DocumentData } from 'firebase-admin/firestore';

import { db } from '../../firebase';
import {
    type Category, categoryFactory, getSiteByDomain
} from '~/functions/src/shared';
import type {
    ApiResponse, DomainQuery, ErrorResponse
} from '~/server/types';

export default defineEventHandler(
    async event => {
        const { domain } = getQuery(
            event
        ) as DomainQuery;

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

            const snapshot = await siteRef.ref!.collection(
                'categories'
            ).get();

            const categories: Category[] = snapshot.docs.map(
                (
                    doc: DocumentData
                ) => {
                    const {
                        title, slug, description
                    } = doc.data() as Category;
                    return categoryFactory(
                        title,
                        description,
                        slug
                    );
                }
            );

            return {
                status: 200,
                data: categories
            } as ApiResponse<Category[]>;
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
