import { defineCollection, reference, z } from "astro:content";
import { getIconName } from "@util/helpers";

const blocks = z
  .array(
    z.object({
      component: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),

      style: z
        .object({
          template: z.string().optional(),
          surface: z.string().optional(),
          container: z.string().optional(),
          animate: z.boolean().optional(),
          block_class: z.string().optional(),
          reverse: z.boolean().optional(),
        })
        .optional(),

      media: z
        .object({
          image_size: z.string().optional(),
          image_opacity: z.string().optional(),
          thumbnail: z.string().optional(),
          title: z.string().optional(),
          video_preview: z.string().optional(),
          video_id: z.string().optional(),
          embed: z.string().optional(),
          aspect: z
            .number()
            .or(z.string())
            .transform((val) => {
              if (typeof val === "string") return parseFloat(val);
              if (!!val && val > 0) return val;
              return 0;
            })
            .optional(),
        })
        .optional(),

      aspect: z
        .number()
        .or(z.string())
        .transform((val) => {
          if (typeof val === "string") return parseFloat(val);
          if (!!val && val > 0) return val;
          return 0;
        })
        .optional(),

      link: z.string().optional(),
      post_tag: z.array(z.string()).optional(),

      count: z.number().optional(),
      code: z.string().optional(),
      newsletter: z.string().optional(),

      prices: z
        .array(
          z.object({
            title: z.string().optional(),
            intro: z.string().optional(),
            price_suffix: z.string().optional(),
            surface: z.string().optional(),
            price: z.string(),
            buttons: z
              .array(
                z.object({
                  href: z.string(),
                  className: z.string().optional(),
                  label: z.string(),
                  color: z.string().optional(),
                  icon: z
                    .string()
                    .transform((val) => getIconName(val))
                    .optional(),
                  icon_only: z.boolean().optional(),
                }),
              )
              .optional(),

            features: z
              .array(
                z.object({
                  label: z.string().optional(),
                  value: z.string().optional(),
                  icon_class: z.string().optional(),
                  icon: z
                    .string()
                    .transform((val) => getIconName(val))
                    .optional(),
                }),
              )
              .optional(),
          }),
        )
        .optional(),

      items: z
        .array(
          z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            id: z.string().optional(),
          }),
        )
        .optional(),

      timing: z
        .object({
          delay: z.number().or(z.string()).optional(),
          duration: z.number().or(z.string()).optional(),
          on_load: z.boolean().optional(),
        })
        .optional(),

      images: z.array(z.string()).optional(),
      buttons: z
        .array(
          z.object({
            href: z.string(),
            className: z.string().optional(),
            label: z.string(),
            color: z.string().optional(),
            icon: z
              .string()
              .transform((val) => getIconName(val))
              .optional(),
            icon_only: z.boolean().optional(),
          }),
        )
        .optional(),
      features: z
        .array(
          z.object({
            href: z.string().optional(),
            className: z.string().optional(),
            title: z.string().optional(),
            content: z.string().optional(),
            color: z.string().optional(),
            icon: z
              .string()
              .transform((val) => getIconName(val))
              .optional(),
          }),
        )
        .optional(),

      // Stats Counter block
      stats: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
            prefix: z.string().optional(),
            suffix: z.string().optional(),
          }),
        )
        .optional(),

      // Testimonials block
      testimonials: z
        .array(
          z.object({
            quote: z.string(),
            author: z.string(),
            role: z.string().optional(),
            company: z.string().optional(),
            rating: z.number().optional(),
          }),
        )
        .optional(),

      // Trust Badges block
      badges: z
        .array(
          z.object({
            name: z.string(),
            icon: z.string().optional(),
            image: z.string().optional(),
          }),
        )
        .optional(),
    }),
  )
  .optional();

const style = z.object({
  template: z.string().optional(),
  nav_color: z.string().optional(),
  hero_template: z.string().optional(),
  hero_surface: z.string().optional(),
  hero_image_opacity: z.string().optional(),
  container: z.string().optional(),
  page_class: z.string().optional(),
  content_class: z.string().optional(),
  block_class: z.string().optional(),
});

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    intro: z.string().optional(),
    thumbnail: z.string(),
    og_image: z.string().optional(),
    tag: z.array(z.string()).optional(),

    pubDate: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),

    nav: z
      .object({
        next: z
          .array(
            z.object({
              href: z.string(),
              title: z.string(),
            }),
          )
          .optional(),

        prev: z
          .array(
            z.object({
              href: z.string(),
              title: z.string(),
            }),
          )
          .optional(),
      })
      .optional(),

    blocks: blocks,
    style: style,
  }),
});

const page = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    intro: z.string().optional(),
    thumbnail: z.string().optional(),
    og_image: z.string().optional(),
    hero: z
      .object({
        title: z.string().optional(),
        intro: z.string().optional(),
        media: z
          .object({
            thumbnail: z.string().optional(),
            background_image: z.string().optional(),
            video_id: z.string().optional(),
            image_opacity: z.string().optional(),
            video_preview: z.string().optional(),
            embed: z.string().optional(),
            aspect: z.number().or(z.string()).optional(),
          })
          .optional(),

        style: z
          .object({
            surface: z.string().optional(),
            class: z.string().optional(),
            container: z.string().optional(),
            background: z.string().optional(),
            layout: z.string().optional(),
            pattern: z.string().optional(),
          })
          .optional(),

        buttons: z
          .array(
            z.object({
              href: z.string(),
              className: z.string().optional(),
              label: z.string(),
              color: z.string().optional(),
              icon: z
                .string()
                .transform((val) => getIconName(val))
                .optional(),
              icon_only: z.boolean().optional(),
            }),
          )
          .optional(),
      })
      .optional(),

    blocks: blocks,
    style: style,
  }),
});

