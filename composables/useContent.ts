import type { Category } from "~/shared/types/category";
import type { Domain } from "~/shared/types/domain";


const fetchDomain = async (domain: string) => {
    const { data } = await $fetch(`/api/domains?name=${domain}`);
    return (data ?? {}) as Domain;
}
const fetchCategories = async (domain: string) => {
    const { data } = await $fetch(`/api/categories?name=${domain}`);
    return data as Category[];
};

export const useContent = () => {
    return {
        fetchDomain,
        fetchCategories
    }
};