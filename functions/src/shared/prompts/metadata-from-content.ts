export const promptMetadataFromContent = (siteContent: string, keywords: string[], content: string): string => `
Agissez en tant qu'expert SEO.
Vous allez avoir des informations sur le site où des contenus seront rédigés.
Vous allez analyser le contenu en dessous dans le but d'extraire des information pour optimiser le SEO d'un futur article.

Votre tâche n'est pas de rédiger un article.

1. Extraire 10 mots clés en fonction de la thématique du site et des mots clés majeurs. Vous prendrez le temps pour choisir au mieux les mots clés.
2. Vous rédigerez au format texte, en français, un résumé du contenu que vous avez analysé
3. Vous retournez le contenu au format JSON avec les propriété suivante :

\`\`\`json
{
  "summary": "",
  "keyworks": ["keyword ", "..."]
}
\`\`\`

Voici la thématique du site : ${siteContent}

Voici les mots clés majeurs : ${keywords.join(', ')}

Voici le contenu à analyser : ${content}
`;