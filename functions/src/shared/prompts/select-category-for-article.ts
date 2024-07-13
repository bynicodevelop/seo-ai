import { ChatCompletionMessageParam } from "openai/resources";
import { Category } from "../types";
import { addMessages, callOpenAI } from "../ai";
import OpenAI from "openai";

const promptSelectCategoryForArticle = (categories: Category[]): string => `
Agissez en tant que traducteur multilingue dans le domaine du SEO.
Vous devez sélectionner une catégorie pour un article.

1. Analysez la description du futur article qui sera fournie un peu plus bas.

2. Analysez la liste des catégories suivantes : ${JSON.stringify(categories)}

3. Sélectionnez la catégorie qui correspond le mieux à la description de l'article.

Retourner la catégorie au format json suivant :

{
    "id": "id-de-la-categorie",
    "title": "Nom de la catégorie",
    "description": "Description de la catégorie",
    "slug": "slug-de-la-categorie"
}
`;

export const selectCategoryForArticlePrompt = async (content: string, categories: Category[], openai: OpenAI): Promise<Category> => {
    const messages: ChatCompletionMessageParam[] = [];

    addMessages(messages, 'assistant', promptSelectCategoryForArticle(categories));
    addMessages(messages, 'user', content);

    return await callOpenAI<Category>(messages, openai);
}