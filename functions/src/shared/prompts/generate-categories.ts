import { ChatCompletionMessageParam } from "openai/resources";
import OpenAI from "openai";
import { addMessages, callOpenAI } from "../ai/open-ai";
import { Category } from "../types";

const promptCreateCategories = () => `Agissez en tant qu'expert SEO. 
Vous devez pour un trouver une liste de catégories optimisé pour le SEO dans le cadre de la création d'un blog.
Vous devez prendre en compte les informations qui vous sont donnés pour faire, parfaitement correspondre les catégories à la thématique du site.

1) Vous allez analyser les données envoyées par l'utilisateur
2) Vous devez définir une liste de 3 à 5 de catégories optimisées pour le SEO

Chaque catégories est structuré : 

- d'un titre court un le mot clé principal
- un slug qui est le titre de la catégorie transformer un partie d'url optimisé pour le SEO
- une description optimisé pour le SEO (du texte, sans mise en forme) contenant un ou plusieurs mots clés de la catégorie sans remplissage inutile.

N'ajoutez pas de commentaire ou d'explication a votre réponse.

Les catégories a bannir : 
- Les Avis et Témoignages
- Commentaires
- FAQ
- Comparaison
- Ressources
- Actualité

Vous retournez uniquement un JSON structuré d'un tableau de 3 à 5 objets.
Voici la structure du format JSON attendue :

{
"categories": [
    [
 {
        title: string;
        slug: string;
        description: string;
 },
]
}`;

const promptTranslateCategories = (codelang: string[]) => `
Agissez en tant que traducteur multilingue dans le domaine du SEO.
Vous savez prendre le contexte en compte dans votre traduction.
Vous savez faire le rapprochement entre un code de langue (ex : fr, en...) et une langue (ex : fr c'est français).
Vous allez recevoir un contenu texte uniquement à traduire en fonction d'une liste de codes langue.
Gardez la mise en forme s'il y en a une.
Voici les codes langue que vous devez prendre en compte : ${codelang.join(', ')}.
Vous retournez le contenu au format JSON qui est un objet code langue associé au contenu traduit.
Voici un exemple de format attendu :

{
"categories": [
    [
 {
        title: {
"fr": "contenu traduit...",
"en": "..."
},
        slug: "slug",
        description: {
"fr": "contenu traduit...",
"en": "..."
},
 },
]
}
`;

export const generateCategoriesPrompt = async (content: object, openai: OpenAI): Promise<{
    [key: string]: [
        {
            title: string;
            slug: string;
            description: string;
        }
    ]
}> => {
    const messages: ChatCompletionMessageParam[] = [];

    addMessages(messages, 'assistant', promptCreateCategories());
    addMessages(messages, 'user', content);

    return await callOpenAI<{
        [key: string]: [
            {
                title: string;
                slug: string;
                description: string;
            }
        ]
    }>(messages, openai);
}

export const translateCategoriesPrompt = async (codeLang: string[], content: object, openai: OpenAI): Promise<{
    [key: string]: Category[]
}> => {
    const messages: ChatCompletionMessageParam[] = [];

    addMessages(messages, 'assistant', promptTranslateCategories(codeLang));
    addMessages(messages, 'user', content);

    return await callOpenAI<{
        [key: string]: Category[]
    }>(messages, openai);
}