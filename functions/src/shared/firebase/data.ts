import type { Firestore } from 'firebase-admin/firestore';

export const createData = async (
data: {[key: string]: string | string[] | boolean}, db: Firestore
) => {
    await db.collection('data').add(data);
};