import type {
 Article, Category, locales, Site 
} from '~/functions/src/shared';

const fetchDomain = async (
    domain: string
): Promise<Site> => {
    const { data } = await $fetch(
        `/api/sites?domain=${domain}`
    );
    return (data ?? {}) as Site;
}
const fetchCategories = async (
    domain: string
): Promise<Category[]> => {
    const { data } = await $fetch(
        `/api/categories?domain=${domain}`
    );
    return data as Category[];
};
const fetchCategory = async (
    domain: string, category: string, locale: locales
): Promise<Category> => {
    const { data } = await $fetch(
        `/api/categories/${category}?domain=${domain}&locale=${locale}`
    );
    return (data ?? {}) as Category;
}
const fetchArticles = async (
domain: string, category: string, locale: locales
): Promise<Article[]> => {
    const { data } = await $fetch(
`/api/categories/${category}/articles?domain=${domain}&locale=${locale}`
);
    return (data ?? []) as Article[];
}
const fetchLatestArticles = async (
domain: string, limit: number
): Promise<{
    article: Article,
    category: Category
}[]> => {
    const { data } = await $fetch(
`/api/articles?domain=${domain}&limit=${limit}`
);
    return (data ?? []) as {
        article: Article,
        category: Category
    }[];
}
const fetchArticle = async (
domain: string, category: string, content: string, locale: locales
): Promise<Article> => {
    const { data } = await $fetch(
`/api/articles/${content}?domain=${domain}&categorySlug=${category}&locale=${locale}`
);
    return (data ?? {}) as Article;
}

export const useContent = () => {
    return {
        fetchArticle,
        fetchArticles,
        fetchCategories,
        fetchCategory,
        fetchDomain,
        fetchLatestArticles
    }
};