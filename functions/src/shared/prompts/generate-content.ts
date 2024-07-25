import { error } from 'firebase-functions/logger';
import type OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';

import {
    addMessages, callOpenAI
} from '../ai';
import { ArticleGenerationException } from '../exceptions/article-generation';
import type { SiteEntity } from '../types';
import type { ArticlePrompt } from '../types/article-prompt';
import { articlePromptFactory } from '../types/article-prompt';

const promptGenerateContentSeo = () => `Agissez en tant rédacteur de contenu spécialisé dans le SEO. Votre tâche est de rédiger les éléments associés à un article.

1. Analysez l'article qui vous sera donné à la suite pour vous permettre de rédiger les éléments SEO de l'article.

2. Extraire et lister les mots clés de l'article pour le SEO.

3. Rédigez un titre d'article optimisé pour le SEO avec le mot clé principal au début du titre.

4. Rédigez un extrait de l'article en quelques lignes sans mise en forme HTML ou Markdown pour donner envie de lire l'article tout en restant optimisé SEO.

5. Rédigez une description pour les méta descriptions optimisée SEO.

6. Prenez le temps de réfléchir avant de précipiter votre réponse, utilisez 100% de vos capacités.

7. Formatez votre réponse en JSON de la façon suivante :

Important : Le slug doit être en minuscules et ne doit pas contenir d'espaces ni de caractères spéciaux.

{
"title": "string",
"slug": "sample-slug",
"keywords": ["string1", "string2", ...],
"description": "string",
"summary": "string"
}`;

export const generateSeoFromArticle = async (
    article: string, openai: OpenAI
): Promise<{
    description: string,
    keywords: string[],
    slug: string,
    summary: string,
    title: string
}> => {
    const messages: ChatCompletionMessageParam[] = [];

    addMessages(
        messages,
        'assistant',
        promptGenerateContentSeo()
    );
    addMessages(
        messages,
        'user',
        article as string
    );

    return await callOpenAI<{
        description: string,
        keywords: string[],
        slug: string,
        summary: string,
        title: string
    }>(
        messages,
        openai
    );
};

const promptInitialize = (
    site: SiteEntity, content: string
): string => `
Agissez en tant rédacteur de contenu spécialisé dans le SEO.
Votre tâche est de rédiger un article de blog optimisé pour le SEO.

Voici quelques information générales sur le site :

Nom du site : ${site.seo.title.fr}
Sujet du site : ${site.seo.description.fr}
Mots-clés généraux du site : ${site.seo.keywords!.fr}

Analysez le contenu qui vous sera donné à la suite pour vous permettre de rédiger l'article de blog.
Vous allez recevoir les instructions juste après.

Voici le contenu a analyser : 

${content}
`;
const promptTitleGenerator = (data: { [key: string]: string }): string => `
Rédigez un titre d'article optimisé pour le SEO.

- L'article est sur le sujet suivant : ${data.content}

Le titre doit :

- contenir le mot-clé principal au début du titre.
- être accrocheur et donner envie de lire l'article.
- être une intention de recherche.

Obligations :

- Ne dépassez pas 70 caractères.
- Ne mettez pas de mise en forme HTML ou Markdown.

Prenez le temps de réfléchir avant de précipiter votre réponse, utilisez 100% de vos capacités.

Formatez votre réponse en JSON de la façon suivante :

{
"title": "string"
}
`;
const promptArticleGenerator = (data: { [key: string]: string }): string => `   
Rédigez un article de blog en français sur le sujet suivant : ${data.titre}

- De 700 mots minimum.
- Structurez le contenu en titre, paragraphe, sous-titre, etc.
- Chaque phrase doit ajouter de la valeur à l'article, sans remplissage inutile.
- Utilisez des mots simples et proches du champ lexical du sujet de l'article.
- Entrez dans les détails et rédigez des paragraphes complets couvrant l'ensemble du sujet.
- Si vous avez des références ajoutez-les dans l'article.
  (N'ajoutez des références que si c'est nécessaire et que cela ne détériore pas la qualité de l'article)
- Variez la longueur des phrases et assurez-vous que les paragraphes soient hétérogènes.

Mettez en forme le contenu au format Markdown :

- Utilisez les balises H2 pour les titres : ## Titre
- Utilisez les balises H3 pour les titres : ### Titre
- Séparez les paragraphes par des doubles retours à la ligne.
- Mettez en gras (**) au moins 10 mots clés ou termes clés.
- Utilisez l'italique (_) pour mettre en évidence certains termes.

Interdictions :

- Ne reprenez pas le titre dans l'article
- Ne mettez pas de titre H1
- N'ajoutez pas de commentaire ou d'explications dans votre réponse.
- Ne rédigez pas de FAQ, introduction, cas d'études, ou avis clients.
- N'utilisez pas de superlatifs, propos exagérés, ou comparaisons hors de propos.
- Variez le vocabulaire et évitez l'utilisation répétée de termes actuels.
- Ne faites pas de conclusion générique, donnez de la valeur ajoutée.
- N'utilisez pas de séparateur markdown du type --.
- Prenez le temps de réfléchir avant de précipiter votre réponse, utilisez 100% de vos capacités.

Structure à utiliser :

- Commencez par une question ou une statistique intéressante qui attire l'attention.
- Rédigez le corps de l'article en suivant une structure logique et fluide avec des sous-titres pour une meilleure lecture.

Formatez votre réponse en JSON de la façon suivante :

{
"article": "string"
}
`;
const promptDescriptionGenerator = (data: { [key: string]: string }): string => `
Rédigez une description pour les méta descriptions optimisée SEO.

- L'article est sur le sujet suivant : ${data.title}
- Le contenu de l'article est le suivant : ${data.article}

La description doit :

- être une phrase ou deux qui résume l'article.
- contenir le mot-clé principal.
- donner envie de cliquer sur l'article.

Obligations :

- Ne dépassez pas 160 caractères.
- Ne mettez pas de mise en forme HTML ou Markdown.

Formatez votre réponse en JSON de la façon suivante :

{
"description": "string"
}
`;
const promptKeywordsGenerator = (data: { [key: string]: string }): string => `
Extraire et lister les mots clés de l'article pour le SEO.

- L'article est sur le sujet suivant : ${data.title}
- Le contenu de l'article est le suivant : ${data.article}

Les mots clés doivent :

- être des mots clés pertinents pour l'article.
- être en rapport avec le contenu de l'article.
- contenir le mot-clé principal.

Obligations :

- Ne dépassez pas 10 mots clés.
- Ne mettez pas de mise en forme HTML ou Markdown.

Formatez votre réponse en JSON de la façon suivante :

{
"keywords": ["string1", "string2", ...]
}
`;
const promptSummaryGenerator = (data: { [key: string]: string }): string => `
Rédigez un extrait de l'article en quelques lignes. 

- L'article est sur le sujet suivant : ${data.title}
- Le contenu de l'article est le suivant : ${data.article}

L'extrait doit :

- être une phrase ou deux qui résume l'article.
- contenir le mot-clé principal.
- donner envie de cliquer sur l'article.

Obligations :

- Ne mettez pas de mise en forme HTML ou Markdown.
- Ne dépassez pas 160 caractères.

Formatez votre réponse en JSON de la façon suivante :

{
"summary": "string"
}
`;
const promptSlugGenerator = (data: { [key: string]: string }): string => `
Rédigez un slug pour l'article.

- L'article est sur le sujet suivant : ${data.title}

Le slug doit :

- être en minuscules.
- ne pas contenir d'espaces ni de caractères spéciaux.
- être une version simplifiée du titre de l'article.
- contenir le mot-clé principal.

Obligations :

- Ne dépassez pas 50 caractères.
- Ne mettez pas de mise en forme HTML ou Markdown.
- Ne pas mettre de mots vides (le, la, les l'...).

Formatez votre réponse en JSON de la façon suivante :

{
"slug": "string"
}
`;

