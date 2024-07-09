// /server/api/getData.js
import { db } from '../../config/firebase';

export default defineEventHandler(async (event) => {
    try {
        db.collection('domains').doc('localhost').set({
            title: 'Localhost - MagicApex',
            description: 'Localhost - MagicApex description',
        });

        for (let i = 0; i < 5; i++) {
            db.collection('domains')
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
                db.collection('domains')
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
        return { success: false, error: error };
    }
});
