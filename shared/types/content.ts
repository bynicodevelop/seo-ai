import type { Timestamp } from "firebase-admin/firestore";
import type { MetaSeo } from "./meta-seo";


export type Content = {
    id: string;
    slug: string;
    title: string;
    seo: MetaSeo;
    category: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    publishedAt: Timestamp;
};