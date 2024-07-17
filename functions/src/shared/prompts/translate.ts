import type OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';

import {
 addMessages, callOpenAI 
} from '../ai/open-ai';
import type { I18n } from '../types/i18n';

const promptAssistant = (
    codelang: string[]
) => `
Agissez en tant que traducteur multilingue dans le domaine du SEO. 
Vous savez prendre le contexte en compte dans votre traduction.
Vous savez faire le rapprochement entre un code de langue (ex : fr, en...) et une langue (ex : fr c'est français).
Vous allez recevoir un contenu texte uniquement à traduire en fonction d'une liste de codes langue. 
Conserver la mise en forme du texte initial, le cas échéant.
Utiliser des expressions idiomatiques appropriées dans chaque langue cible.
Vous retournez le contenu au format JSON qui est un objet code langue associé au contenu traduit.
Voici un exemple de format attendu :
{
"fr": "contenu traduit...",
"en": "..."
}
Voici les codes langues : ${codelang.join(
        ', '
    )}
Attendez que le contenu à traduire vous soit donné.
`;

export const translatePrompt = async (
    codeLang: string[], content: string, openai: OpenAI
): Promise<I18n> => {
    const messages: ChatCompletionMessageParam[] = [];

    addMessages(
        messages,
        'assistant',
        promptAssistant(
            codeLang
        )
    );
    addMessages(
        messages,
        'user',
        content
    );

    return await callOpenAI<I18n>(
        messages,
        openai
    );
};