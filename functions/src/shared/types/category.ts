import { ID, IdType } from "./common";
import { I18n } from "./i18n";

export type Category = IdType & {
    title: I18n;
    description: I18n;
    slug: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export function categoryFactory(
    id: ID,
    title: I18n,
    description: I18n,
    slug: string,
): Category;

export function categoryFactory(
    id: ID,
    title: I18n,
    description: I18n,
    slug: string,
    createdAt: Date,
    updatedAt: Date
): Category;

export function categoryFactory(
    id: ID,
    title: I18n,
    description: I18n,
    slug: string,
    createdAt?: Date,
    updatedAt?: Date
): Category {
    return {
        id,
        title,
        description,
        slug,
        createdAt: createdAt ?? new Date(),
        updatedAt: updatedAt ?? new Date()
    }
}