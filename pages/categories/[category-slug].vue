<script setup lang="ts">
import type { Article, Category, locales } from '~/functions/src/shared';

const { locale } = useI18n();
const { params } = useRoute();
const { categoryslug } = params as { categoryslug: string };

const { $domain, $translate } = useNuxtApp() as any;
const { fetchCategory, fetchArticles } = useContent();

const category = ref<Category | null>(null);
const articles = ref<Article[] | null>([]);

try {
    const { data: categoryData } = await useAsyncData<Category>('category', async () => await fetchCategory($domain as string, categoryslug as string, locale.value as locales));
    const { data: contentsData } = await useAsyncData<Article[]>('articles', async () => await fetchArticles($domain as string, categoryslug as string, locale.value as locales));

    category.value = categoryData.value;
    articles.value = contentsData.value;

    useHead({
        title: $translate(category.value?.title, locale.value),
        meta: [
            {
                name: 'description',
                content: $translate(category.value?.description, locale.value),
            },
        ],
    });

    const articlesItems: any[] = [];

    if (!articles.value?.hasOwnProperty('message')) {
        articles.value?.forEach((article) => {
            articlesItems.push({
                '@type': 'ListItem',
                'position': articlesItems.length + 1,
                'url': `${$domain}/${categoryslug}/${$translate(article.slug, locale.value)}`,
                'name': $translate(article.title, locale.value),
            });
        });
    }

    useSchemaOrg([
        defineItemList({
            '@type': 'ItemList',
            'itemListElement': articlesItems,
        }),
        defineWebPage({
            '@type': 'CollectionPage'
        }),
    ])
} catch (error) {
    console.log(error);

    throw createError({
        statusCode: 404,
        message: 'Category not found',
        fatal: true
    });
}
</script>

<template>
    <main class="space-y-6 mx-auto max-w-3xl">
        <header>
            <h3 class="text-base font-semibold leading-6 text-gray-900">
                {{ $translate(category?.title, locale) }}
            </h3>
            <p class="mt-1 text-sm text-gray-500">
                {{ $translate(category?.description, locale) }}
            </p>
        </header>
        <section>
            <blocks-articles-component v-if="articles?.length" v-for="(article, index) in articles" :key="index"
                :article="{
                    article: article as Article,
                    category: category as Category
                }" />

            <div v-else class="flex items-center justify-center h-36">
                <p class="text-gray-500">{{ $t('pages.categories.no_articles') }}</p>
            </div>
        </section>
    </main>
</template>