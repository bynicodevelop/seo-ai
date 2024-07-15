<script setup lang="ts">
import type { Site } from '~/functions/src/shared';
const { locale } = useI18n();
const { $domain, $translate } = useNuxtApp() as any;
const { fetchDomain } = useContent();

const url = useRequestURL();
const baseUrl = url.protocol + '//' + url.host

try {
  const { data: domainData } = await useAsyncData<Site>('domain', async () => await fetchDomain($domain as string));

  useHead({
    title: $translate(domainData.value?.seo.title, locale.value),
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: $translate(domainData.value?.seo.description, locale.value),
      },
    ],
    templateParams: {
      schemaOrg: {
        host: baseUrl,
      }
    }
  });

  const organization = {
    name: $translate(domainData.value?.seo.title, locale.value),
  }

  useSchemaOrg([
    defineOrganization(organization),
  ]);
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
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
