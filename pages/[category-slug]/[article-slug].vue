<script setup lang="ts">
import type {
    Article, locales
} from '~/functions/src/shared';

const localePath = useLocalePath();
const { locale } = useI18n();
const { params } = useRoute();
const {
    getBaseUrl, getTranslatedValue
} = useUtils();
const {
    categoryslug, articleslug
} = params as { categoryslug: string, articleslug: string };
const {
    $domain, $translate
} = useNuxtApp() as unknown as { $domain: string, $translate: Function };
const { fetchArticle } = useContent();

const article = ref<Article | null>(null);

try {
    const { data: contentData } = await useAsyncData<Article>(
        'article',
        async () => await fetchArticle(
            $domain as string,
            categoryslug as string,
            articleslug as string,
            locale.value as locales
        )
    );

    article.value = contentData.value;

    const title = getTranslatedValue(contentData.value?.title);
    const description = getTranslatedValue(contentData.value?.description);

    useHeadSafe({
        title,
        meta: [
            {
                name: 'description',
                content: description,
            },
            {
                name: 'keywords',
                content: $translate(
                    article.value?.keywords,
                    locale.value
                ),
            },
            {
                name: 'og:title',
                content: title,
            },
            {
                name: 'og:description',
                content: description,
            },
            {
                name: 'og:url',
                content: getBaseUrl(localePath(`/${categoryslug}/${getTranslatedValue(contentData.value?.slug)}`)),
            },
            {
                name: 'og:type',
                content: 'article',
            },
            {
                name: 'twitter:title',
                content: title,
            },
            {
                name: 'twitter:description',
                content: description,
            },
            {
                name: 'twitter:url',
                content: getBaseUrl(localePath(`/${categoryslug}/${getTranslatedValue(contentData.value?.slug)}`)),
            },
            {
                name: 'twitter:card',
                content: 'summary_large_image',
            }
        ],
    });

    useSchemaOrg([
        defineArticle({
            'datePublished': article.value?.createdAt,
            'dateModified': article.value?.updatedAt,
        })
    ]);
} catch (error) {
    throw createError({
        statusCode: 404,
        message: 'Content not found',
        fatal: true
    })
}
</script>
<template>
    <main class="mx-auto max-w-3xl">
        <h1 class="text-3xl font-bold text-gray-800">
            {{ $translate(article?.title, locale) }}
        </h1>

        <section>
            <tools-markdown-component :content="article?.article" />
        </section>
    </main>
</template>