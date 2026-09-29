import { describe, expect, it } from "vitest";
import { chartModel, peakPrice } from "./chart";

describe("chartModel", () => {
	it("uses the fetched series and finds the favourable peak for longs", () => {
		const m = chartModel({
			direction: "long",
			entryPrice: 10,
			exitPrice: 11,
			mfePct: 30,
			series: { prices: [10, 12, 13, 11] },
		});
		expect(m).toEqual({
			series: [10, 12, 13, 11],
			entry: 0,
			peak: 2,
			exit: 3,
			sparse: false,
		});
	});
	it("finds the low as the peak for shorts and risk alerts", () => {
		expect(
			chartModel({
				direction: "short",
				entryPrice: 10,
				exitPrice: 9,
				mfePct: 20,
				series: { prices: [10, 8, 9] },
			}).peak,
		).toBe(1);
		expect(
			chartModel({
				direction: "risk-alert",
				entryPrice: 1,
				exitPrice: 0.8,
				mfePct: 30,
				series: { prices: [1, 0.9, 0.7, 0.8] },
			}).peak,
		).toBe(2);
	});
	it("falls back to a 3-point sketch without a series", () => {
		const m = chartModel({
			direction: "long",
			entryPrice: 38.2,
			exitPrice: 45.23,
			mfePct: 21.6,
		});
		expect(m.sparse).toBe(true);
		expect(m.series[1]).toBeCloseTo(46.45, 2);
	});
	it("peakPrice goes down for shorts", () =>
		expect(peakPrice("short", 100, 12)).toBe(88));
});