const config = defineCollection({
  type: "content",
  schema: z.object({
    sitename: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    newsletter_text: z.string().optional(),
    footer_text: z.string().optional(),
    per_page: z.number().optional(),
    intro: z.string().optional(),
    thumbnail: z.string().optional(),
    og_image: z.string().optional(),

    surface: z
      .array(
        z.object({
          name: z.string(),
          class: z.string(),
        }),
      )
      .optional(),

    form: z
      .object({
        title: z.string(),
        intro: z.string().optional(),
        thumbnail: z.string(),
        provider: z.string(),
        topics: z
          .array(
            z.object({
              label: z.string(),
              email: z.string().optional(),
              slack_id: z.string().optional(),
            }),
          )
          .optional(),
      })
      .optional(),

    newsletter: z
      .object({
        title: z.string(),
        intro: z.string().optional(),
        link: z.string().optional(),
        status: z.string().optional(),
        thanks: z.string().optional(),
        thumbnail: z.string(),
        list: z
          .array(
            z.object({
              title: z.string(),
              intro: z.string().optional(),
              thanks: z.string().optional(),
              link: z.string().optional(),
              tags: z.array(z.string()).optional(),
              status: z.string().optional(),
              id: z.string().optional(),
              include_main_list: z.boolean().optional(),
              thumbnail: z.string(),
            }),
          )
          .optional(),
      })
      .optional(),
    auth: z
      .object({
        thumbnail: z.string(),
      })
      .optional(),

    blog_tags: z
      .array(
        z.object({
          title: z.string(),
          name: z.string(),
          description: z.string(),
          thumbnail: z.string(),
          intro: z.string().optional(),
          body: z.string().optional(),
          overwrite_style: z.boolean().optional(),
        }),
      )
      .optional(),

    project_tags: z
      .array(
        z.object({
          title: z.string(),
          name: z.string(),
          description: z.string(),
          thumbnail: z.string(),
          intro: z.string().optional(),
          body: z.string().optional(),
          overwrite_style: z.boolean().optional(),
        }),
      )
      .optional(),

    style: style.optional(),

    main_menu: z
      .array(
        z.object({
          href: z.string(),
          label: z.string(),
        }),
      )
      .optional(),
    cta_menu: z
      .array(
        z.object({
          href: z.string(),
          label: z.string(),
        }),
      )
      .optional(),

    footer_menus: z
      .array(
        z.object({
          label: z.string(),
          links: z.array(
            z.object({
              href: z.string(),
              label: z.string(),
            }),
          ),
        }),
      )
      .optional(),

    social: z
      .array(
        z.object({
          href: z.string(),
          label: z.string(),
          icon: z.string().transform((val) => getIconName(val)),
        }),
      )
      .optional(),
  }),
});

// Products Collection for Adventury Gaming Store
const products = defineCollection({
  type: "content",
  schema: z.object({
    // Basic info
    name: z.string(),
    short_description: z.string(),
    product_level: z.enum(["free", "basic", "intermediate", "advanced"]),
    price_display: z.string(),
    currency: z.string().default("BRL"),

    // Stripe integration
    stripe: z
      .object({
        product_id: z.string().optional(),
        price_id: z.string().optional(),
      })
      .optional(),

    // Hero section
    hero: z
      .object({
        headline: z.string(),
        subheadline: z.string().optional(),
        primary_cta_label: z.string(),
        secondary_cta_label: z.string().optional(),
        background_image: z.string().optional(),
      })
      .optional(),

    // Product images
    thumbnail: z.string(),
    gallery: z.array(z.string()).optional(),

    // Product details
    highlights: z.array(z.string()).optional(),

    whats_included: z
      .array(
        z.object({
          section: z.string(),
          items: z.array(z.string()),
        }),
      )
      .optional(),

    compatibility: z.array(z.string()).optional(),

    installation_steps: z
      .array(
        z.object({
          step: z.number(),
          title: z.string(),
          description: z.string(),
        }),
      )
      .optional(),

    license_summary: z.string().optional(),

    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .optional(),

    // Upsell
    upsell: z
      .object({
        product_slug: z.string(),
        label: z.string(),
      })
      .optional(),

    // SEO
    seo: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        og_image: z.string().optional(),
      })
      .optional(),

    // Publishing
    featured: z.boolean().default(false),
    sort_order: z.number().default(0),
  }),
});

const partners = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    handle: z.string().optional(),
    role: z.string().optional(),
    level: z.enum(["legend", "partner", "affiliate"]).default("partner"),
    sort_order: z.number().default(0),
    featured: z.boolean().default(false),
    platform: z.enum([
      "twitch",
      "youtube",
      "kick",
      "tiktok",
      "facebook",
      "other",
    ]),
    channel_url: z.string(),
    avatar: z.string(),
    cutout: z.string().optional(),
    screenshot: z.string().optional(),
    product: reference("products").optional(),
    showcase: z
      .array(
        z.object({
          image: z.string(),
          product: reference("products").optional(),
        }),
      )
      .optional(),
  }),
});

export const collections = { blog, page, config, products, partners };
