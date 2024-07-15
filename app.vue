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

const { locale } = useI18n();

useHead({
  htmlAttrs: {
    lang: locale.value,
  },
})

</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
