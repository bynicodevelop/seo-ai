<script setup lang="ts">
import type { Site } from '~/functions/src/shared';

const localePath = useLocalePath();
const { locale } = useI18n();
const {
    $domain, $translate
} = useNuxtApp() as unknown as { $domain: string, $translate: Function };
const { fetchDomain } = useContent();
const { getCanonical } = useUtils();

const url = useRequestURL();
const baseUrl = url.protocol + '//' + url.host;

try {
    const { data: domainData } = await useAsyncData<Site>(
        'domain',
        async () => await fetchDomain($domain as string)
    );

    useHead({
        htmlAttrs: { lang: locale.value, },
        title: $translate(
            domainData.value?.seo.title,
            locale.value
        ),
        meta: [
            {
                name: 'description',
                content: $translate(
                    domainData.value?.seo.description,
                    locale.value
                ),
            },
        ],
        link: [
            {
                rel: 'canonical',
                href: localePath(getCanonical()),
            }
        ],
        templateParams: { schemaOrg: { host: baseUrl, } },
    });

    const organization = {
        name: $translate(
            domainData.value?.seo.title,
            locale.value
        ),
    }

    useSchemaOrg([
        defineOrganization(organization),
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
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
