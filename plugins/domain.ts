export default defineNuxtPlugin(nuxtApp => {
    console.log(
'domain plugin',
useRequestHeader('x-forwarded-host') || 'localhost'
);

    nuxtApp.provide(
        'domain',
        useRequestHeader('x-forwarded-host') || 'localhost'
    );
})
