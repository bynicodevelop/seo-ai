import { db } from '../../../firebase';
import {
 initSite, type Config 
} from '~/functions/src/shared';

export default defineEventHandler(
    async event => {
        const {
            domain,
            sitename,
            keywords,
            description,
            locales,
            categories
        } = await readBody(
            event
        ) as Config;

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
    }
);