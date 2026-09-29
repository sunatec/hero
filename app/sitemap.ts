import {
	allCases,
	allModules,
	allResearch,
	allSignals,
} from "content-collections";
import type { MetadataRoute } from "next";
import { site } from "@/site.config";

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

export default function sitemap(): MetadataRoute.Sitemap {
	const paths = [
		...STATIC,
		...allSignals.map((s) => `/ledger/${s.id}`),
		...allCases.map((c) => `/cases/${c.slug}`),
		...allModules.map((m) => `/tools/${m.slug}`),
		...allResearch.filter((r) => !r.draft).map((r) => `/research/${r.slug}`),
	];
	return paths.map((p) => ({ url: `${site.url}${p}` }));
}
