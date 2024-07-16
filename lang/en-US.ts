export default defineI18nLocale(async locale => {
    return {
        pages: {
            error: {
                statusCode400: {
                    title: 'Bad request',
                },
                statusCode401: {
                    title: 'Unauthorized',
                },
                statusCode403: {
                    title: 'Forbidden',
                },
                statusCode404: {
                    title: 'Page not found',
                },
                statusCode500: {
                    title: 'Internal server error',
                },
                other: {
                    title: 'An error occurred',
                },
                message: 'Sorry, we couldn’t find the page you’re looking for.',
                backToHome: 'Back to home'
            }
        },
        components: {
            footer: {
                all_rights_reserved: 'All rights reserved'
            }
        }
    }
});