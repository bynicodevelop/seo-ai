<script setup lang="ts">
import type {
    Category, Site
} from '~/functions/src/shared';

const { locale } = useI18n();
const localePath = useLocalePath();
const {
    $domain, $translate
} = useNuxtApp() as unknown as { $domain: string, $translate: Function };
const {
    fetchCategories, fetchDomain
} = useContent();

const show = ref(false);

const { data: domain } = await useAsyncData<Site>(
    'domain',
    async () => await fetchDomain($domain as string)
);
const { data: categories } = await useAsyncData<Category[]>(
    'categories',
    async () => await fetchCategories($domain as string)
);
</script>

<template>
    <nav aria-label="Global">
        <NuxtLink :to="localePath('/')" class="-m-1.5 p-1.5">
            <span class="sr-only">{{ $translate(domain?.seo.title, locale) }}</span>
            {{ $translate(domain?.seo.title, locale) }}
        </NuxtLink>
        <div class="flex lg:hidden">
            <button class="mobile-button" type="button" @click="show = true">
                <span class="sr-only">{{ $t('components.navigation.open_menu') }}</span>
                <svg
class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    aria-hidden="true">
                    <path
stroke-linecap="round" stroke-linejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        </div>
        <div class="aside">
            <NuxtLink
v-for="(category, index) in categories" :key="index"
                :to="localePath(`/categories/${$translate(category.slug, locale)}`)"
                :title="$translate(category.title, locale)">
                {{ $translate(category.title, locale) }}
            </NuxtLink>
        </div>
    </nav>
    <div :class="{ 'block': show, 'hidden': !show }" role="dialog" aria-modal="true">
        <div class="nav-mobile">
            <div class="flex items-center justify-between">
                <NuxtLink :to="localePath('/')" class="-m-1.5 p-1.5" :title="domain?.seo.title">
                    <span class="sr-only">{{ $translate(domain?.seo.title, locale) }}</span>
                    {{ $translate(domain?.seo.title, locale) }}
                </NuxtLink>
                <button type="button" class="mobile-button" @click="show = false">
                    <span class="sr-only">{{ $t('components.navigation.close_menu') }}</span>
                    <svg
class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                        aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="aside">
                <NuxtLink
v-for="(category, index) in categories" :key="index"
                    :title="$translate(category.title, locale)"
                    :to="localePath(`/categories/${$translate(category.slug, locale)}`)" @click="show = false">
                    {{ $translate(category.title, locale) }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
nav {
    @apply container mx-auto flex items-center justify-between py-4 pl-5 lg:py-6 lg:pl-0;

    .mobile-button {
        @apply inline-flex items-center justify-center rounded-md p-2.5 text-gray-700;
    }

    .aside {
        @apply hidden lg:flex lg:gap-x-12;

        a {
            @apply text-sm font-semibold leading-6 text-gray-900 capitalize;
        }
    }
}

.nav-mobile {
    @apply fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10;

    .mobile-button {
        @apply -m-2.5 rounded-md p-2.5 text-gray-700;
    }

    .aside {
        @apply mt-3 space-y-2 py-6;

        a {
            @apply -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50;
        }
    }
}
</style>