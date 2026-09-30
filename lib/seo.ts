import type { Metadata } from "next";
import { site } from "@/site.config";

/**
 * Absolute origin for canonical / OG URLs. NEXT_PUBLIC_SITE_URL wins (set it in Vercel once the
 * domain is known — open-items B12); previews fall back to their own deployment URL.
 */
export const siteUrl = (
	process.env.NEXT_PUBLIC_SITE_URL ??
	(process.env.VERCEL_ENV === "production" &&
	process.env.VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
		: process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: site.url)
).replace(/\/$/, "");

type PageMeta = {
	title: string;
	description: string;
	/** Route path, e.g. "/ledger/IC-2026-0001" — becomes the canonical URL. */
	path: string;
	/** Use the title as-is instead of the "{title} · 0xInChain 链上情报局" template. */
	absoluteTitle?: boolean;
	type?: "website" | "article";
	locale?: "zh_CN" | "en_US";
	/** hreflang pairs (WEBSITE_PLAN §15: home and About only). */
	languages?: Record<string, string>;
	noindex?: boolean;
	/** OG/X image path; defaults to the brand card. Routes with their own opengraph-image pass it here. */
	image?: string;
	publishedTime?: string;
	modifiedTime?: string;
};

/** Per-page metadata: title, description, canonical, Open Graph and X card (WEBSITE_PLAN §15). */
export function pageMeta(p: PageMeta): Metadata {
	return {
		title: p.absoluteTitle ? { absolute: p.title } : p.title,
		description: p.description,
		alternates: {
			canonical: p.path,
			...(p.languages ? { languages: p.languages } : {}),
		},
		openGraph: {
			title: p.title,
			description: p.description,
			url: p.path,
			siteName: `${site.name} ${site.nameZh}`,
			locale: p.locale ?? "zh_CN",
			type: p.type ?? "website",
			// Config openGraph overrides file-based images, so every page names its image explicitly.
			images: [
				{
					url: p.image ?? "/opengraph-image",
					width: 1200,
					height: 630,
					alt: `${site.name} ${site.nameZh}`,
				},
			],
			...(p.publishedTime ? { publishedTime: p.publishedTime } : {}),
			...(p.modifiedTime ? { modifiedTime: p.modifiedTime } : {}),
		},
		twitter: {
			card: "summary_large_image",
			title: p.title,
			description: p.description,
			site: site.officialChannels.find((c) => c.type === "x")?.handle,
		},
		...(p.noindex ? { robots: { index: false, follow: true } } : {}),
	};
}
