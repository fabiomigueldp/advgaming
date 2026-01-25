/**
 * Vue Composable for i18n translations
 * 
 * This provides a reactive translation function for Vue components.
 */

import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { currentLocale } from '@src/store';

import en from '@locales/en.json';
import pt from '@locales/pt.json';
import es from '@locales/es.json';
import fr from '@locales/fr.json';

const SUPPORTED_LOCALES = ['en', 'pt', 'es', 'fr'] as const;
const DEFAULT_LOCALE = 'en';

type SupportedLocale = typeof SUPPORTED_LOCALES[number];

interface Locale {
    [key: string]: string;
}

const translations: Record<SupportedLocale, Locale> = {
    en,
    pt,
    es,
    fr,
};

function isValidLocale(locale: string): locale is SupportedLocale {
    return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

function getValidLocale(locale: string | undefined): SupportedLocale {
    if (locale && isValidLocale(locale)) {
        return locale;
    }
    return DEFAULT_LOCALE;
}

/**
 * Vue composable that provides reactive translations
 */
export function useTranslate() {
    const $locale = useStore(currentLocale);
    
    /**
     * Reactive translation function
     */
    const t = (field: string, lang?: string): string => {
        const effectiveLang = lang || $locale.value || DEFAULT_LOCALE;
        const validLang = getValidLocale(effectiveLang);

        // Try to get translation in the requested language
        if (translations[validLang] && translations[validLang][field]) {
            return translations[validLang][field];
        }

        // Fallback to English
        if (translations[DEFAULT_LOCALE] && translations[DEFAULT_LOCALE][field]) {
            return translations[DEFAULT_LOCALE][field];
        }

        // Return the key itself as last resort
        return field;
    };
    
    /**
     * Computed current locale
     */
    const locale = computed(() => $locale.value);
    
    return {
        t,
        locale,
    };
}

export default useTranslate;
