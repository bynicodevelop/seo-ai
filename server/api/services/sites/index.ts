import { initSite, Config } from "~/functions/src/shared";
import { db } from "../../../firebase";


export default defineEventHandler(async (event) => {
    const {
        domain,
        sitename,
        keywords,
        description,
        translate
    } = await readBody(event) as Config;

    await initSite({
        domain,
        sitename,
        description,
        keywords: keywords || [],
        translate: translate || []
    }, db);

    return{
        message: 'Site created'
    }
});