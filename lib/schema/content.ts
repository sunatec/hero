import { z } from "zod";
import {
	Asset,
	Chain,
	DateOnly,
	DateTime,
	Demo,
	Direction,
	ModuleSlug,
} from "./common";
import { SignalId } from "./signal";

export const CaseStudyFrontmatter = z.strictObject({
	date: DateOnly,
	assets: z.array(Asset).min(1),
	direction: Direction,
	method: z.enum([
		"address-cluster",
		"onchain-anomaly",
		"smart-money",
		"hype-monitor",
		"oi",
		"coinbase-premium",
		"dca",
		"other",
	]),
	module: ModuleSlug.optional(),
	result: z.enum(["profit", "loss", "avoided", "unknown"]),
	claim: z
		.strictObject({
			metric: z.literal("max-return"),
			value: z.string().optional(),
		})
		.optional(),
	titleOriginal: z.string(),
	summary: z.string().max(80).optional(),
	xUrl: z.url(),
	curated: z.literal(true),
	verified: z.boolean().default(false),
	featured: z.boolean().default(false),
	demo: Demo,
});
export type CaseStudyFrontmatter = z.infer<typeof CaseStudyFrontmatter>;

export const ModuleFrontmatter = z
	.strictObject({
		slug: ModuleSlug,
		code: z.string().regex(/^[MP]-\d{2}$/),
		nameZh: z.string(),
		nameEn: z.string(),
		tagline: z.string().max(40),
		category: z.enum([
			"derivatives",
			"institutional",
			"smart-money",
			"onchain-behavior",
			"custom",
			"market",
		]),
		status: z.enum(["member", "beta", "public", "planned"]),
		chains: z.array(Chain).default([]),
		sources: z.array(z.string()).default([]),
		frequency: z.string().optional(),
		delivery: z.string().optional(),
		limitations: z.array(z.string()).optional(),
		samples: z
			.array(
				z.strictObject({
					lines: z.array(z.string()).min(1),
					note: z.string().optional(),
				}),
			)
			.default([]),
		url: z.url().optional(),
		order: z.number().int(),
		demo: Demo,
	})
	.refine((m) => m.status === "planned" || (m.limitations?.length ?? 0) > 0, {
		message: "non-planned modules must list at least one limitation",
		path: ["limitations"],
	})
	.refine(
		(m) =>
			m.code.startsWith("P") ? m.status === "planned" : m.status !== "planned",
		{
			message:
				"code prefix P- is for planned modules only; M- for running ones",
			path: ["code"],
		},
	);
export type ModuleFrontmatter = z.infer<typeof ModuleFrontmatter>;

export const ResearchFrontmatter = z.strictObject({
	title: z.string().max(40),
	summary: z.string().max(120),
	publishedAt: DateTime,
	updatedAt: DateTime.optional(),
	tags: z.array(z.string()).max(4).default([]),
	relatedSignals: z.array(SignalId).default([]),
	relatedModules: z.array(ModuleSlug).default([]),
	cover: z.string().optional(),
	draft: z.boolean().default(false),
	demo: Demo,
});
export type ResearchFrontmatter = z.infer<typeof ResearchFrontmatter>;

export const AgentFrontmatter = z.strictObject({
	codename: z.string(),
	handle: z.string(),
	since: z.string(),
	focus: z.array(z.string()).max(4),
	style: z.string(),
	photo: z.string(),
	why: z.string().max(300),
	demo: Demo,
});
export type AgentFrontmatter = z.infer<typeof AgentFrontmatter>;
