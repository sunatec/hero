import type { Direction } from "@/lib/schema/common";

export type ChartModel = {
	series: number[];
	entry: number;
	peak: number;
	exit: number;
	/** true when drawn from the three key prices only (no fetched series). */
	sparse: boolean;
};

/** Price at the maximum favourable excursion implied by mfePct. */
export function peakPrice(
	direction: Direction,
	entry: number,
	mfePct: number,
): number {
	return direction === "long"
		? entry * (1 + mfePct / 100)
		: entry * (1 - mfePct / 100);
}

/**
 * Indices for the replay chart. With a fetched series: entry is the first point, exit the last,
 * peak the most favourable point for the direction. Without one: a 3-point sketch.
 */
export function chartModel(s: {
	direction: Direction;
	entryPrice: number;
	exitPrice: number;
	mfePct: number;
	series?: { prices: number[] };
}): ChartModel {
	const prices = s.series?.prices;
	if (prices && prices.length >= 2) {
		const pick = s.direction === "long" ? Math.max : Math.min;
		const best = pick(...prices);
		return {
			series: prices,
			entry: 0,
			peak: prices.indexOf(best),
			exit: prices.length - 1,
			sparse: false,
		};
	}
	return {
		series: [
			s.entryPrice,
			peakPrice(s.direction, s.entryPrice, s.mfePct),
			s.exitPrice,
		],
		entry: 0,
		peak: 1,
		exit: 2,
		sparse: true,
	};
}
