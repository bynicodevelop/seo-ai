import type { DocumentReference } from 'firebase-admin/firestore';

export type ID = string | undefined;

export type IdType = {
    id?: ID;
}

export type Reference = {
    ref?: DocumentReference;
}