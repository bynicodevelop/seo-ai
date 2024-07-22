import * as yup from 'yup';

export const validateArticleSeoDetails = async (details: {
    description?: string,
    keywords?: string[],
    slug?: string,
    summary?: string,
    title?: string
}): Promise<void> => {
    const schema = yup.object().shape({
        description: yup.string().required(),
        keywords: yup.array().of(yup.string().required()).min(
1,
'keywords must have at least one item'
).required(),
        slug: yup.string().required(),
        summary: yup.string().required(),
        title: yup.string().required(),
    });

    await schema.validate(
details,
{ abortEarly: false }
);
}