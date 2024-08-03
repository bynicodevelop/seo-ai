import axios from 'axios';
import prompts from 'prompts';

const createSite = async () => {
    const response = await prompts([
        {
            type: 'text',
            name: 'sitename',
            message: 'Nom du site',
        },
        {
            type: 'text',
            name: 'domain',
            message: 'Domaine du site (ex: https://google.com)',
            initial: 'http://localhost:3000'
        },
        {
            type: 'text',
            name: 'keywords',
            message: 'Mots-clés (séparés par des virgules)',
        },
        {
            type: 'text',
            name: 'description',
            message: 'Description du site',
        },
        {
            type: 'text',
            name: 'locales',
            message: 'Langues séparées par des virgules (ex: fr,en)',
        }
    ]);

    const {
        sitename, domain, keywords, description, locales
    } = response;

    const siteConfig = {
        sitename,
        domain,
        keywords: keywords.split(',').map((keyword: string) => keyword.trim()).filter((keyword: string) => keyword.length > 0),
        description,
        locales: locales.split(',').map((locale: string) => locale.trim()),
    };

    const { data } = await axios.post(
        `${domain}/api/services/sites`,
        siteConfig
    );

    console.log(data);
};

const createArticle = async () => {
    const response = await prompts([
        {
            type: 'text',
            name: 'siteId',
            message: 'Domaine du site (ex: https://google.com)',
            initial: 'http://localhost:3000'
        },
        {
            type: 'text',
            name: 'resume',
            message: 'Resumé de l\'article',
        },
    ]);

    const {
        siteId, resume
    } = response;

    const domainUrl = siteId[siteId.length - 1] === '/' ? siteId.slice(
        0,
        -1
    ) : siteId;
    const domain = siteId.split('/')[2].split(':')[0];

    const articleConfig = {
        domain,
        resume,
    };

    console.log(domainUrl);


    const { data } = await axios.post(
        `${domainUrl}/api/services/articles`,
        articleConfig
    );

    console.log(data);
};

(async () => {
    const INITIAL_OPTIONS = {
        CREATE_SITE: 'CREATE_SITE',
        CREATE_ARTICLE: 'CREATE_ARTICLE',
    }

    const response = await prompts({
        type: 'autocomplete',
        name: 'response',
        message: 'Que voulez-vous faire ?',
        choices: [
            {
                title: 'Créer un article',
                value: INITIAL_OPTIONS.CREATE_ARTICLE
            },
            {
                title: 'Créer un site',
                value: INITIAL_OPTIONS.CREATE_SITE
            },
        ],
        initial: 0
    });

    switch (response.response) {
        case INITIAL_OPTIONS.CREATE_SITE:
            await createSite();
            break;
        case INITIAL_OPTIONS.CREATE_ARTICLE:
            await createArticle();
            break;
        default:
            console.log('Aucune action trouvée');
            break;
    }
})();

