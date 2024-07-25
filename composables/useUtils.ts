import type { I18n } from '~/functions/src/shared';

export const useUtils = () => {
    const url = useRequestURL();
    const { locale } = useI18n();
    const { $translate } = useNuxtApp() as unknown as {
        $translate: Function
    };

    const getBaseUrl = (path?: string): string => {
        const baseUrl = url.protocol + '//' + url.host;
        return baseUrl + (path || '');
    }

    const getCanonical = () => {
        const route = useRoute();
        return getBaseUrl(route.path);
    };

    const getTranslatedValue = (value?: I18n): string => {
        if (!value) return '';

        return $translate(
            value,
            locale.value
        );
    }

    return {
        getCanonical,
        getBaseUrl,
        getTranslatedValue,
    };
};