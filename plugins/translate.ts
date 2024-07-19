import isEmpty from 'lodash/isEmpty';

import type {
 I18n, locales 
} from '~/functions/src/shared/types/i18n';

export default defineNuxtPlugin(nuxtApp => {
        nuxtApp.provide(
            'translate',
            (
                field: I18n, locale: locales
            ) => typeof field === 'string' ? field : isEmpty(field) ? '' : field[locale]
        );
    });
