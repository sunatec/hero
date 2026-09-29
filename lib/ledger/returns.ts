import type { Direction } from "@/lib/schema/common";

/**
 * Closed return in percent, signed from the signal's point of view.
 * risk-alert is measured like a short: how much downside was avoided by exiting at the alert price.
 */
export function closedReturnPct(
	direction: Direction,
	entryPrice: number,
	exitPrice: number,
): number {
	const move = (exitPrice - entryPrice) / entryPrice;
	const signed = direction === "long" ? move : -move;
	return round1(signed * 100);
}

export function round1(n: number): number {
	return Math.round(n * 10) / 10;
}
