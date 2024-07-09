<script setup lang="ts">
import type { Domain } from './shared/types/domain';
const { $domain } = useNuxtApp();
const { fetchDomain } = useContent();

const { data: domain } = await useAsyncData<Domain>('domain', async () => await fetchDomain($domain as string));

useHead(() => ({
  title: domain.value?.title!,
  meta: [
    {
      name: 'description',
      content: domain.value?.description
    },
  ],
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