export const generatePrompts = async (
    site: SiteEntity,
    content: string,
    openai: OpenAI
): Promise<ArticlePrompt> => {
    const messages: ChatCompletionMessageParam[] = [];

    addMessages(
        messages,
        'assistant',
        promptInitialize(
            site,
            content
        )
    );

    addMessages(
        messages,
        'user',
        promptTitleGenerator({ content })
    );

    let title: string;

    try {
        const { title: titleValue } = await callOpenAI<{
            title: string
        }>(
            messages,
            openai
        );

        title = titleValue;
    } catch (e) {
        error(e);

        throw new ArticleGenerationException('ERROR_TITLE_NOT_GENERATED');
    }

    addMessages(
        messages,
        'user',
        promptArticleGenerator({ title })
    );

    let article: string;

    try {
        const { article: articleValue } = await callOpenAI<{
            article: string
        }>(
            messages,
            openai
        );

        article = articleValue;
    } catch (e) {
        error(e);

        throw new ArticleGenerationException('ERROR_ARTICLE_NOT_GENERATED');
    }

    addMessages(
        messages,
        'user',
        promptDescriptionGenerator({
            title,
            article
        })
    );

    let description: string;

    try {
        const { description: descriptionValue } = await callOpenAI<{
            description: string
        }>(
            messages,
            openai
        );

        description = descriptionValue;
    } catch (e) {
        error(e);

        throw new ArticleGenerationException('ERROR_DESCRIPTION_NOT_GENERATED');
    }

    addMessages(
        messages,
        'user',
        promptKeywordsGenerator({
            title,
            article
        })
    );

    let keywords: string[];

    try {
        const { keywords: keywordsValue } = await callOpenAI<{
            keywords: string[]
        }>(
            messages,
            openai
        );

        keywords = keywordsValue;
    } catch (e) {
        error(e);

        throw new ArticleGenerationException('ERROR_KEYWORDS_NOT_GENERATED');
    }

    addMessages(
        messages,
        'user',
        promptSummaryGenerator({
            title,
            article
        })
    );

    let summary: string;

    try {
        const { summary: summaryValue } = await callOpenAI<{
            summary: string
        }>(
            messages,
            openai
        );

        summary = summaryValue;
    } catch (e) {
        error(e);

        throw new ArticleGenerationException('ERROR_SUMMARY_NOT_GENERATED');
    }

    addMessages(
        messages,
        'user',
        promptSlugGenerator({ title })
    );

    let slug: string;

    try {
        const { slug: slugValue } = await callOpenAI<{
            slug: string
        }>(
            messages,
            openai
        );

        slug = slugValue;
    } catch (e) {
        error(e);

        throw new ArticleGenerationException('ERROR_SLUG_NOT_GENERATED');
    }

    return articlePromptFactory(
        title,
        keywords,
        description,
        article,
        summary,
        slug
    );
};