export type ArticlePrompt = {
    title: string;
    keywords: string[];
    description: string;
    article: string;
    summary: string;
    slug: string;
};

export function articlePromptFactory(
    title: string,
    keywords: string[],
    description: string,
    article: string,
    summary: string,
    slug: string
): ArticlePrompt {
    return {
        title,
        keywords,
        description,
        article,
        summary,
        slug
    };
}