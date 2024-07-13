import { categoryFactory, siteFactory } from '~/functions/src/shared';
import { db } from '../../firebase';
import { MetaSeo } from '~/functions/src/shared';
import { createSite } from '~/functions/src/shared';
import { DomainQuery } from '~/server/types';

export default defineEventHandler(async (event) => {
    const { name } = getQuery(event) as DomainQuery;

    try {
        const siteRef = await createSite(
            siteFactory(
                name,
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
            await siteRef
                .collection('categories')
                .doc(`category-${i}`)
                .set(categoryFactory(
                    `category-${i}`,
                    {
                        fr: `Catégorie ${i}`,
                        en: `Category ${i}`,
                    },
                    {
                        fr: `Description de la catégorie ${i}`,
                        en: `Description of category ${i}`,
                    },
                    `category-${i}`
                ));

            for (let j = 0; j < 5; j++) {
                await siteRef
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
