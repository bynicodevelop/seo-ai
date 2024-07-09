<script setup lang="ts">
import type { Domain } from '~/shared/types/domain';
const { locale } = useI18n();
const { $domain, $translate } = useNuxtApp() as any;
const { fetchDomain } = useContent();

const domain = ref<Domain | null>(null);

try {
    const { data: domainData } = await useAsyncData<Domain>('domain', async () => await fetchDomain($domain as string));

    domain.value = domainData.value;

    useHead({
        title: $translate(domain.value?.title, locale.value),
        meta: [
            {
                hid: 'description',
                name: 'description',
                content: $translate(domain.value?.description, locale.value),
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