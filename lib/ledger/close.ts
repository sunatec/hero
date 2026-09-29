import type { Direction } from "@/lib/schema/common";
import { closedReturnPct, round1 } from "./returns";

export type Interval = "15m" | "1h" | "4h" | "1d";
export type Klines = { closes: number[]; highs: number[]; lows: number[] };

const HOUR = 3_600_000;
const INTERVAL_MS: Record<Interval, number> = {
	"15m": HOUR / 4,
	"1h": HOUR,
	"4h": 4 * HOUR,
	"1d": 24 * HOUR,
};

/** Pick the finest interval that keeps the series at or under 400 points (schema max). */
export function pickInterval(openedAt: string, closedAt: string): Interval {
	const span = Date.parse(closedAt) - Date.parse(openedAt);
	const order: Interval[] = ["15m", "1h", "4h", "1d"];
	return order.find((i) => span / INTERVAL_MS[i] <= 399) ?? "1d";
}

/** `$ARB` → `ARBUSDT` (Binance spot convention). Override with --symbol when it differs. */
export function defaultSymbol(asset: string): string {
	return `${asset.replace(/^\$/, "").toUpperCase()}USDT`;
}

/** Binance /api/v3/klines rows: [openTime, open, high, low, close, ...] as strings. */
export function parseBinanceKlines(rows: unknown): Klines {
	if (!Array.isArray(rows) || rows.length < 2)
		throw new Error("not enough klines returned");
	const num = (v: unknown) => {
		const n = Number(v);
		if (!Number.isFinite(n) || n <= 0)
			throw new Error(`bad kline value: ${String(v)}`);
		return n;
	};
	return {
		highs: rows.map((r) => num((r as unknown[])[2])),
		lows: rows.map((r) => num((r as unknown[])[3])),
		closes: rows.map((r) => num((r as unknown[])[4])),
	};
}

/**
 * MFE / MAE from candle extremes, signed from the signal's point of view.
 * Clamped so the invariant mae ≤ closedReturn ≤ mfe always holds (candles can miss the exact fill).
 */
export function excursions(
	direction: Direction,
	entry: number,
	k: Klines,
	closedReturn: number,
) {
	const hi = Math.max(...k.highs);
	const lo = Math.min(...k.lows);
	const up = ((hi - entry) / entry) * 100;
	const down = ((lo - entry) / entry) * 100;
	const [mfe, mae] = direction === "long" ? [up, down] : [-down, -up];
	return {
		mfePct: round1(Math.max(mfe, closedReturn, 0)),
		maePct: round1(Math.min(mae, closedReturn, 0)),
	};
}

export type CloseInput = {
	status: "hit" | "invalidated" | "stopped" | "expired";
	asset: string;
	entryPrice: number;
	exitPrice: number;
	closedAt: string;
	targets?: number[];
	stopLoss?: number;
	invalidation?: string;
	xUrl?: string;
	evidence: {
		type: "tg" | "tx" | "address" | "chart" | "x";
		url?: string;
		image?: string;
		note?: string;
	}[];
};

/** Turn an open signal's frontmatter into a closed one. Pure — the script does the IO. */
export function closeFrontmatter(
	open: Record<string, unknown> & {
		direction: Direction;
		status: string;
		openedAt: string;
	},
	input: CloseInput,
	series?: {
		source: string;
		interval: Interval;
		start: string;
		klines: Klines;
	},
): Record<string, unknown> {
	if (open.status !== "open")
		throw new Error(`signal is already ${open.status}`);
	const ret = closedReturnPct(
		open.direction,
		input.entryPrice,
		input.exitPrice,
	);
	const ex = series
		? excursions(open.direction, input.entryPrice, series.klines, ret)
		: { mfePct: Math.max(ret, 0), maePct: Math.min(ret, 0) };
	const out: Record<string, unknown> = {
		...open,
		status: input.status,
		asset: input.asset,
		entryPrice: input.entryPrice,
		...(input.targets?.length ? { targets: input.targets } : {}),
		...(input.stopLoss ? { stopLoss: input.stopLoss } : {}),
		...(input.invalidation ? { invalidation: input.invalidation } : {}),
		closedAt: input.closedAt,
		exitPrice: input.exitPrice,
		mfePct: ex.mfePct,
		maePct: ex.maePct,
		closedReturnPct: ret,
		evidence: input.evidence,
		...(input.xUrl ? { xUrl: input.xUrl } : {}),
	};
	if (series) {
		out.series = {
			source: series.source,
			interval: series.interval,
			start: series.start,
			prices: series.klines.closes.slice(0, 400),
		};
	}
	return out;
}

/** Next sequential id for the year of `openedAt`. Voided ids still count. */
export function nextId(existing: string[], openedAt: string): string {
	const year = new Date(Date.parse(openedAt) + 8 * HOUR).getUTCFullYear();
	const nums = existing
		.filter((id) => id.startsWith(`IC-${year}-`))
		.map((id) => Number(id.slice(8)));
	const next = (nums.length ? Math.max(...nums) : 0) + 1;
	return `IC-${year}-${String(next).padStart(4, "0")}`;
}
