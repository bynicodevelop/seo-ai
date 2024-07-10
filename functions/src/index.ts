import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { Site, createSite, initOpentAI, translatePrompt, I18n } from './shared';
import { defineString } from "firebase-functions/params";

admin.initializeApp();

// firebase functions:secrets:set OPENAI_API
const openAIKey = defineString('OPENAI_API');

export const onSiteBuilder = onDocumentCreated('site_builder/{builderId}', async (event) => {
    const openAi = initOpentAI(openAIKey.value());

    const data = event.data as any;

    const { domain, sitename, description, keywords, translate } = data?.data() as any;

    let defaultTranslate: any[] = ['fr'];

    if (translate && translate.length > 0) {
        defaultTranslate = translate;
    }

    const translatedDescription: I18n = await translatePrompt(defaultTranslate, description, openAi);

    const db = admin.firestore();

    const dataSite: Site = {
        domain,
        seo: {
            title: defaultTranslate.reduce((acc: any, lang: string) => {
                acc[lang] = sitename;
                return acc;
            }, {}),
            description: translatedDescription,
            keywords: defaultTranslate.reduce((acc: any, lang: string) => {
                acc[lang] = keywords;
                return acc;
            }, {}),
        }
    };

    await createSite(dataSite, db);
});