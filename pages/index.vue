<script setup lang="ts">
import type { Site } from '~/functions/src/shared';

const { locale } = useI18n();
const {
    $domain, $translate
} = useNuxtApp() as unknown as { $domain: string, $translate: Function };
const { fetchDomain } = useContent();

try {
    const { data: domainData } = await useAsyncData<Site>(
        'domain',
        async () => await fetchDomain($domain as string)
    );

    useHeadSafe({
        title: $translate(
            domainData.value?.seo.title,
            locale.value
        ),
        meta: [
            {
                hid: 'description',
                name: 'description',
                content: $translate(
                    domainData.value?.seo.description,
                    locale.value
                ),
            },
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
    <main class="mx-auto max-w-3xl">
        <sections-latest-articles-component />
    </main>
</template>