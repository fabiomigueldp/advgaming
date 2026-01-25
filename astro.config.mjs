import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import m2dx from "astro-m2dx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import rehypeExternalLinks from "rehype-external-links";
import fauxRemarkEmbedder from "@remark-embedder/core";
import fauxOembedTransformer from "@remark-embedder/transformer-oembed";
const remarkEmbedder = fauxRemarkEmbedder.default;
const oembedTransformer = fauxOembedTransformer.default;
import vue from "@astrojs/vue";
/** @type {import('astro-m2dx').Options} */
import icon from "astro-icon";
import node from "@astrojs/node";
import vercel from "@astrojs/vercel/serverless";

const isDocker = (process.env.BUILD_TARGET || "").toLowerCase() === "docker";

const m2dxOptions = {
  exportComponents: true,
  unwrapImages: true,
  autoImports: true,
};

// Supported locales for i18n
const locales = ["pt"];
const defaultLocale = "pt";

// https://astro.build/config
export default defineConfig({
  site: "https://adventurygaming.com",
  output: "hybrid",
  adapter: isDocker ? node({ mode: "standalone" }) : vercel(),
  ...(isDocker
    ? {
        server: {
          host: true,
          port: 4321,
        },
      }
    : {}),
  i18n: {
    defaultLocale: defaultLocale,
    locales: locales,
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    icon(),
    mdx({}),
    sitemap(),
    tailwind(),
    vue({
      appEntrypoint: "/src/pages/_app",
    }),
  ],
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [
      [
        remarkEmbedder,
        {
          transformers: [oembedTransformer],
        },
      ],
      [m2dx, m2dxOptions],
    ],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: ["nofollow"],
          target: ["_blank"],
        },
      ],
    ],
  },
  vite: {
    build: {
      rollupOptions: {
        external: [],
      },
      assetsInlineLimit: 10096,
    },
    ssr: {
      // Workaround until they support native ESM
      noExternal: ["vue3-popper"],
    },
  },
  build: {
    inlineStylesheets: "always",
  },
  prefetch: {
    defaultStrategy: "viewport",
  },
  scopedStyleStrategy: "attribute",
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
});
