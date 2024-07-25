<script setup lang="ts">
import type { Category } from '~/functions/src/shared';

const {
  locale, t
} = useI18n();
const { getBaseUrl } = useUtils();
const localePath = useLocalePath();
const {
  $domain, $translate
} = useNuxtApp() as unknown as {
  $domain: string,
  $translate: Function
};
const { fetchCategories } = useContent();
const categories = ref<Category[]>([]);

try {
  const { data } = await useAsyncData<Category[]>(
    'categories',
    async () => await fetchCategories($domain)
  );

  categories.value = data.value || [];

  useHeadSafe({
    title: t('pages.categories.title'),
    meta: [
      // TODO: Pour description Dépend de la branche : https://github.com/bynicodevelop/seo-ai/pull/98
      {
        name: 'og:title',
        content: t('pages.categories.title'),
      },
      // TODO: Pour og:description Dépend de la branche : https://github.com/bynicodevelop/seo-ai/pull/98
      {
        name: 'og:url',
        content: getBaseUrl(localePath('/categories')),
      },
      {
        name: 'og:type',
        content: 'category',
      },
      {
        name: 'twitter:title',
        content: t('pages.categories.title'),
      },
      // TODO: Pour twitter:description Dépend de la branche : https://github.com/bynicodevelop/seo-ai/pull/98
      {
        name: 'twitter:url',
        content: getBaseUrl(localePath('/categories')),
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      }
    ],
  });

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
  <main class="container mx-auto space-y-4">
    <header>
      <h1>{{ $t('pages.categories.title') }}</h1>
    </header>
    <section v-if="categories && categories.length > 0" class="space-y-4">
      <div v-for="(category, index) in categories" :key="index" class="p-4 border rounded-lg">
        <h2 class="text-lg font-semibold">
          <NuxtLink :to="localePath(`/categories/${$translate(category.slug, locale)}`)">
            {{ $translate(category.title, locale) }}
          </NuxtLink>
        </h2>
        <p>{{ $translate(category.description, locale) }}</p>
      </div>
    </section>
    <section v-else>
      <p>{{ $t('pages.categories.no_categories') }}</p>
    </section>
  </main>
</template>