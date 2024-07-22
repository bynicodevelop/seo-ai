import * as yup from 'yup';

export const validateCategoryId = async (category?: { id: string }): Promise<void> => {
    const schema = yup.object().shape({ id: yup.string().required(), });

    await schema.validate(
category,
{ abortEarly: false }
);
}