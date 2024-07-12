import type { Category, Content, Site } from "~/functions/src/shared";

const fetchDomain = async (domain: string): Promise<Site> => {
    const { data } = await $fetch(`/api/sites?name=${domain}`);
    return (data ?? {}) as Site;
}
const fetchCategories = async (domain: string): Promise<Category[]> => {
    const { data } = await $fetch(`/api/categories?name=${domain}`);
    return data as Category[];
};
const fetchCategory = async (domain: string, category: string): Promise<Category> => {
    const { data } = await $fetch(`/api/categories/${category}?name=${domain}`);
    return (data ?? {}) as Category;
}
const fetchContents = async (domain: string, category: string): Promise<Content[]> => {
    const { data } = await $fetch(`/api/contents?name=${domain}&categorySlug=${category}`);
    return (data ?? []) as Content[];
}
const fetchContent = async (domain: string, category: string, content: string): Promise<Content> => {
    const { data } = await $fetch(`/api/contents/${content}?name=${domain}&categorySlug=${category}`);
    return (data ?? {}) as Content;
}

export const useContent = () => {
    return {
        fetchDomain,
        fetchCategories,
        fetchCategory,
        fetchContents,
        fetchContent
    }
};