import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { Category, categoryFactory, createCategories, createSite, generateCategoriesPrompt, I18n, initOpentAI, Site, siteFactory, translateCategoriesPrompt, translatePrompt } from './shared';
import { defineString } from "firebase-functions/params";
import { first, isEmpty } from "lodash";
import { updateDraft } from "./shared/firebase/draft";
import { Firestore } from "firebase-admin/firestore";
import OpenAI from "openai";

admin.initializeApp();

// firebase functions:secrets:set OPENAI_API
const openAIKey = defineString('OPENAI_API');

export const onSiteBuilder = onDocumentCreated('site_builder/{builderId}', async (event) => {
    const db = admin.firestore();
    const openAi = initOpentAI(openAIKey.value());

    const data = event.data as any;

    const { domain, sitename, description, keywords, translate, categories } = data?.data() as any;

    const defaultTranslate: any[] = translate.length > 0 ? translate : ['fr'];

    const defaultCategories = [];

    if (isEmpty(categories)) {
        const generateCategories = await generateCategoriesPrompt(
            {
                domain,
                sitename,
                description,
                keywords
            },
            openAi
        );

        const translatedCategories = await translateCategoriesPrompt(
            defaultTranslate,
            generateCategories.categories,
            openAi

        );

        defaultCategories.push(...translatedCategories.categories.map((category) => ({
            title: category.title,
            description: category.description,
            slug: category.slug,
        })));
    } else {
        if (first<Category>(categories) && defaultTranslate.find((lang) => first<Category>(categories)?.title[lang])) {
            defaultCategories.push(...categories);
        } else {
            const translatedCategories = await translateCategoriesPrompt(
                defaultTranslate,
                categories,
                openAi

            );

            defaultCategories.push(...translatedCategories.categories);
        }
    }

    let translatedDescription: I18n;

    if (typeof description === 'string') {
        translatedDescription = await translatePrompt(defaultTranslate, description, openAi);
    } else {
        translatedDescription = defaultTranslate.reduce((acc: any, lang: string) => {
            acc[lang] = description[lang];
            return acc;
        }, {});
    }

    const dataSite: Site = siteFactory(
        domain,
        {
            title: defaultTranslate.reduce((acc: any, lang: string) => {
                acc[lang] = sitename;
                return acc;
            }, {}),
            description: translatedDescription,
            keywords: defaultTranslate.reduce((acc: any, lang: string) => {
                acc[lang] = keywords;
                return acc;
            }, {}),
        },
    );

    await createSite(dataSite, db);

    await createCategories(
        dataSite,
        defaultCategories.map((category) => (
            categoryFactory(
                category.title,
                category.description,
                category.slug
            ))),
        db
    );
});

