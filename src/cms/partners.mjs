// Partners collection for Adventury Gaming (O Squad)

const partnerLevels = [
  { label: "Legend", value: "legend" },
  { label: "Partner", value: "partner" },
  { label: "Affiliate", value: "affiliate" },
];

const platformOptions = [
  { label: "Twitch", value: "twitch" },
  { label: "YouTube", value: "youtube" },
  { label: "Kick", value: "kick" },
  { label: "TikTok", value: "tiktok" },
  { label: "Facebook", value: "facebook" },
  { label: "Outro", value: "other" },
];

const partnerFields = [
  {
    label: "Nome",
    name: "name",
    widget: "string",
    required: true,
  },
  {
    label: "Handle",
    name: "handle",
    widget: "string",
    required: false,
    hint: "Ex: @gamerzinha",
  },
  {
    label: "Cargo / Especialidade",
    name: "role",
    widget: "string",
    required: false,
    hint: "Ex: Especialista em FPS",
  },
  {
    label: "Nivel",
    name: "level",
    widget: "select",
    options: partnerLevels,
    default: "partner",
  },
  {
    label: "Ordenacao",
    name: "sort_order",
    widget: "number",
    value_type: "int",
    default: 0,
  },
  {
    label: "Destaque",
    name: "featured",
    widget: "boolean",
    default: false,
  },
  {
    label: "Plataforma",
    name: "platform",
    widget: "select",
    options: platformOptions,
    default: "twitch",
  },
  {
    label: "URL do canal",
    name: "channel_url",
    widget: "string",
    required: false,
  },
  {
    label: "Avatar",
    name: "avatar",
    widget: "image",
    required: true,
  },
  {
    label: "Recorte (PNG)",
    name: "cutout",
    widget: "image",
    required: false,
  },
  {
    label: "Screenshot da live",
    name: "screenshot",
    widget: "image",
    required: false,
  },
  {
    label: "Bio curta",
    name: "bio",
    widget: "text",
    required: false,
  },
  {
    label: "Socials",
    name: "socials",
    widget: "list",
    required: false,
    fields: [
      {
        label: "Plataforma",
        name: "platform",
        widget: "select",
        options: platformOptions,
        default: "twitch",
      },
      {
        label: "URL",
        name: "url",
        widget: "string",
      },
    ],
  },
  {
    label: "Produto vinculado",
    name: "product",
    widget: "relation",
    collection: "products_pt",
    search_fields: ["name"],
    display_fields: ["name"],
    value_field: "{{slug}}",
    required: false,
    hint: "Seleciona o kit que o parceiro usa",
  },
  {
    label: "Get the Look",
    name: "showcase",
    widget: "list",
    required: false,
    fields: [
      {
        label: "Imagem",
        name: "image",
        widget: "image",
        required: true,
      },
      {
        label: "Produto",
        name: "product",
        widget: "relation",
        collection: "products_pt",
        search_fields: ["name"],
        display_fields: ["name"],
        value_field: "{{slug}}",
        required: false,
      },
    ],
  },
];

export const partners_pt = {
  name: "partners_pt",
  label: "Squad (Português)",
  label_singular: "Parceiro",
  folder: "src/content/partners/pt",
  create: true,
  delete: true,
  extension: "mdx",
  format: "frontmatter",
  slug: "{{slug}}",
  media_folder: "/src/assets/partners",
  public_folder: "/src/assets/partners",
  editor: { preview: false },
  fields: partnerFields,
};

export const partnerCollections = [partners_pt];
