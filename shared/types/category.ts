import type { Timestamp } from "firebase-admin/firestore";
import type { MetaSeo } from "./meta-seo";
import type { Content } from "./content";
import type { I18n } from "./i18n";

export type Category = {
    id: string;
    name: I18n;
    slug: string;
    seo: MetaSeo;
    description: I18n;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    contents?: Content[];
};