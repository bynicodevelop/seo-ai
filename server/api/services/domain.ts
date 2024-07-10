// /server/api/getData.js
import { siteFactory } from '~/functions/src/shared';
import { db } from '../../firebase';
import { MetaSeo } from '~/functions/src/shared';
import { createSite } from '~/functions/src/shared';

export default defineEventHandler(async (event) => {
    try {
        await createSite(
            siteFactory(
                'localhost',
                {
                    title: {
                        fr: 'Localhost - MagicApex',
                        en: 'Localhost - MagicApex',
                    },
                    description: {
                        fr: 'Localhost - MagicApex description',
                        en: 'Localhost - MagicApex description',
                    },
                    keywords: {
                        fr: ['MagicApex', 'localhost'],
                        en: ['MagicApex', 'localhost'],
                    },
                } as MetaSeo
            ),
            db
        );

        for (let i = 0; i < 5; i++) {
            db.collection('sites')
                .doc('localhost')
                .collection('categories')
                .doc(`category-${i}`)
                .set({
                    title: {
                        fr: `Catégorie ${i}`,
                        en: `Category ${i}`,
                    },
                    slug: `category-${i}`,
                    seo: {
                        title: {
                            fr: `Catégorie ${i} - MagicApex`,
                            en: `Category ${i} - MagicApex`,
                        },
                        description: {
                            fr: `Description de la catégorie ${i}`,
                            en: `Description of category ${i}`,
                        }
                    },
                    description: {
                        fr: `Description de la catégorie ${i}`,
                        en: `Description of category ${i}`,
                    },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

            for (let j = 0; j < 5; j++) {
                db.collection('sites')
                    .doc('localhost')
                    .collection('categories')
                    .doc(`category-${i}`)
                    .collection('contents')
                    .doc(`content-${j}`)
                    .set({
                        title: {
                            fr: `Article ${j}`,
                            en: `Article ${j}`,
                        },
                        content: {
                            fr: `Contenu de l'article ${j}`,
                            en: `Content of article ${j}`,
                        },
                        slug: `article-${j}`,
                        seo: {
                            title: {
                                fr: `Article ${j} - MagicApex`,
                                en: `Article ${j} - MagicApex`,
                            },
                            description: {
                                fr: `Description de l'article ${j}`,
                                en: `Description of article ${j}`,
                            }
                        },
                        excerpt: {
                            fr: `Description de l'article ${j}`,
                            en: `Description of article ${j}`,
                        },
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
            }
        }

        return { success: true };
    } catch (error) {
        console.log(error);

        return { success: false, error: error };
    }
});
