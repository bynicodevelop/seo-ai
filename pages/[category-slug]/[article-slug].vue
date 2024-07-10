<script setup lang="ts">
import type { Content } from '~/functions/src/shared';

const { locale } = useI18n();
const { params } = useRoute();
const { categoryslug, articleslug } = params as { categoryslug: string, articleslug: string };

const { $domain, $translate } = useNuxtApp() as any;
const { fetchContent } = useContent();

const content = ref<Content | null>(null);

try {
    const { data: contentData } = await useAsyncData<Content>('content', async () => await fetchContent($domain as string, categoryslug as string, articleslug as string));

    content.value = contentData.value;

    useHead({
        title: $translate(content.value?.seo.title, locale.value),
        meta: [
            {
                hid: 'description',
                name: 'description',
                content: $translate(content.value?.seo.description, locale.value),
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
            {{ $translate(content?.title, locale) }}
        </h1>

        <section>
            <tools-markdown-component :content="content?.content" />
        </section>
    </main>
</template>