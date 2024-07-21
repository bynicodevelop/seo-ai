import { createSiteServiceValidator } from '~/functions/src/shared/validators/site';
import { db } from '../../../firebase';
import {
 initSite, type Config 
} from '~/functions/src/shared';

export default defineEventHandler(async event => {
        const {
            domain,
            sitename,
            keywords,
            description,
            locales,
            categories
        } = await readBody(event) as Config;

        try {
            await createSiteServiceValidator({
                domain,
                sitename,
                keywords,
                description,
                locales,
                categories
            });
        } catch (error) {
            return {
                status: 400,
                body: 'Request body is not valid'
            }
        }

        await initSite(
            {
                domain,
                sitename,
                description,
                locales,
                keywords: keywords || [],
                categories: categories || [] as unknown as [{ [key: string]: string }]
            },
            db
        );

        return { message: 'Site created' }
    });