const c = `## Qu'est-ce que trader le Forex ?

Vous vous demandez ce qu’implique **trader le Forex** ? Comprendre le marché des devises peut sembler complexe au premier abord, mais avec une bonne formation, les choses deviennent plus claires. Avant de vous lancer dans le trading sur le Forex, il est primordial d'apprendre à gérer les risques, développer une stratégie de trading efficace et maîtriser vos émotions.

## Le Forex : Le Marché des Devises

**Trader le Forex**, c'est négocier sur le marché des changes où les devises du monde entier sont cotées. Chaque devise est cotée sous forme de paires. La paire la plus célèbre est l’EUR/USD, qui représente la cotation de l’Euro face au Dollar américain. Cette cotation indique combien vaut un Euro en Dollars américains. Sur le Forex, il existe toujours une comparaison entre deux devises, ce que l'on appelle le taux de change.

Pour générer des profits sur le marché des changes, vous spéculez sur l’évolution du taux de change d'une paire de devises. Vous pouvez spéculer soit à la hausse soit à la baisse. Il est essentiel de comprendre qu’acheter ou vendre une paire de devises sur le Forex implique toujours une double opération.

### Exemple de Double Opération

Prenons l’exemple de l’EUR/USD :
- **Acheter l’EUR/USD** revient à acheter des Euros et à vendre des Dollars. Vous espérez alors que le taux de change de l’Euro face au Dollar s’apprécie.
- **Vendre l’EUR/USD** signifie vendre des Euros et acheter des Dollars. Dans ce cas, vous espérez que le taux de change de l’Euro face au Dollar se déprécie.

Pour clôturer un trade, il faut réaliser l’opération inverse de celle effectuée initialement : vendre la devise achetée et acheter la devise vendue. En d'autres termes, vous devez acheter la paire que vous avez vendue et vendre la paire que vous avez achetée. 

### La Gestion des Risques

La gestion des risques est un élément crucial du trading **Forex**. Une erreur courante est l'abus de l’effet de levier, qui peut amplifier aussi bien les gains que les pertes. Une bonne gestion des risques passe par l’application de stratégies telles que l’utilisation de stop-loss pour limiter les pertes potentielles et la diversification des investissements pour minimiser les risques.

## Développer une Stratégie de Trading

La réussite sur le Forex dépend fortement d'une stratégie de trading bien définie. Une stratégie doit inclure des critères d’entrée et de sortie de position, des plans pour gérer les trades en cours ainsi que des objectifs de risque et de rendement. Il est également important de tester la stratégie sur un compte de démonstration avant de l'appliquer en conditions réelles.

## Exemple de Trade sur l'EUR/USD

Admettons que vous anticipez une hausse de l’EUR/USD sur le prochain mois. À ce moment, l’EUR/USD cote à 1.05. Cela signifie qu’avec 1€, vous obtenez 1.05$. Vous décidez d’acheter pour 0.1 lot (10 000 unités), ce qui équivaut à acheter 10 000€ et vendre 10 500$. Un mois plus tard, l’EUR/USD cote à 1.10, ce qui signifie qu’avec 1€, vous obtenez 1.10$. En clôturant votre trade, vous réalisez l’opération inverse : vous vendez 10 000€ et achetez 11 000$. Vous avez donc réalisé un gain étant donné qu’un mois plus tôt, vos 10 000€ valaient 10 500$ et aujourd'hui 11 000$. Votre gain est de 500$.

### Récapitulatif de l'Opération

- **Taux de départ:** 1€ = 1.05$
- **Achat initial:** 10 000€ et vente de 10 500$
- **Taux à la clôture:** 1€ = 1.10$
- **Vente finale:** 10 000€ et achat de 11 000$
- **Gain final:** 500$

## Conclusion

Le trading sur le Forex est fascinant et peut être lucratif quand on y est bien préparé. Il nécessite une compréhension approfondie des mécanismes du marché, une gestion rigoureuse des risques ainsi qu’une stratégie de trading bien définie. La clé du succès réside dans la formation continue et l'adaptation constante aux conditions changeantes du marché. Il est essentiel de se former, de tester ses stratégies sur des comptes démo et de toujours garder un œil vigilant sur les variations du marché des devises.`

const generateArticle = async (
    siteId: string,
    draftId: string,
    c: string,
    openAi: OpenAI,
    db: Firestore
) => {
    // const siteRef = await getSiteById(siteId, db);
    // const site = siteRef?.data() as Site;

    // const article = await generateContent(site, {
    //     content
    // }, openAi);

    const article = c;

    const draft = {
        article,
        status: 'ARTICLE_CREATED',
    }

    await updateDraft(draftId, siteId, draft, db);
};

export const onDraftCreated = onDocumentWritten('sites/{siteId}/drafts/{draftId}', async (event) => {
    const db = admin.firestore();
    const openAi = initOpentAI(openAIKey.value());
    const { siteId, draftId } = event.params;

    const { content, status } = event.data?.after.data() as Partial<{ [key: string]: string }>;

    console.log({ content, status });

    if (status !== 'DRAFT') return;

    if (status === 'DRAFT') {
        await generateArticle(
            siteId,
            draftId,
            c,
            openAi,
            db
        );
    }


});