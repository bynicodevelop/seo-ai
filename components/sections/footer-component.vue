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
  <footer>
    <div class="col site-info">
      <h6>
        <NuxtLink :to="localePath('/')">
          {{ $translate(siteRef?.seo.title, locale) }}
        </NuxtLink>
      </h6>
      <p>{{ $translate(siteRef?.seo.description, locale) }}</p>
    </div>
    <div class="col copy-right">
      <p class="copy-right">
        &copy; {{ copyRightDate }} - {{ $t('components.footer.all_rights_reserved') }} - {{
          $translate(siteRef?.seo.title, locale) }}
      </p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
footer {
  @apply container mx-auto space-x-10 relative items-center grid grid-cols-3;

  .col {
    @apply flex flex-col col-span-3;

    &.site-info {
      @apply text-center lg:text-left space-y-2 lg:col-span-1;
    }

    h6 {
      @apply text-lg;
    }

    &.copy-right {
      @apply text-center items-center lg:col-span-2;

      p {
        @apply text-sm;
      }
    }
  }
}
</style>
