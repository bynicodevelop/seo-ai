<script setup lang="ts">
import type { Site } from '~/functions/src/shared';

const localePath = useLocalePath();
const { getTranslatedValue } = useUtils();
const { getBaseUrl } = useUtils();
const { $domain } = useNuxtApp() as unknown as { $domain: string };
const { fetchDomain } = useContent();

try {
    const { data: domainData } = await useAsyncData<Site>(
        'domain',
        async () => await fetchDomain($domain as string)
    );

    const title = getTranslatedValue(domainData.value?.seo.title);
    const description = getTranslatedValue(domainData.value?.seo.description);

    useHeadSafe({
        title,
        meta: [
            {
                name: 'description',
                content: description,
            },
            {
                name: 'og:title',
                content: title,
            },
            {
                name: 'og:description',
                content: description,
            },
            {
                name: 'og:url',
                content: getBaseUrl(localePath('/')),
            },
            {
                name: 'og:type',
                content: 'website',
            },
            {
                name: 'twitter:title',
                content: title,
            },
            {
                name: 'twitter:description',
                content: description,
            },
            {
                name: 'twitter:url',
                content: getBaseUrl(localePath('/')),
            },
            {
                name: 'twitter:card',
                content: 'summary_large_image',
            }
        ],
    });

    useSchemaOrg([
        defineWebPage(),
    ]);
} catch (error) {
    console.log(error);

    throw createError({
        statusCode: 404,
        message: 'Domain not found',
        fatal: true
    });
}
</script>

<template>
    <main>
        <sections-latest-articles-component />
    </main>
</template>

<style scoped lang="scss">
main {
    @apply mx-auto max-w-3xl;
}
</style>