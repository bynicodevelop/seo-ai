<script setup lang="ts">
import type { Domain } from '~/shared/types/domain';
const { locale } = useI18n();
const { $domain, $translate } = useNuxtApp() as any;
const { fetchDomain } = useContent();

const { data: domain } = await useAsyncData<Domain>('domain', async () => await fetchDomain($domain as string));

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
</script>

<template>
    {{ $domain }}
    home
</template>