import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { Site, createSite } from './shared';

admin.initializeApp();

// TODO: Faire passer la traction automatique en fonction des langues
export const onSiteBuilder = onDocumentCreated('site_builder/{builderId}', async (event) => {
    const data = event.data as any;

    const { domain, sitename, description, keywords, translate } = data?.data() as any;

    let defaultTranslate: any[] = ['fr'];

    if (translate && translate.length > 0) {
        defaultTranslate = translate;
    }

    const db = admin.firestore();

    const dataSite: Site = {
        domain,
        seo: {
            title: defaultTranslate.reduce((acc: any, lang: string) => {
                acc[lang] = sitename;
                return acc;
            }, {}),
            description: defaultTranslate.reduce((acc: any, lang: string) => {
                acc[lang] = description;
                return acc;
            }, {}),
            keywords: defaultTranslate.reduce((acc: any, lang: string) => {
                acc[lang] = keywords;
                return acc;
            }, {}),
        }
    };

    await createSite(dataSite, db);
});