// /server/api/getData.js
import { db } from '../../config/firebase';

export default defineEventHandler(async (event) => {
    try {
        db.collection('domains').doc('localhost').set({
            title: 'Localhost - MagicApex',
            description: 'Localhost - MagicApex description',
        });

        for (let i = 0; i < 5; i++) {
            db.collection('domains').doc('localhost').collection('categories').doc(`category-${i}`).set({
                name: {
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
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error };
    }
});
