<script setup lang="ts">
import { ref } from 'vue';

import { 
  useI18n, useLocalePath, useNuxtApp, useAsyncData, useContent 
} from '#imports';
import type { Category } from '~/functions/src/shared';

const { locale } = useI18n();
const localePath = useLocalePath();
const { $translate } = useNuxtApp() as {
  $translate: (key: string, locale: string) => string;
};
const { fetchCategories } = useContent();

const categories = ref<Category[]>([]);

const fetchCategoriesData = async () => {
  try {
    const { data } = await useAsyncData<Category[]>(
      'categories',
      async () => await fetchCategories()
    );
    categories.value = data.value || [];
  } catch (error) {
    console.error(
      'Failed to fetch categories:',
error
);
    categories.value = [];
  }
};

fetchCategoriesData();
</script>

<template>
  <section class="container mx-auto space-y-4">
    <h1>{{ $t('pages.categories.title') }}</h1>
    <div v-if="categories && categories.length > 0" class="space-y-4">
      <div v-for="(category, index) in categories" :key="index" class="p-4 border rounded-lg">
        <h2 class="text-lg font-semibold">
          <NuxtLink :to="localePath(`/categories/${category.slug}`)">
            {{ $translate(category.title, locale) }}
          </NuxtLink>
        </h2>
        <p>{{ $translate(category.description, locale) }}</p>
      </div>
    </div>
    <div v-else>
      <p>{{ $t('pages.categories.no_categories') }}</p>
    </div>
  </section>
</template>