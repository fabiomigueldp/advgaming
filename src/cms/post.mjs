import { toolbarButtons, style, buttons } from "./common.mjs";
import { t } from "@util/translate";

// Supported locales for i18n
const SUPPORTED_LOCALES = ['en', 'pt', 'es', 'fr'];
const LOCALE_LABELS = {
  en: 'English',
  pt: 'Português',
  es: 'Español',
  fr: 'Français'
};

// Base post fields (shared across all locales)
const getPostFields = () => [
    {
      name: "tag",
      label: t("tags"),
      multiple: true,
      widget: "relation",
      collection: "config",
      max: 5,
      required: false,
      file: "blog",
      search_fields: ["blog_tags.*.name"],
      display_fields: ["blog_tags.*.name"],
      value_field: "blog_tags.*.name",
    },
    {
      label: t("title"),
      name: "title",
      widget: "string",
      pattern: [".{5,}", "Must have at least 5 characters"],
    },
    {
      label: t("description_seo"),
      name: "description",
      widget: "text",
      pattern: [".{0,}", "Must have at least 10 characters"],
    },

    {
      label: t("intro"),
      name: "intro",
      widget: "text",
      required: false,
    },

    {
      label: t("body"),
      name: "body",
      widget: "markdown",

      toolbar_buttons: toolbarButtons,
      show_raw: true,
    },

    style,
    {
      label: t("pub_date"),
      name: "pubDate",
      widget: "datetime",
      time_format: false,
      format: "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
      default: new Date().toISOString(),
    },

    {
      label: t("featured_image"),
      name: "thumbnail",
      widget: "image",
      required: true,
    },
    {
      label: t("og_image"),
      name: "og_image",
      widget: "image",
      required: false,
      hint: t("label_og_image"),
    },
];

// Generate post collection for each locale
const createPostCollection = (locale) => ({
  name: `posts_${locale}`,
  identifier_field: "name",
  folder: `src/content/blog/${locale}`,
  label: `${t("blog")} (${LOCALE_LABELS[locale]})`,
  format: "frontmatter",
  extension: "mdx",
  icon: "news",
  create: true,
  editor: {
    preview: false,
    frame: false,
  },
  fields: getPostFields(),
});

// Export individual locale collections
export const post_en = createPostCollection('en');
export const post_pt = createPostCollection('pt');
export const post_es = createPostCollection('es');
export const post_fr = createPostCollection('fr');

// Export all post collections as an array
export const postCollections = SUPPORTED_LOCALES.map(createPostCollection);

// Legacy export for backwards compatibility (defaults to English)
export const post = post_en;
