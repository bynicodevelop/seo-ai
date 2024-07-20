import type {
    Article, Category, locales, Site
} from '~/functions/src/shared';

const fetchDomain = async (domain: string): Promise<Site> => {
    const { data } = await $fetch(`/api/sites`, {
        headers: {
            'x-forwarded-host': domain,
            'host': domain
        }
    });
    return (data ?? {}) as Site;
}
const fetchCategories = async (domain: string): Promise<Category[]> => {
    const { data } = await $fetch(`/api/categories`, {
        headers: {
            'x-forwarded-host': domain,
            'host': domain
        }
    });
    return data as Category[];
};
const fetchCategory = async (
    domain: string, category: string, locale: locales
): Promise<Category> => {
    const { data } = await $fetch(`/api/categories/${category}?locale=${locale}`, {
        headers: {
            'x-forwarded-host': domain,
            'host': domain
        }
    });
    return (data ?? {}) as Category;
}
const fetchArticles = async (
    domain: string, category: string, locale: locales
): Promise<Article[]> => {
    const { data } = await $fetch(`/api/categories/${category}/articles?locale=${locale}`, {
        headers: {
            'x-forwarded-host': domain,
            'host': domain
        }
    });
    return (data ?? []) as Article[];
}
const fetchLatestArticles = async (
    domain: string, limit: number
): Promise<{
    article: Article,
    category: Category
}[]> => {
    const { data } = await $fetch(`/api/articles?limit=${limit}`, {
        headers: {
            'x-forwarded-host': domain,
            'host': domain
        }
    });
    return (data ?? []) as {
        article: Article,
        category: Category
    }[];
}
const fetchArticle = async (
    domain: string, category: string, content: string, locale: locales
): Promise<Article> => {
    const { data } = await $fetch(`/api/articles/${content}?categorySlug=${category}&locale=${locale}`, {
        headers: {
            'x-forwarded-host': domain,
            'host': domain
        }
    });
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