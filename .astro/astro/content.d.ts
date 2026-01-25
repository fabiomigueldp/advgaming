declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"en/air-flow-supply.mdx": {
	id: "en/air-flow-supply.mdx";
  slug: "en/air-flow-supply";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/atagochaya.mdx": {
	id: "en/atagochaya.mdx";
  slug: "en/atagochaya";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/contact-form.mdx": {
	id: "en/contact-form.mdx";
  slug: "en/contact-form";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/newsletter.mdx": {
	id: "en/newsletter.mdx";
  slug: "en/newsletter";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/pibi-app-studio.mdx": {
	id: "en/pibi-app-studio.mdx";
  slug: "en/pibi-app-studio";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/readme.mdx": {
	id: "en/readme.mdx";
  slug: "en/readme";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/tribehacks.mdx": {
	id: "en/tribehacks.mdx";
  slug: "en/tribehacks";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/air-flow-supply.mdx": {
	id: "es/air-flow-supply.mdx";
  slug: "es/air-flow-supply";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/atagochaya.mdx": {
	id: "es/atagochaya.mdx";
  slug: "es/atagochaya";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/contact-form.mdx": {
	id: "es/contact-form.mdx";
  slug: "es/contact-form";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/newsletter.mdx": {
	id: "es/newsletter.mdx";
  slug: "es/newsletter";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/pibi-app-studio.mdx": {
	id: "es/pibi-app-studio.mdx";
  slug: "es/pibi-app-studio";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/readme.mdx": {
	id: "es/readme.mdx";
  slug: "es/readme";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/tribehacks.mdx": {
	id: "es/tribehacks.mdx";
  slug: "es/tribehacks";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"fr/air-flow-supply.mdx": {
	id: "fr/air-flow-supply.mdx";
  slug: "fr/air-flow-supply";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"fr/atagochaya.mdx": {
	id: "fr/atagochaya.mdx";
  slug: "fr/atagochaya";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"fr/contact-form.mdx": {
	id: "fr/contact-form.mdx";
  slug: "fr/contact-form";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"fr/newsletter.mdx": {
	id: "fr/newsletter.mdx";
  slug: "fr/newsletter";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"fr/pibi-app-studio.mdx": {
	id: "fr/pibi-app-studio.mdx";
  slug: "fr/pibi-app-studio";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"fr/readme.mdx": {
	id: "fr/readme.mdx";
  slug: "fr/readme";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"fr/tribehacks.mdx": {
	id: "fr/tribehacks.mdx";
  slug: "fr/tribehacks";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"pt/air-flow-supply.mdx": {
	id: "pt/air-flow-supply.mdx";
  slug: "pt/air-flow-supply";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"pt/atagochaya.mdx": {
	id: "pt/atagochaya.mdx";
  slug: "pt/atagochaya";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"pt/contact-form.mdx": {
	id: "pt/contact-form.mdx";
  slug: "pt/contact-form";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"pt/newsletter.mdx": {
	id: "pt/newsletter.mdx";
  slug: "pt/newsletter";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"pt/pibi-app-studio.mdx": {
	id: "pt/pibi-app-studio.mdx";
  slug: "pt/pibi-app-studio";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"pt/readme.mdx": {
	id: "pt/readme.mdx";
  slug: "pt/readme";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"pt/tribehacks.mdx": {
	id: "pt/tribehacks.mdx";
  slug: "pt/tribehacks";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
};
"config": {
"about.mdx": {
	id: "about.mdx";
  slug: "about";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"blog.mdx": {
	id: "blog.mdx";
  slug: "blog";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"contact.mdx": {
	id: "contact.mdx";
  slug: "contact";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"en/about.mdx": {
	id: "en/about.mdx";
  slug: "en/about";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"en/blog.mdx": {
	id: "en/blog.mdx";
  slug: "en/blog";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"en/contact.mdx": {
	id: "en/contact.mdx";
  slug: "en/contact";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"en/navigation.mdx": {
	id: "en/navigation.mdx";
  slug: "en/navigation";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"en/style.mdx": {
	id: "en/style.mdx";
  slug: "en/style";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"es/about.mdx": {
	id: "es/about.mdx";
  slug: "es/about";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"es/blog.mdx": {
	id: "es/blog.mdx";
  slug: "es/blog";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"es/contact.mdx": {
	id: "es/contact.mdx";
  slug: "es/contact";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"es/navigation.mdx": {
	id: "es/navigation.mdx";
  slug: "es/navigation";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"es/style.mdx": {
	id: "es/style.mdx";
  slug: "es/style";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"fr/about.mdx": {
	id: "fr/about.mdx";
  slug: "fr/about";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"fr/blog.mdx": {
	id: "fr/blog.mdx";
  slug: "fr/blog";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"fr/contact.mdx": {
	id: "fr/contact.mdx";
  slug: "fr/contact";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"fr/navigation.mdx": {
	id: "fr/navigation.mdx";
  slug: "fr/navigation";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"fr/style.mdx": {
	id: "fr/style.mdx";
  slug: "fr/style";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"navigation.mdx": {
	id: "navigation.mdx";
  slug: "navigation";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"pt/about.mdx": {
	id: "pt/about.mdx";
  slug: "pt/about";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"pt/blog.mdx": {
	id: "pt/blog.mdx";
  slug: "pt/blog";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"pt/contact.mdx": {
	id: "pt/contact.mdx";
  slug: "pt/contact";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"pt/navigation.mdx": {
	id: "pt/navigation.mdx";
  slug: "pt/navigation";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"pt/style.mdx": {
	id: "pt/style.mdx";
  slug: "pt/style";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
"style.mdx": {
	id: "style.mdx";
  slug: "style";
  body: string;
  collection: "config";
  data: InferEntrySchema<"config">
} & { render(): Render[".mdx"] };
};
"page": {
"en/about-starfunnel.mdx": {
	id: "en/about-starfunnel.mdx";
  slug: "en/about-starfunnel";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"en/index.mdx": {
	id: "en/index.mdx";
  slug: "en";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"en/kickstart-your-project.mdx": {
	id: "en/kickstart-your-project.mdx";
  slug: "en/kickstart-your-project";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"en/license.mdx": {
	id: "en/license.mdx";
  slug: "en/license";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"en/pricing.mdx": {
	id: "en/pricing.mdx";
  slug: "en/pricing";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"es/about-starfunnel.mdx": {
	id: "es/about-starfunnel.mdx";
  slug: "es/about-starfunnel";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"es/index.mdx": {
	id: "es/index.mdx";
  slug: "es";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"es/kickstart-your-project.mdx": {
	id: "es/kickstart-your-project.mdx";
  slug: "es/kickstart-your-project";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"es/license.mdx": {
	id: "es/license.mdx";
  slug: "es/license";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"es/pricing.mdx": {
	id: "es/pricing.mdx";
  slug: "es/pricing";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"fr/about-starfunnel.mdx": {
	id: "fr/about-starfunnel.mdx";
  slug: "fr/about-starfunnel";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"fr/index.mdx": {
	id: "fr/index.mdx";
  slug: "fr";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"fr/kickstart-your-project.mdx": {
	id: "fr/kickstart-your-project.mdx";
  slug: "fr/kickstart-your-project";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"fr/license.mdx": {
	id: "fr/license.mdx";
  slug: "fr/license";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"fr/pricing.mdx": {
	id: "fr/pricing.mdx";
  slug: "fr/pricing";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"pt/about-starfunnel.mdx": {
	id: "pt/about-starfunnel.mdx";
  slug: "pt/about-starfunnel";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"pt/about.mdx": {
	id: "pt/about.mdx";
  slug: "pt/about";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"pt/index.mdx": {
	id: "pt/index.mdx";
  slug: "pt";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"pt/kickstart-your-project.mdx": {
	id: "pt/kickstart-your-project.mdx";
  slug: "pt/kickstart-your-project";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"pt/legal/license.mdx": {
	id: "pt/legal/license.mdx";
  slug: "pt/legal/license";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"pt/legal/privacy.mdx": {
	id: "pt/legal/privacy.mdx";
  slug: "pt/legal/privacy";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"pt/legal/refunds.mdx": {
	id: "pt/legal/refunds.mdx";
  slug: "pt/legal/refunds";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"pt/legal/terms.mdx": {
	id: "pt/legal/terms.mdx";
  slug: "pt/legal/terms";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"pt/license.mdx": {
	id: "pt/license.mdx";
  slug: "pt/license";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"pt/pricing.mdx": {
	id: "pt/pricing.mdx";
  slug: "pt/pricing";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"pt/services.mdx": {
	id: "pt/services.mdx";
  slug: "pt/services";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
"pt/support.mdx": {
	id: "pt/support.mdx";
  slug: "pt/support";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".mdx"] };
};
"products": {
"pt/kit-advanced.mdx": {
	id: "pt/kit-advanced.mdx";
  slug: "pt/kit-advanced";
  body: string;
  collection: "products";
  data: InferEntrySchema<"products">
} & { render(): Render[".mdx"] };
"pt/kit-basic.mdx": {
	id: "pt/kit-basic.mdx";
  slug: "pt/kit-basic";
  body: string;
  collection: "products";
  data: InferEntrySchema<"products">
} & { render(): Render[".mdx"] };
"pt/kit-demo.mdx": {
	id: "pt/kit-demo.mdx";
  slug: "pt/kit-demo";
  body: string;
  collection: "products";
  data: InferEntrySchema<"products">
} & { render(): Render[".mdx"] };
"pt/kit-intermediate.mdx": {
	id: "pt/kit-intermediate.mdx";
  slug: "pt/kit-intermediate";
  body: string;
  collection: "products";
  data: InferEntrySchema<"products">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("./../../src/content/config.js");
}
