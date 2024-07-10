<script setup lang="ts">
import type { Site } from '~/functions/src/shared';
const { locale } = useI18n();
const { $domain, $translate } = useNuxtApp() as any;
const { fetchDomain } = useContent();

const domain = ref<Site | null>(null);

try {
    const { data: domainData } = await useAsyncData<Site>('domain', async () => await fetchDomain($domain as string));

    domain.value = domainData.value;

    useHead({
        title: $translate(domain.value?.seo.title, locale.value),
        meta: [
            {
                hid: 'description',
                name: 'description',
                content: $translate(domain.value?.seo.description, locale.value),
            },
        ],
    });
} catch (error) {
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