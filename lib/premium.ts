/**
 * S1 (Q14-C): the public, delayed edition of the Coinbase premium module.
 * Daily closes only, and only days that ended at least 24h ago — the live hourly feed stays member-only.
 */
export type PremiumDay = { date: string; premiumPct: number };

const DAY = 86_400_000;
export const PUBLIC_DAYS = 30;

export const dayKey = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** Coinbase Exchange candles: [time(s), low, high, open, close, volume], newest first. */
export function parseCoinbaseCandles(rows: unknown): Map<string, number> {
	if (!Array.isArray(rows)) throw new Error("coinbase: not an array");
	const out = new Map<string, number>();
	for (const r of rows) {
		const [t = Number.NaN, , , , close = Number.NaN] = r as number[];
		if (!Number.isFinite(t) || !(close > 0))
			throw new Error("coinbase: bad candle");
		out.set(dayKey(t * 1000), close);
	}
	return out;
}

/** Binance klines: [openTime(ms), open, high, low, close(string), ...], oldest first. */
export function parseBinanceDaily(rows: unknown): Map<string, number> {
	if (!Array.isArray(rows)) throw new Error("binance: not an array");
	const out = new Map<string, number>();
	for (const r of rows) {
		const t = Number((r as unknown[])[0]);
		const close = Number((r as unknown[])[4]);
		if (!Number.isFinite(t) || !(close > 0))
			throw new Error("binance: bad kline");
		out.set(dayKey(t), close);
	}
	return out;
}

/**
 * premium = (Coinbase − Binance) / Binance. A day is published only once it is ≥ 24h old
 * (UTC day `d` becomes public at the end of `d + 1`), oldest first, at most PUBLIC_DAYS.
 */
export function buildPremium(
	coinbase: Map<string, number>,
	binance: Map<string, number>,
	now = Date.now(),
): PremiumDay[] {
	const cutoff = dayKey(now - DAY); // yesterday (UTC) is still too fresh
	return [...coinbase.keys()]
		.filter((d) => binance.has(d) && d < cutoff)
		.sort()
		.slice(-PUBLIC_DAYS)
		.map((date) => {
			const cb = coinbase.get(date) as number;
			const bn = binance.get(date) as number;
			return { date, premiumPct: Math.round(((cb - bn) / bn) * 10_000) / 100 };
		});
}

export function premiumSummary(days: PremiumDay[]) {
	if (!days.length) return null;
	const last7 = days.slice(-7);
	const avg = (xs: PremiumDay[]) =>
		Math.round((xs.reduce((s, d) => s + d.premiumPct, 0) / xs.length) * 100) /
		100;
	return {
		latest: days[days.length - 1] as PremiumDay,
		avg7: avg(last7),
		avg30: avg(days),
		positiveDays: days.filter((d) => d.premiumPct > 0).length,
		total: days.length,
	};
}
