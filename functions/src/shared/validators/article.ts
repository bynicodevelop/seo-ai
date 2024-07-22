import { Timestamp } from 'firebase-admin/firestore';
import * as yup from 'yup';

import type {
    Article, locales
} from '../types';

export const articleValidator = async (
    article: Article, locales: locales[]
): Promise<void> => {
    const i18nSchema = yup.object().shape(locales.reduce(
        (
            acc, locale
        ) => ({
            ...acc,
            [locale]: yup.string().required(),
        }),
        {}
    ));

    const articleSchema = yup.object().shape({
        title: i18nSchema.required(),
        keywords: i18nSchema.required(),
        description: i18nSchema.required(),
        article: i18nSchema.required(),
        summary: i18nSchema.required(),
        slug: i18nSchema.required(),
        createdAt: yup.mixed()
            .test(
                'is-firestore-timestamp',
                'createdAt must be a Firestore Timestamp',
                value => value instanceof Timestamp
            ).optional(),
        updatedAt: yup.mixed()
            .test(
                'is-firestore-timestamp',
                'updatedAt must be a Firestore Timestamp',
                value => value instanceof Timestamp
            ).optional(),
    });

    await articleSchema.validate(
        article,
        { abortEarly: false }
    );
}

export const createArticleServiceValidator = async (data: {
        domain?: string,
        resume?: string,
    }): Promise<void> => {
    const schema = yup.object().shape({
        domain: yup.string().required(),
        resume: yup.string().required(),
    });

    await schema.validate(
        data,
        { abortEarly: false }
    );
}