import { initSite, Config } from "~/functions/src/shared";
import { db } from "../../../firebase";


export default defineEventHandler(async (event) => {
    const {
        domain,
        sitename,
        keywords,
        description,
        locales,
        categories
    } = await readBody(event) as Config;

    await initSite({
        domain,
        sitename,
        description,
        locales,
        keywords: keywords || [],
        categories: categories || [] as any
    }, db);

    return {
        message: 'Site created'
    }
});