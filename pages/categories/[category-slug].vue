<script setup lang="ts">
import type { Article, Category, locales } from '~/functions/src/shared';

const { locale } = useI18n();
const localePath = useLocalePath();
const { params } = useRoute();
const { categoryslug } = params as { categoryslug: string };

const { $domain, $translate } = useNuxtApp() as any;
const { fetchCategory, fetchContents } = useContent();

const category = ref<Category | null>(null);
const articles = ref<Article[] | null>([]);

try {
    const { data: categoryData } = await useAsyncData<Category>('category', async () => await fetchCategory($domain as string, categoryslug as string, locale.value as locales));
    const { data: contentsData } = await useAsyncData<Article[]>('articles', async () => await fetchContents($domain as string, categoryslug as string, locale.value as locales));

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
    <main>
        <header class="bg-white px-4 py-5 sm:px-6">
            <div class="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
                <div class="ml-4 mt-4">
                    <h3 class="text-base font-semibold leading-6 text-gray-900">
                        {{ $translate(category?.title, locale) }}
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">
                        {{ $translate(category?.description, locale) }}
                    </p>
                </div>
            </div>
        </header>
        <section>
            <article v-for="(article, index) in articles" :key="index">
                <h2>
                    <NuxtLink :to="localePath(`/${categoryslug}/${$translate(article.slug, locale)}`)"
                        :title="$translate(article.title, locale)">
                        {{ $translate(article.title, locale) }}
                    </NuxtLink>
                </h2>
                <p>{{ $translate(article.summary, locale) }}</p>
            </article>
        </section>
    </main>
</template>