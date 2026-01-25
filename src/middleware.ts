/**
 * i18n Middleware for Astro
 *
 * This middleware handles automatic language detection and routing:
 * - Intercepts requests to the root path (/)
 * - Parses the Accept-Language header to detect user preference
 * - Redirects to the appropriate locale prefix (/en/, /pt/, /es/, /fr/)
 * - Ignores static assets to prevent redirect loops
 */

import { defineMiddleware } from "astro:middleware";
import parser from "accept-language-parser";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type SupportedLocale,
} from "@util/translate";

// Patterns for static assets that should bypass the middleware
const STATIC_ASSET_PATTERNS = [
  /^\/_astro\//, // Astro's built assets
  /^\/_image/, // Astro's image endpoint
  /^\/images\//, // Image folder
  /^\/icons\//, // Icons folder
  /^\/video\//, // Video folder
  /^\/screenshots\//, // Screenshots folder
  /^\/favicon/, // Favicon files
  /^\/robots\.txt$/, // Robots.txt
  /^\/sitemap/, // Sitemap files
  /^\/api\//, // API routes
  /^\/admin/, // Admin page
  /^\/src\/assets\//, // Source assets
  /\.(css|js|json|svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|eot|mp4|webm|pdf)$/i, // File extensions
  /^\/scroll-timeline\.js$/, // Specific JS files
  /^\/_headers$/, // Vercel/Netlify headers file
];

/**
 * Checks if the given path is a static asset
 */
function isStaticAsset(pathname: string): boolean {
  return STATIC_ASSET_PATTERNS.some((pattern) => pattern.test(pathname));
}

/**
 * Checks if the path already has a locale prefix
 */
function hasLocalePrefix(pathname: string): boolean {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return SUPPORTED_LOCALES.includes(firstSegment as SupportedLocale);
}

/**
 * Always returns the default locale (pt) for production
 */
function detectPreferredLocale(
  acceptLanguageHeader: string | null,
): SupportedLocale {
  return DEFAULT_LOCALE;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Skip static assets
  if (isStaticAsset(pathname)) {
    return next();
  }

  // Skip if already has a locale prefix
  if (hasLocalePrefix(pathname)) {
    // Set the current locale in locals for use in components
    const locale = pathname.split("/").filter(Boolean)[0] as SupportedLocale;
    context.locals.lang = locale;
    return next();
  }

  // Handle root path redirect with language detection
  if (pathname === "/" || pathname === "") {
    const acceptLanguage = context.request.headers.get("accept-language");
    const preferredLocale = detectPreferredLocale(acceptLanguage);

    // Redirect to the localized root
    return context.redirect(`/${preferredLocale}/`, 302);
  }

  // For other non-localized paths, redirect to the default locale version
  // This handles cases like /about -> /en/about
  const acceptLanguage = context.request.headers.get("accept-language");
  const preferredLocale = detectPreferredLocale(acceptLanguage);

  return context.redirect(`/${preferredLocale}${pathname}`, 302);
});
