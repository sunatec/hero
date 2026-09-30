import {
	allCases,
	allModules,
	allResearch,
	allSignals,
} from "content-collections";
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const STATIC = [
	"/",
	"/ledger",
	"/cases",
	"/methodology",
	"/tools",
	"/community",
	"/about",
	"/research",
	"/join",
	"/verify",
	"/legal/risk",
	"/legal/privacy",
	"/legal/terms",
	"/en",
	"/en/about",
];

const EN: Record<string, string> = { "/": "/en", "/about": "/en/about" };

export default function sitemap(): MetadataRoute.Sitemap {
	const entries: { path: string; lastModified?: string }[] = [
		...STATIC.map((path) => ({ path })),
		...allSignals.map((s) => ({
			path: `/ledger/${s.id}`,
			lastModified: "closedAt" in s && s.closedAt ? s.closedAt : s.registeredAt,
		})),
		...allCases.map((c) => ({ path: `/cases/${c.slug}` })),
		...allModules.map((m) => ({ path: `/tools/${m.slug}` })),
		...allResearch
			.filter((r) => !r.draft)
			.map((r) => ({
				path: `/research/${r.slug}`,
				lastModified: r.updatedAt ?? r.publishedAt,
			})),
	];
	return entries.map(({ path, lastModified }) => ({
		url: `${siteUrl}${path}`,
		...(lastModified ? { lastModified } : {}),
		...(EN[path]
			? {
					alternates: {
						languages: {
							"zh-CN": `${siteUrl}${path}`,
							en: `${siteUrl}${EN[path]}`,
						},
					},
				}
			: {}),
	}));
}
