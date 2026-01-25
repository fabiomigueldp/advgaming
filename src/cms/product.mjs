import { toolbarButtons, toolbarButtonsInline } from "./common.mjs";

// Supported locales for i18n
const SUPPORTED_LOCALES = ['en', 'pt', 'es', 'fr'];
const LOCALE_LABELS = {
  en: 'English',
  pt: 'Português',
  es: 'Español',
  fr: 'Français'
};

// Product fields schema
const getProductFields = () => [
  {
    label: "Nome do Produto",
    name: "name",
    widget: "string",
    required: true,
  },
  {
    label: "Descricao Curta",
    name: "short_description",
    widget: "text",
    required: true,
  },
  {
    label: "Nivel do Produto",
    name: "product_level",
    widget: "select",
    options: [
      { label: "Gratuito", value: "free" },
      { label: "Basic", value: "basic" },
      { label: "Intermediate", value: "intermediate" },
      { label: "Advanced", value: "advanced" },
    ],
    required: true,
  },
  {
    label: "Preco (exibicao)",
    name: "price_display",
    widget: "string",
    required: true,
    hint: "Ex: R$ 49,90 ou Gratis",
  },
  {
    label: "Moeda",
    name: "currency",
    widget: "string",
    default: "BRL",
  },
  {
    label: "Stripe",
    name: "stripe",
    widget: "object",
    collapsed: true,
    fields: [
      {
        label: "Product ID",
        name: "product_id",
        widget: "string",
        required: false,
        hint: "ID do produto no Stripe (prod_xxx)",
      },
      {
        label: "Price ID",
        name: "price_id",
        widget: "string",
        required: false,
        hint: "ID do preco no Stripe (price_xxx)",
      },
    ],
  },
  {
    label: "Hero",
    name: "hero",
    widget: "object",
    collapsed: true,
    fields: [
      {
        label: "Headline",
        name: "headline",
        widget: "string",
        required: true,
      },
      {
        label: "Subheadline",
        name: "subheadline",
        widget: "text",
        required: false,
      },
      {
        label: "CTA Principal",
        name: "primary_cta_label",
        widget: "string",
        required: true,
      },
      {
        label: "CTA Secundario",
        name: "secondary_cta_label",
        widget: "string",
        required: false,
      },
      {
        label: "Imagem de Fundo",
        name: "background_image",
        widget: "image",
        required: false,
      },
    ],
  },
  {
    label: "Thumbnail",
    name: "thumbnail",
    widget: "image",
    required: true,
  },
  {
    label: "Galeria de Imagens",
    name: "gallery",
    widget: "list",
    required: false,
    field: {
      label: "Imagem",
      name: "image",
      widget: "image",
    },
  },
  {
    label: "Destaques",
    name: "highlights",
    widget: "list",
    required: false,
    field: {
      label: "Destaque",
      name: "highlight",
      widget: "string",
    },
  },
  {
    label: "O que esta incluso",
    name: "whats_included",
    widget: "list",
    required: false,
    fields: [
      {
        label: "Secao",
        name: "section",
        widget: "string",
      },
      {
        label: "Itens",
        name: "items",
        widget: "list",
        field: {
          label: "Item",
          name: "item",
          widget: "string",
        },
      },
    ],
  },
  {
    label: "Compatibilidade",
    name: "compatibility",
    widget: "list",
    required: false,
    field: {
      label: "Plataforma",
      name: "platform",
      widget: "string",
    },
  },
  {
    label: "Passos de Instalacao",
    name: "installation_steps",
    widget: "list",
    required: false,
    fields: [
      {
        label: "Numero do Passo",
        name: "step",
        widget: "number",
        value_type: "int",
      },
      {
        label: "Titulo",
        name: "title",
        widget: "string",
      },
      {
        label: "Descricao",
        name: "description",
        widget: "text",
      },
    ],
  },
  {
    label: "Resumo da Licenca",
    name: "license_summary",
    widget: "text",
    required: false,
  },
  {
    label: "FAQ",
    name: "faq",
    widget: "list",
    required: false,
    fields: [
      {
        label: "Pergunta",
        name: "question",
        widget: "string",
      },
      {
        label: "Resposta",
        name: "answer",
        widget: "text",
      },
    ],
  },
  {
    label: "Upsell",
    name: "upsell",
    widget: "object",
    collapsed: true,
    required: false,
    fields: [
      {
        label: "Slug do Produto",
        name: "product_slug",
        widget: "string",
      },
      {
        label: "Texto do Link",
        name: "label",
        widget: "string",
      },
    ],
  },
  {
    label: "SEO",
    name: "seo",
    widget: "object",
    collapsed: true,
    fields: [
      {
        label: "Titulo",
        name: "title",
        widget: "string",
        required: false,
      },
      {
        label: "Descricao",
        name: "description",
        widget: "text",
        required: false,
      },
      {
        label: "OG Image",
        name: "og_image",
        widget: "image",
        required: false,
      },
    ],
  },
  {
    label: "Destaque na Home",
    name: "featured",
    widget: "boolean",
    default: false,
  },
  {
    label: "Ordem de Exibicao",
    name: "sort_order",
    widget: "number",
    value_type: "int",
    default: 0,
  },
  {
    label: "Conteudo (MDX)",
    name: "body",
    widget: "markdown",
    toolbar_buttons: toolbarButtons,
  },
];

// Create product collection for a specific locale
const createProductCollection = (locale) => ({
  name: `products_${locale}`,
  label: `Produtos (${LOCALE_LABELS[locale]})`,
  label_singular: "Produto",
  folder: `src/content/products/${locale}`,
  create: true,
  delete: true,
  extension: "mdx",
  format: "frontmatter",
  slug: "{{slug}}",
  media_folder: "/src/assets/products",
  public_folder: "/src/assets/products",
  editor: { preview: false },
  fields: getProductFields(),
});

// Export collections for each locale
export const products_pt = createProductCollection('pt');
export const products_en = createProductCollection('en');
export const products_es = createProductCollection('es');
export const products_fr = createProductCollection('fr');

// Export all product collections
export const productCollections = [
  products_pt,
  products_en,
  products_es,
  products_fr,
];
