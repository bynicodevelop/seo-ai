<script setup lang="ts">
import type {
    Category, Article
} from '~/functions/src/shared';

const localePath = useLocalePath();
const { locale } = useI18n();
const { $translate } = useNuxtApp() as unknown as {
    $translate: Function
};
defineProps<{
    article: {
        article: Article,
        category: Category
    }
}>();

const haveSlug = (article: {
    article: Article,
    category: Category
}): boolean => !!article.article.slug && !!article.category.slug;
</script>

<template>
    <article v-if="haveSlug(article)">
        <h2>
            <nuxt-link
                :to="localePath(`/${$translate(article.category.slug, locale)}/${$translate(article.article.slug, locale)}`)">
                {{ $translate(article.article.title, locale) }}
            </nuxt-link>
        </h2>
        <p>{{ $translate(article.article.summary, locale) }}</p>
    </article>
</template>

<style scoped lang="scss">
article {
    @apply space-y-3 pb-5;

    h2 {
        @apply text-xl font-semibold;
    }

    p {
        @apply text-base text-gray-700;
    }
}
</style>