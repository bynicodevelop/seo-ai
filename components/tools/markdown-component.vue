<script setup lang="ts">
import type { MDCParserResult } from '@nuxtjs/mdc';

const { locale } = useI18n();
const { $translate } = useNuxtApp() as any;

const props = defineProps({
    content: {
        required: true,
    },
});

const { data: ast } = await useAsyncData('markdown', () => parseMarkdown($translate(props.content, locale.value))) as { data: Partial<MDCParserResult> };

</script>

<template>
    <article class="prose prose-a:no-underline">
        <MDCRenderer :body="ast.body" :data="ast.data" />
    </article>
</template>
