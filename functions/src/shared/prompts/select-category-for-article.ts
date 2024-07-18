import type OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';

import {
 addMessages, callOpenAI 
} from '../ai';
import type { Category } from '../types';

const promptSelectCategoryForArticle = (
    categories: Category[]
): string => `
Agissez en tant que traducteur multilingue dans le domaine du SEO.
Vous devez sélectionner une catégorie pour un article.

1. Analysez la description du futur article qui sera fournie un peu plus bas.

2. Analysez la liste des catégories suivantes : ${JSON.stringify(
        categories
    )}

3. Sélectionnez la catégorie qui correspond le mieux à la description de l'article.

Retourner la propriété id de la catégorie sélectionnée au format JSON suivant :

{
    "id": "string"
}
`;

export const selectCategoryForArticlePrompt = async (
content: string, categories: Category[], openai: OpenAI
): Promise<{
    id: string;
}> => {
    const messages: ChatCompletionMessageParam[] = [];

    addMessages(
        messages,
        'assistant',
        promptSelectCategoryForArticle(
            categories
        )
    );
    addMessages(
        messages,
        'user',
        content
    );

    return await callOpenAI<{
        id: string;
    }>(
messages,
openai
);
}