<script setup lang="ts">
const { getCanonical } = useUtils();

useHead({
  link: [
    {
      rel: 'canonical',
      href: getCanonical()
    }
  ]
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
