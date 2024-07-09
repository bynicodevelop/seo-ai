import type { Category } from "~/shared/types/category";
import type { Domain } from "~/shared/types/domain";


const fetchDomain = async (domain: string): Promise<Domain> => {
    const { data } = await $fetch(`/api/domains?name=${domain}`);
    return (data ?? {}) as Domain;
}
const fetchCategories = async (domain: string): Promise<Category[]> => {
    const { data } = await $fetch(`/api/categories?name=${domain}`);
    return data as Category[];
};
const fetchCategory = async (domain: string, category: string): Promise<Category> => {
    const { data } = await $fetch(`/api/categories/${category}?name=${domain}`);
    return (data ?? {}) as Category;
}

export const useContent = () => {
    return {
        fetchDomain,
        fetchCategories,
        fetchCategory,
    }
};