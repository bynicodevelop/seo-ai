export default defineI18nLocale(async locale => {
    return {
        pages: {
            error: {
                statusCode400: {
                    title: 'Requête incorrecte',
                },
                statusCode401: {
                    title: 'Non autorisé',
                },
                statusCode403: {
                    title: 'Interdit',
                },
                statusCode404: {
                    title: 'Page non trouvée',
                },
                statusCode500: {
                    title: 'Erreur interne du serveur',
                },
                other: {
                    title: 'Une erreur est survenue',
                },
                message: 'Désolé, nous n’avons pas pu trouver la page que vous recherchez.',
                backToHome: 'Retour à l’accueil'
            }
        }
    }
});