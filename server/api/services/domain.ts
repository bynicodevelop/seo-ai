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
                name: `Category ${i}`,
                slug: `category-${i}`,
                seo: {
                    title: `Category ${i} - MagicApex`,
                    description: `Category ${i} - MagicApex description`,
                },
                description: `Category ${i} description`,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error };
    }
});
