import { siteUrl } from "@/lib/seo";
import { site } from "@/site.config";

const abs = (path: string) => `${siteUrl}${path}`;

export function organizationLd() {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": abs("/#organization"),
		name: site.name,
		alternateName: [site.nameZh, site.nameEn],
		url: abs("/"),
		logo: abs("/favicon.svg"),
		sameAs: [site.social.x, site.social.telegram].filter((u) =>
			u.startsWith("https://"),
		),
	};
}

export function websiteLd() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": abs("/#website"),
		name: `${site.name} ${site.nameZh}`,
		url: abs("/"),
		inLanguage: ["zh-CN", "en"],
		publisher: { "@id": abs("/#organization") },
	};
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((it, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: it.name,
			item: abs(it.path),
		})),
	};
}

export function itemListLd(
	name: string,
	items: { name: string; path: string }[],
) {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name,
		numberOfItems: items.length,
		itemListElement: items.map((it, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: it.name,
			url: abs(it.path),
		})),
	};
}

export function articleLd(a: {
	title: string;
	description: string;
	path: string;
	publishedAt: string;
	updatedAt?: string;
}) {
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: a.title,
		description: a.description,
		url: abs(a.path),
		mainEntityOfPage: abs(a.path),
		datePublished: a.publishedAt,
		dateModified: a.updatedAt ?? a.publishedAt,
		inLanguage: "zh-CN",
		author: { "@id": abs("/#organization") },
		publisher: { "@id": abs("/#organization") },
		image: abs(`${a.path}/opengraph-image`),
	};
}
