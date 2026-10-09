import { z } from "zod";
import { Asset, Chain, DateTime, Demo, Direction, ModuleSlug } from "./common";

export const SignalId = z
	.string()
	.regex(/^IC-\d{4}-\d{4}$/, "id must look like IC-2026-0001");

export const SignalStatus = z.enum([
	"open",
	"hit",
	"invalidated",
	"stopped",
	"expired",
	"void",
]);
export type SignalStatus = z.infer<typeof SignalStatus>;
export const CLOSED_STATUSES = [
	"hit",
	"invalidated",
	"stopped",
	"expired",
] as const;

export const Evidence = z
	.strictObject({
		type: z.enum(["tg", "tx", "address", "chart", "x"]),
		url: z.url().optional(),
		image: z.string().optional(),
		note: z.string().max(120).optional(),
		capturedAt: DateTime.optional(),
	})
	.refine((e) => e.url || e.image, "evidence needs a url or an image");

const ChangelogEntry = z.strictObject({
	at: DateTime,
	note: z.string().min(4),
});

/** Fields that are public from the moment a signal is opened. */
const publicShape = {
	id: SignalId,
	openedAt: DateTime,
	registeredAt: DateTime,
	module: ModuleSlug,
	direction: Direction,
	chains: z.array(Chain).min(1),
	changelog: z.array(ChangelogEntry).default([]),
	commitHash: z
		.string()
		.regex(/^[a-f0-9]{64}$/)
		.optional(),
	demo: Demo,
};

/** Member-only until the signal closes. Must never be present on an open signal. */
const closedShape = {
	asset: Asset,
	quoteAsset: z.string().default("USDT"),
	entryPrice: z.number().positive(),
	targets: z.array(z.number().positive()).optional(),
	stopLoss: z.number().positive().optional(),
	invalidation: z.string().optional(),
	/** Q21-C: revealed at close so `commitHash` can be re-computed by anyone. */
	commitSalt: z
		.string()
		.regex(/^[a-f0-9]{32}$/)
		.optional(),
	maxHoldingDays: z.number().int().positive().default(30),
	closedAt: DateTime,
	exitPrice: z.number().positive(),
	mfePct: z.number(),
	maePct: z.number(),
	closedReturnPct: z.number(),
	evidence: z.array(Evidence).min(1),
	xUrl: z.url().optional(),
	/** A7: hourly closes from openedAt to closedAt, fetched by `pnpm close:signal`. Optional. */
	series: z
		.strictObject({
			source: z.string(),
			interval: z.enum(["15m", "1h", "4h", "1d"]),
			start: DateTime,
			prices: z.array(z.number().positive()).min(2).max(400),
		})
		.optional(),
};

export const OpenSignal = z.strictObject({
	...publicShape,
	status: z.literal("open"),
});

export const ClosedSignal = z.strictObject({
	...publicShape,
	...closedShape,
	status: z.enum(CLOSED_STATUSES),
});

export const VoidSignal = z.strictObject({
	...publicShape,
	...z.object(closedShape).partial().shape,
	status: z.literal("void"),
	voidReason: z.string().min(4),
});

export const SignalFrontmatter = z.union([
	OpenSignal,
	ClosedSignal,
	VoidSignal,
]);
export type Signal = z.infer<typeof SignalFrontmatter>;
export type OpenSignal = z.infer<typeof OpenSignal>;
export type ClosedSignal = z.infer<typeof ClosedSignal>;

/**
 * Parse with the variant chosen by `status`, so error messages point at the real problem
 * (e.g. "unrecognized key: asset" on an open signal) instead of a generic union failure.
 */
export function parseSignalFrontmatter(data: unknown) {
	const status = (data as { status?: unknown } | null)?.status;
	if (status === "open") return OpenSignal.safeParse(data);
	if (status === "void") return VoidSignal.safeParse(data);
	return ClosedSignal.safeParse(data);
}
