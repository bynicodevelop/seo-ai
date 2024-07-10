export const prompt = (config: { [key: string]: string }) => `
Agissez en tant qu'expert SEO. 
Sur la base d'informations au format JSON donnés ci-dessous, vous allez configurer :

1. Un titre optimisé pour le SEO entre 50 et 60 caractères maximum. Inclure le mot-clé principal au début du titre. Utilise également des mots-clés LSI (Latent Semantic Indexing) pour enrichir le titre sans le surcharger.

2. Créer une méta description entre 150 et 160 caractères maximum. Inclure des mots-clés pertinents mais éviter le bourrage de mots-clés.

3. Retourner les information au format JSON : 

\`\`\`json
{
"title": "",
"description": ""
}
\`\`\`

Voici les informations qui te sont fourni pour ta tâche : 
${JSON.stringify(config)}
`;