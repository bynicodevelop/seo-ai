<script setup lang="ts">
import type { Article, locales } from '~/functions/src/shared';

const { locale } = useI18n();
const { params } = useRoute();
const { categoryslug, articleslug } = params as { categoryslug: string, articleslug: string };

const { $domain, $translate } = useNuxtApp() as any;
const { fetchContent } = useContent();

const article = ref<Article | null>(null);

try {
    const { data: contentData } = await useAsyncData<Article>(
        'article',
        async () => await fetchContent(
            $domain as string,
            categoryslug as string,
            articleslug as string,
            locale.value as locales
        )
    );

    article.value = contentData.value;

    useHead({
        title: $translate(article.value?.title, locale.value),
        meta: [
            {
                hid: 'description',
                name: 'description',
                content: $translate(article.value?.description, locale.value),
            },
        ],
    });
} catch (error) {
    throw createError({
        statusCode: 404,
        message: 'Content not found',
        fatal: true
    })
}
</script>
<template>
    <main>
        <h1>
            {{ $translate(article?.title, locale) }}
        </h1>

        <section>
            <tools-markdown-component :content="article?.article" />
        </section>
    </main>
</template>