export const useUtils = () => {
    const getCanonical = () => {
        const route = useRoute();
        const url = useRequestURL();
        const baseUrl = url.protocol + '//' + url.host

        return baseUrl + route.path;
    };

    return {
        getCanonical
    }
}