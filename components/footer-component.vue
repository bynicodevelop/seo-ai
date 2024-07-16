<script setup lang="ts">
import type { Category, Site } from '~/functions/src/shared';

const { locale } = useI18n();
const localePath = useLocalePath();
const { $domain, $translate } = useNuxtApp() as any;
const { fetchCategories, fetchDomain } = useContent();

const show = ref(false);

const { data: site } = await useAsyncData<Site>('domain', async () => await fetchDomain($domain as string));

const copyRightDate = new Date().getFullYear();

</script>

<template>
  <footer class="pt-12">
    <div class="container mx-auto px-8">
      <div class="flex flex-wrap relative">
        <div
          class="-mx-4 flex flex-col flex-wrap items-center pl-4 pr-8 py-4 md:flex-col md:flex-nowrap -mt-4 lg:items-start lg:w-1/3">

          <NuxtLink class="-ml-6" to="/">
            <div to="/" class="font-serif inline-flex items-center text-3xl">
              <h6 class="font-serif inline-flex items-center text-3xl">
                {{ $translate(site?.seo.title, locale) }}
              </h6>
            </div>
          </NuxtLink>
          <p class="mt-2 text-center w-full lg:text-left">
            {{ $translate(site?.seo.description, locale) }}
          </p>
          <div class="inline-flex mt-6 space-x-3">
            <div class="flex flex-wrap space-x-4">
            </div>
          </div>
          <div class="my-6 text-center">
            <NuxtLink to="/">hello@seo.com</NuxtLink>
          </div>
        </div>
        <div class="flex flex-col items-center p-4 w-full sm:w-1/2 md:flex-1 md:w-1/3 lg:items-start">
          <h2 class="font-bold text-primary-600 dark:text-primary-200 text-xl">
            General
          </h2>
          <ul class="text-center lg:mt-2 lg:text-left">
            <li class="mb-4">
              <NuxtLink to="/faq" class="hover:text-primary-600 dark:text-primary-200">FAQ</NuxtLink>
            </li>
            <li class="mb-4">
              <NuxtLink to="/contact" class="hover:text-primary-600 dark:text-primary-200">Contact Us</NuxtLink>
            </li>
          </ul>
        </div>
        <div class="flex flex-col items-center p-4 w-full sm:w-1/2 md:flex-1 md:w-1/3 lg:items-start">
          <h2 class="font-bold text-primary-600 dark:text-primary-200 text-xl">
            Links
          </h2>
          <ul class="text-center lg:mt-2 lg:text-left">
            <li class="mb-4">
              <NuxtLink to="/articles" class="hover:text-primary-600 dark:text-primary-200">Articles</NuxtLink>
            </li>
            <li class="mb-4">
              <NuxtLink to="/blog" class="hover:text-primary-600 dark:text-primary-200">Blog</NuxtLink>
            </li>
          </ul>
        </div>
        <div class="flex flex-col sm:w-full md:items-end">
          <hr class="mb-4 opacity-25" />
          <p class="py-1 text-sm sm:text-center">
            &copy; {{ copyRightDate }} - {{ $t('components.footer.all_rights_reserved') }} - {{
              $translate(site?.seo.title, locale) }}
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
<style scoped></style>
