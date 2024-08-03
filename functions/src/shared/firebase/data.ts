import type { Firestore } from 'firebase-admin/firestore';

export const createData = async (
data: {[key: string]: string}, db: Firestore
) => {
    await db.collection('data').add(data);
};