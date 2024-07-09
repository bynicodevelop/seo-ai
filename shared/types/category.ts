import type { Timestamp } from "firebase-admin/firestore";
import type { MetaSeo } from "./meta-seo";
import type { Content } from "./content";

export type Category = {
    id: string;
    name: string;
    slug: string;
    seo: MetaSeo;
    description: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    contents?: Content[];
};