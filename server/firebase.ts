import admin from 'firebase-admin';

import serviceAccount from '../firebase-config.json';

if (!admin.apps.length) {
    admin.initializeApp(
        {
            credential: admin.credential.cert(
serviceAccount as admin.ServiceAccount
            ),
        }
    );
}

const db = admin.firestore();

if (process.env.FIRESTORE_EMULATOR_HOST) {
    db.settings(
        {
            host: process.env.FIRESTORE_EMULATOR_HOST,
            ssl: false,
        }
    );
}

export { db };
