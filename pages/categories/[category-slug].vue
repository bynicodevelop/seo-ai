<script setup lang="ts">
import type { Category } from '~/shared/types/category';

const { locale } = useI18n();
const { params } = useRoute();
const { categoryslug } = params;

const { $domain, $translate } = useNuxtApp() as any;
const { fetchCategory } = useContent();

const { data: category } = await useAsyncData<Category>('category', async () => await fetchCategory($domain as string, categoryslug as string));

useHead({
    title: $translate(category.value?.name, locale.value),
    meta: [
        {
            hid: 'description',
            name: 'description',
            content: $translate(category.value?.description, locale.value),
        },
    ],
});
</script>

<template>
    <pre>
        {{ category }}
    </pre>
</template>