import { describe, expect, it } from "vitest";
import { parseSignalFrontmatter } from "@/lib/schema/signal";
import {
	closeFrontmatter,
	defaultSymbol,
	excursions,
	nextId,
	parseBinanceKlines,
	pickInterval,
} from "./close";
import { checkSignal } from "./rules";

const open = {
	id: "IC-2026-0003",
	status: "open",
	openedAt: "2026-10-14T10:02:00+08:00",
	registeredAt: "2026-10-14T10:31:00+08:00",
	module: "smart-money-radar",
	direction: "long" as const,
	chains: ["base"],
};

const klines = {
	highs: [1.0, 1.12, 1.08],
	lows: [0.98, 1.0, 0.95],
	closes: [1.0, 1.1, 1.05],
};

describe("pickInterval", () => {
	it("15m for short holds", () =>
		expect(pickInterval("2026-10-01T00:00:00Z", "2026-10-03T00:00:00Z")).toBe(
			"15m",
		));
	it("1h for a couple of weeks", () =>
		expect(pickInterval("2026-10-01T00:00:00Z", "2026-10-15T00:00:00Z")).toBe(
			"1h",
		));
	it("4h for a month", () =>
		expect(pickInterval("2026-10-01T00:00:00Z", "2026-11-01T00:00:00Z")).toBe(
			"4h",
		));
});

describe("klines", () => {
	it("maps $ARB to ARBUSDT", () =>
		expect(defaultSymbol("$arb")).toBe("ARBUSDT"));
	it("parses Binance rows", () =>
		expect(
			parseBinanceKlines([
				[0, "1", "1.2", "0.9", "1.1"],
				[1, "1.1", "1.3", "1.0", "1.25"],
			]),
		).toEqual({ highs: [1.2, 1.3], lows: [0.9, 1.0], closes: [1.1, 1.25] }));
	it("rejects empty or broken responses", () => {
		expect(() =>
			parseBinanceKlines({ code: -1121, msg: "Invalid symbol." }),
		).toThrow();
		expect(() =>
			parseBinanceKlines([
				[0, "1", "x", "1", "1"],
				[1, "1", "1", "1", "1"],
			]),
		).toThrow();
	});
});

describe("excursions", () => {
	it("long: highs for MFE, lows for MAE", () =>
		expect(excursions("long", 1, klines, 5)).toEqual({
			mfePct: 12,
			maePct: -5,
		}));
	it("short: mirrored", () =>
		expect(excursions("short", 1, klines, -5)).toEqual({
			mfePct: 5,
			maePct: -12,
		}));
	it("clamps so the closed return always sits inside the range", () =>
		expect(excursions("long", 1, klines, 15)).toEqual({
			mfePct: 15,
			maePct: -5,
		}));
});

describe("closeFrontmatter", () => {
	const input = {
		status: "hit" as const,
		asset: "$AERO",
		entryPrice: 1,
		exitPrice: 1.05,
		closedAt: "2026-10-16T09:00:00+08:00",
		evidence: [{ type: "tg" as const, image: "/ledger/IC-2026-0003/tg.webp" }],
	};

	it("produces a closed signal that passes the schema and every cross-field rule", () => {
		const out = closeFrontmatter(open, input, {
			source: "binance:AEROUSDT",
			interval: "1h",
			start: open.openedAt,
			klines,
		});
		const parsed = parseSignalFrontmatter(out);
		expect(parsed.success).toBe(true);
		if (parsed.success)
			expect(
				checkSignal(parsed.data, { fileId: "IC-2026-0003", body: "" }),
			).toEqual([]);
		expect(out).toMatchObject({ closedReturnPct: 5, mfePct: 12, maePct: -5 });
	});

	it("works without a series (MFE/MAE fall back to the closed return)", () => {
		const out = closeFrontmatter(open, input);
		expect(out).toMatchObject({ mfePct: 5, maePct: 0 });
		expect(parseSignalFrontmatter(out).success).toBe(true);
	});

	it("refuses to close twice", () =>
		expect(() =>
			closeFrontmatter({ ...open, status: "hit" }, input),
		).toThrow());
});

describe("nextId", () => {
	it("continues the year's sequence", () =>
		expect(
			nextId(["IC-2026-0001", "IC-2026-0002"], "2026-10-14T10:02:00+08:00"),
		).toBe("IC-2026-0003"));
	it("starts a new year at 0001 (UTC+8 year boundary)", () =>
		expect(nextId(["IC-2026-0099"], "2026-12-31T16:30:00Z")).toBe(
			"IC-2027-0001",
		));
});
