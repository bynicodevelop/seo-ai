import { I18n } from "./i18n";

export type Category = {
    title: I18n;
    description: I18n;
    slug: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export function categoryFactory(
    title: I18n,
    description: I18n,
    slug: string,
): Category;
export function categoryFactory(
    title: I18n,
    description: I18n,
    slug: string,
    createdAt?: Date,
    updatedAt?: Date
): Category {
    return {
        title,
        description,
        slug,
        createdAt: createdAt ?? new Date(),
        updatedAt: updatedAt ?? new Date()
    }
}