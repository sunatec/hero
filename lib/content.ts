import {
	allAgents,
	allCases,
	allModules,
	allResearch,
	allSignals,
} from "content-collections";
import { byNewest, isClosed, ledgerStats } from "@/lib/ledger/stats";
import type { ModuleSlug } from "@/lib/schema/common";
import { site, TBD } from "@/site.config";

export type SignalDoc = (typeof allSignals)[number];
export type ModuleDoc = (typeof allModules)[number];
export type CaseDoc = (typeof allCases)[number];

export const signals: SignalDoc[] = [...allSignals].sort(byNewest);
export const stats = ledgerStats(signals);

/** Latest closed file for the hero card — shown as-is, never cherry-picked. */
export const latestClosed =
	signals
		.filter(isClosed)
		.sort((a, b) => Date.parse(b.closedAt) - Date.parse(a.closedAt))[0] ?? null;
export const latestOpen = signals.find((s) => s.status === "open") ?? null;

/** Configured start date, else the first opened signal, else null. */
export const ledgerStart: string | null =
	site.ledgerStartDate !== TBD
		? site.ledgerStartDate
		: (stats.firstOpenedAt?.slice(0, 10) ?? null);

export const modules: ModuleDoc[] = [...allModules].sort(
	(a, b) => a.order - b.order,
);
export const runningModules = modules.filter((m) => m.status !== "planned");
const moduleMap = new Map(modules.map((m) => [m.slug, m]));
export const moduleBySlug = (slug: ModuleSlug) => moduleMap.get(slug) ?? null;

export const featuredCases: CaseDoc[] = allCases
	.filter((c) => c.featured)
	.sort((a, b) => b.date.localeCompare(a.date))
	.slice(0, 3);

export const agent = allAgents[0] ?? null;

export const research = allResearch
	.filter((r) => !r.draft)
	.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

/** Distinct chains covered by running modules, in display order. */
const CHAIN_ORDER = ["eth", "bsc", "base", "sol", "hyperliquid"] as const;
const CHAIN_LABEL: Record<string, string> = {
	eth: "ETH",
	bsc: "BSC",
	base: "BASE",
	sol: "SOL",
	hyperliquid: "Hyperliquid",
};
export const coveredChains = CHAIN_ORDER.filter((c) =>
	runningModules.some((m) => m.chains.includes(c)),
).map((c) => CHAIN_LABEL[c] as string);
