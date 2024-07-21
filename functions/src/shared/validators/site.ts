import * as yup from 'yup';

export const createSiteServiceValidator = async (
    data: {
        domain?: string,
        sitename?: string,
        keywords?: string[],
        description?: string,
        locales?: string[],
        categories?: [{ [key: string]: string }]
    }): Promise<void> => {
    const schema = yup.object().shape({
        domain: yup.string().required(),
        sitename: yup.string().required(),
        keywords: yup.array().of(yup.string()).required(),
        description: yup.string().required(),
        locales: yup.array().of(yup.string()).optional(),
        categories: yup.array().of(yup.object().shape({})).optional()
    });

    await schema.validate(
        data,
        { abortEarly: false }
    );
}
