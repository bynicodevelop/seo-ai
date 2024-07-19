<script setup lang="ts">
import type {
    Article, Category
} from '~/functions/src/shared';

const runtimeConfig = useRuntimeConfig();
const { $domain } = useNuxtApp() as unknown as {
    $domain: string
};
const { fetchLatestArticles } = useContent();

const articles = ref<{
    article: Article,
    category: Category
}[]>([]);

try {
    const { data: latestArticles } = await useAsyncData<{
        article: Article,
        category: Category
    }[]>(
        'latestArticles',
        async () => await fetchLatestArticles(
            $domain as string,
            runtimeConfig.public.limitArticles
        )
    );

    articles.value = latestArticles.value || [];
} catch (error) {
    console.log(error);

    throw createError({
            statusCode: 404,
            message: 'Articles not found',
            fatal: true
        });
}
</script>

<template>
    <section class="space-y-4">
        <h5>{{ $t('components.latestArticle.title') }}</h5>
        <blocks-articles-component
v-for="(article, index) in articles"
:key="index"
:article="article" />
    </section>
</template>