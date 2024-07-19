import { ChatCompletionMessageParam } from "openai/resources";
import { addMessages, callOpenAI } from "../ai";
import OpenAI from "openai";
import { ResumeContent } from "../types/prompt";

const returnContent = `
Retournez les informations au format json comme l'exemple qui suit : 

{
"resume": "...",
"keywords": ["...", "..."]
}
`;

export const promptResumeContent = (): string => `
Agissez en tant qu'expert en SEO.
Analysez les contenus qui vous seront fourni en extrayant les informations les plus importantes.
Créez un résumé complet des contenus.
Ce résumé sera utilisé dans le cadre de la rédaction d'un futur article optimisé pour le SEO.
Extrayez du contenu 5 mots clés principaux maximum.

Interdictions : 
- Ne pas citer la source
- Ne pas citer d'auteur
- Ne pas inclure de nom
- Ne pas faire de mise en forme
- Ne pas inclure de liens, URL ou citations

${returnContent}
`;

export const promptResumeContentSuite = (resume: { [key: string]: string | string[] }, content: string): string => `
Reprendre le résumé suivant : ${resume.resume} et les mots clés suivants : ${(resume.keywords as string[]).join(', ')} dans votre analyse.
Complétez le résumé avec les nouvelles informations du contenu suivant : ${content}

Votre résumé doit être complet et inclure les informations les plus importantes.

${returnContent}
`;

export const resumeContentPrompt = async (contents: string[], openai: OpenAI): Promise<ResumeContent> => {
    const messages: ChatCompletionMessageParam[] = [];
    const contentCopy = [...contents];

    addMessages(messages, 'assistant', promptResumeContent());

    // Extraction du premier contenu pour initialiser le résumé
    const firstContent = contentCopy.shift() as string;
    addMessages(messages, 'user', firstContent);
    let resume = await callOpenAI<ResumeContent>(messages, openai);

    // Extraction des autres contenus pour compléter le résumé
    for (const content of contentCopy) {
        addMessages(messages, 'user', promptResumeContentSuite(resume, content));
        resume = await callOpenAI<ResumeContent>(messages, openai);
    }

    return resume;
}