export default defineNuxtPlugin(nuxtApp => nuxtApp.provide(
    'domain',
    useRequestHeader('x-forwarded-host') || 'localhost'
))
