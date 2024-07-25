<script setup lang="ts">
import type { Category } from '~/functions/src/shared';

const { locale } = useI18n();
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