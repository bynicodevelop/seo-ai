import { ChatCompletionMessageParam } from "openai/resources";
import { addMessages, callOpenAI } from "../ai";
import OpenAI from "openai";
import { ResumeContent } from "../types/prompt";

export const promptResumeContent = (): string => `
Agissez en tant qu'expert en SEO.
Analysez le contenu qui vous est fourni en extrayant les informations les plus importantes
Créez un résumé complet du contenu qui sera utilisé dans le cadre de la rédaction d'un futur article.
Extrayez du contenu 5 mots clés principaux maximum.

Interdictions : 
- Ne pas citer la source
- Ne pas citer d'auteur
- Ne pas inclure de nom
- Ne pas faire de mise en forme

Vous retournez les informations au format json comme l'exemple qui suit : 

{
"resume": "...",
"keyword": ["...", "..."]
}
`;

export const resumeContentPrompt = async (content: string, openai: OpenAI): Promise<ResumeContent> => {
    const messages: ChatCompletionMessageParam[] = [];

    addMessages(messages, 'assistant', promptResumeContent());
    addMessages(messages, 'user', content);

    return await callOpenAI<ResumeContent>(messages, openai);
}