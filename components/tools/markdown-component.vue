<script setup lang="ts">
import type { MDCParserResult } from '@nuxtjs/mdc';
import type { I18n } from '~/functions/src/shared';

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
    <MDCRenderer :body="ast.body" :data="ast.data" />
</template>