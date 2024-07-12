import OpenAI from "openai";
import { Site } from "../types";
import { ChatCompletionMessageParam } from "openai/resources";
import { addMessages, callOpenAI } from "../ai";

const promptGenerateContent = (siteDescription: string, keywords: string) => `
Agissez en tant rédacteur de contenu spécialisé dans le SEO.
Votre tâche est de rédiger un article de blog optimisé pour le SEO.

Informations générales :

Sujet du site : ${siteDescription}
Mots-clés généraux du site : ${keywords}
Analysez le contenu qui vous sera donné à la suite pour vous permettre de rédiger l'article de blog.

Rédigez un article de blog en français de 700 mots minimum.
Chaque phrase doit ajouter de la valeur à l'article, sans remplissage inutile.
Utilisez des mots simples et proches du champ lexical du sujet de l'article.
Entrez dans les détails et rédigez des paragraphes complets couvrant l'ensemble du sujet.
Variez la longueur des phrases et assurez-vous que les paragraphes soient hétérogènes.

Mettez en forme le contenu au format Markdown :

Utilisez les balises H2 pour les titres : ## Titre
Utilisez les balises H3 pour les titres : ### Titre
Séparez les paragraphes par des doubles retours à la ligne.
Mettez en gras (**) au moins 10 mots clés ou termes clés.
Utilisez l'italique (_) pour mettre en évidence certains termes.

Interdictions :
Ne mettez pas de titre H1
N'ajoutez pas de commentaire ou d'explications dans votre réponse.
Ne rédigez pas de FAQ, introduction, cas d'études, ou avis clients.
N'utilisez pas de superlatifs, propos exagérés, ou comparaisons hors de propos.
Variez le vocabulaire et évitez l'utilisation répétée de termes actuels.
Ne faites pas de conclusion générique, donnez de la valeur ajoutée.
N'utilisez pas de séparateur markdown du type --.
Prenez le temps de réfléchir avant de précipiter votre réponse, utilisez 100% de vos capacités.

Structure à utiliser :

Accroche : Commencez par une question ou une statistique intéressante qui attire l'attention.
Développement : Rédigez le corps de l'article en suivant une structure logique et fluide avec des sous-titres pour une meilleure lecture.
`;

export const generateContent = async (site: Site, draft: { [key: string]: any }, openai: OpenAI): Promise<string> => {
    const messages: ChatCompletionMessageParam[] = [];

    addMessages(messages, 'assistant', promptGenerateContent(
        site.seo.description.fr as string,
        site.seo.keywords?.fr as string
    ));
    addMessages(messages, 'user', draft.content);

    return await callOpenAI<string>(messages, openai, 'text');
};