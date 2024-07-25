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
  <main>
    <header>
      <h3>
        {{ $t('pages.categories.title') }}
      </h3>
      <p>
        {{ $t('pages.categories.description') }}
      </p>
    </header>
    <section>
      <template v-if="categories && categories?.length > 0">
        <article v-for="(category, index) in categories" :key="index">
          <h2>
            <NuxtLink :to="localePath(`/categories/${$translate(category.slug, locale)}`)">
              {{ $translate(category.title, locale) }}
            </NuxtLink>
          </h2>
          <p>{{ $translate(category.description, locale) }}</p>
        </article>
      </template>

      <div v-else class="empty-content">
        <p>{{ $t('pages.categories.no_categories') }}</p>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
main {
  @apply grid space-y-10 lg:grid-cols-6;

  header {
    @apply lg:col-span-2;

    h3 {
      @apply text-base font-semibold leading-6 text-gray-900;
    }

    p {
      @apply mt-1 text-sm text-gray-500;
    }
  }

  section {
    @apply lg:col-span-3 lg:col-start-4;

    article {
      @apply space-y-3 pb-5;

      h2 {
        @apply text-xl font-semibold;
      }

      p {
        @apply text-base text-gray-700;
      }
    }

    .empty-content {
      @apply flex items-center justify-center h-36;

      p {
        @apply text-gray-500;
      }
    }
  }
}
</style>