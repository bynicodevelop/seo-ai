<script setup lang="ts">
import type { Site } from '~/functions/src/shared';

const { locale } = useI18n();
const { $domain, $translate } = useNuxtApp() as any;
const { fetchDomain } = useContent();

const { data: site } = await useAsyncData<Site>('domain', async () => await fetchDomain($domain as string));

const copyRightDate = new Date().getFullYear();

</script>

<template>
  <footer class="container mx-auto space-x-10 flex flex-wrap relative items-center">
    <div class="flex flex-col text-center md:flex-col lg:w-1/3 lg:text-left space-y-2">
      <h6 class="text-lg">
        <NuxtLink to="/">
          {{ $translate(site?.seo.title, locale) }}
        </NuxtLink>
      </h6>
      <p>{{ $translate(site?.seo.description, locale) }}</p>
    </div>
    <div class="flex flex-col items-center lg:w-1/3 lg:items-start">
      <p class="text-sm text-center">
        &copy; {{ copyRightDate }} - {{ $t('components.footer.all_rights_reserved') }} - {{
          $translate(site?.seo.title, locale) }}
      </p>
    </div>
  </footer>
</template>
