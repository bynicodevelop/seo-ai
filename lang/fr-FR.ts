export default defineI18nLocale(() => {
    return {
        pages: {
            error: {
                statusCode400: { title: 'Requête incorrecte', },
                statusCode401: { title: 'Non autorisé', },
                statusCode403: { title: 'Interdit', },
                statusCode404: { title: 'Page non trouvée', },
                statusCode500: { title: 'Erreur interne du serveur', },
                other: { title: 'Une erreur est survenue', },
                message: 'Désolé, nous n’avons pas pu trouver la page que vous recherchez.',
                backToHome: 'Retour à l’accueil'
            },
            categories: {
                no_articles: 'Aucun article trouvé',
                title: 'Categories',
                description: 'Retrouvez toutes les catégories de notre blog.',
                no_categories: 'Aucunes catégories trouvées'
            }
        },
        components: {
            latestArticle: { title: 'Derniers articles' },
            footer: { all_rights_reserved: 'Tous droits réservés' },
            navigation: {
                open_menu: 'Ouvrir le menu',
                close_menu: 'Fermer le menu',
            }
        }
    }
});