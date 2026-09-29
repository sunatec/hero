import { z } from "zod";

/** ISO 8601 with explicit offset, e.g. 2026-10-14T10:02:00+08:00 */
export const DateTime = z.iso.datetime({ offset: true });
export const DateOnly = z.iso.date();

export const Asset = z
	.string()
	.regex(/^\$\S+$/, "asset must look like $TICKER");

export const Chain = z.enum([
	"eth",
	"bsc",
	"base",
	"sol",
	"hyperliquid",
	"cex",
	"other",
]);
export type Chain = z.infer<typeof Chain>;

export const Direction = z.enum(["long", "short", "risk-alert"]);
export type Direction = z.infer<typeof Direction>;

export const ModuleSlug = z.enum([
	"oi-tracker",
	"coinbase-premium",
	"smart-money-radar",
	"hyperliquid-radar",
	"hype-whale-watcher",
	"kol-asset-tracker",
	"jup-dca",
	"custom-intel",
	"funding-rate",
	"liquidation-map",
	"token-search",
	"market-dashboard",
]);
export type ModuleSlug = z.infer<typeof ModuleSlug>;

/** Marks placeholder/demo content. Production builds refuse any demo document. */
export const Demo = z.boolean().optional();
