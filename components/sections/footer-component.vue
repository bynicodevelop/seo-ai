<script setup lang="ts">
import type { Site } from '~/functions/src/shared';

const localePath = useLocalePath();
const { locale } = useI18n();
const {
  $domain, $translate
} = useNuxtApp();
const { fetchDomain } = useContent();

const siteRef = ref<Site | null>(null);

const copyRightDate = new Date().getFullYear();

try {
  const { data: site } = await useAsyncData<Site>(
    'domain',
    async () => await fetchDomain($domain as string)
  );

  siteRef.value = site.value;

} catch (error) {
  console.log(error);

  throw createError({
    statusCode: 404,
    message: 'Domain not found',
    fatal: true
  });
}

</script>

<template>
  <footer class="container mx-auto space-x-10 relative items-center grid grid-cols-3">
    <div class="flex flex-col text-center md:flex-col lg:text-left space-y-2 col-span-3 lg:col-span-1">
      <h6 class="text-lg">
        <NuxtLink :to="localePath('/')">
          {{ $translate(siteRef?.seo.title, locale) }}
        </NuxtLink>
      </h6>
      <p>{{ $translate(siteRef?.seo.description, locale) }}</p>
    </div>
    <div class="flex flex-col items-center col-span-3 lg:col-span-2">
      <p class="text-sm text-center">
        &copy; {{ copyRightDate }} - {{ $t('components.footer.all_rights_reserved') }} - {{
          $translate(siteRef?.seo.title, locale) }}
      </p>
    </div>
  </footer>
</template>
