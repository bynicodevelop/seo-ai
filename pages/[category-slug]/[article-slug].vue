<script setup lang="ts">
import type {
 Article, locales 
} from '~/functions/src/shared';

const { locale } = useI18n();
const { params } = useRoute();
const {
 categoryslug, articleslug 
} = params as { categoryslug: string, articleslug: string };

const {
 $domain, $translate 
} = useNuxtApp() as unknown as { $domain: string, $translate: Function };
const { fetchArticle } = useContent();

const article = ref<Article | null>(
    null
);

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

    useHead(
        {
            title: $translate(
                article.value?.title,
                locale.value
            ),
            meta: [
                {
                    name: 'description',
                    content: $translate(
                        article.value?.description,
                        locale.value
                    ),
                },
                {
                    name: 'keywords',
                    content: $translate(
                        article.value?.keywords,
                        locale.value
                    ),
                }
            ],
        }
    );

    useSchemaOrg(
        [
            defineArticle(
                {
                    'datePublished': article.value?.createdAt,
                    'dateModified': article.value?.updatedAt,
                }
            )
        ]
    );
} catch (error) {
    throw createError(
        {
            statusCode: 404,
            message: 'Content not found',
            fatal: true
        }
    )
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