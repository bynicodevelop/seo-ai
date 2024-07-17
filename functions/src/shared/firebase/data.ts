import { Firestore } from "firebase-admin/firestore";

export const createData = async (data: any, db: Firestore) => {
    await db.collection('data').add(data);
};