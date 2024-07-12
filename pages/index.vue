<script setup lang="ts">
import type { Site } from '~/shared';
const { locale } = useI18n();
const { $domain, $translate } = useNuxtApp() as any;
const { fetchDomain } = useContent();

try {
    const { data: domainData } = await useAsyncData<Site>('domain', async () => await fetchDomain($domain as string));

    useHead({
        title: $translate(domainData.value?.seo.title, locale.value),
        meta: [
            {
                hid: 'description',
                name: 'description',
                content: $translate(domainData.value?.seo.description, locale.value),
            },
        ],
    });
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
        <h1>
            home
        </h1>
    </main>
</template>