export default defineNuxtPlugin((nuxtApp) => {
    const url = useRequestURL();
    const domain = url.hostname;

    nuxtApp.provide('domain', domain);
});
