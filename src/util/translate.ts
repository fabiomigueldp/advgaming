/**
 * i18n Translation Utility
 *
 * This module provides translation functionality for the internationalized site.
 * It supports dynamic language selection via the `lang` parameter.
 */

interface Locale {
  [key: string]: string;
}

import en from "@locales/en.json";
import pt from "@locales/pt.json";
import es from "@locales/es.json";
import fr from "@locales/fr.json";
import { currentLocale } from "@src/store";

// Supported locales configuration
export const SUPPORTED_LOCALES = ["pt"] as const;
export const DEFAULT_LOCALE = "pt";

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

// All translations indexed by locale
const translations: Record<SupportedLocale, Locale> = {
  pt,
};

/**
 * Validates if a given locale string is supported
 */
export function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * Gets the valid locale or falls back to default
 */
export function getValidLocale(locale: string | undefined): SupportedLocale {
  if (locale && isValidLocale(locale)) {
    return locale;
  }
  return DEFAULT_LOCALE;
}

/**
 * Translation function with dynamic language support
 *
 * @param field - The translation key to look up
 * @param lang - The target language code (defaults to current locale from store, or 'en')
 * @returns The translated string, or falls back to English, or returns the key itself
 */
export const t = (field: string, lang?: string): string => {
  // If no lang provided, try to get from store (client-side) or use default
  let effectiveLang = lang;
  if (!effectiveLang) {
    // Try to get from store if available (client-side)
    try {
      effectiveLang = currentLocale.get();
    } catch {
      effectiveLang = DEFAULT_LOCALE;
    }
  }

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
 * Gets all translations for a specific locale
 */
export function getTranslations(lang: string = DEFAULT_LOCALE): Locale {
  const validLang = getValidLocale(lang);
  return translations[validLang] || translations[DEFAULT_LOCALE];
}

/**
 * Creates a localized URL path
 *
 * @param path - The path without locale prefix
 * @param lang - The target language code
 * @returns The localized path (e.g., /pt/about)
 */
export function localizeUrl(
  path: string,
  lang: string = DEFAULT_LOCALE,
): string {
  const validLang = getValidLocale(lang);
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  // Don't double-prefix if already localized
  if (
    SUPPORTED_LOCALES.some(
      (locale) =>
        cleanPath.startsWith(`/${locale}/`) || cleanPath === `/${locale}`,
    )
  ) {
    return cleanPath;
  }

  // For root path, return /lang/
  if (cleanPath === "/") {
    return `/${validLang}/`;
  }

  return `/${validLang}${cleanPath}`;
}

/**
 * Extracts the locale from a URL path
 *
 * @param path - The URL path
 * @returns The extracted locale or default locale
 */
export function getLocaleFromUrl(path: string): SupportedLocale {
  const segments = path.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }

  return DEFAULT_LOCALE;
}

/**
 * Removes the locale prefix from a URL path
 *
 * @param path - The URL path with potential locale prefix
 * @returns The path without locale prefix
 */
export function removeLocaleFromPath(path: string): string {
  const segments = path.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isValidLocale(firstSegment)) {
    segments.shift();
    return "/" + segments.join("/");
  }

  return path;
}
