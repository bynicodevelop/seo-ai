import { DocumentReference } from "firebase-admin/firestore";
import { ID, IdType, Reference } from "./common";
import { I18n } from "./i18n";

export type CategoryId = string;

export type Category = {
    title: I18n;
    description: I18n;
    slug: I18n;
    createdAt?: Date;
    updatedAt?: Date;
}

export type CategoryEntity = Category & Reference & IdType;

export function categoryFactory(
    title: I18n,
    description: I18n,
    slug: I18n,
): Category;

export function categoryFactory(
    title: I18n,
    description: I18n,
    slug: I18n,
    createdAt: Date,
    updatedAt: Date
): Category;

export function categoryFactory(
    title: I18n,
    description: I18n,
    slug: I18n,
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

export function categoryFactoryEntity(
    ref: DocumentReference,
    id: ID,
    title: I18n,
    description: I18n,
    slug: I18n
): CategoryEntity;

export function categoryFactoryEntity(
    ref: DocumentReference,
    id: ID,
    title: I18n,
    description: I18n,
    slug: I18n,
    createdAt: Date,
    updatedAt: Date
): CategoryEntity;

export function categoryFactoryEntity(
    ref: DocumentReference,
    id: ID,
    title: I18n,
    description: I18n,
    slug: I18n,
    createdAt?: Date,
    updatedAt?: Date
): CategoryEntity {
    return {
        id,
        ref,
        title,
        description,
        slug,
        createdAt: createdAt ?? new Date(),
        updatedAt: updatedAt ?? new Date()
    }
}