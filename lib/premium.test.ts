import { describe, expect, it } from "vitest";
import {
	buildPremium,
	parseBinanceDaily,
	parseCoinbaseCandles,
	premiumSummary,
} from "./premium";

const t = (d: string) => Date.parse(`${d}T00:00:00Z`);
const cb = (d: string, close: number) => [t(d) / 1000, 0, 0, 0, close, 1];
const bn = (d: string, close: string) => [t(d), "0", "0", "0", close];

describe("premium", () => {
	it("computes (coinbase − binance) / binance in percent", () => {
		const days = buildPremium(
			parseCoinbaseCandles([cb("2026-10-01", 100.06)]),
			parseBinanceDaily([bn("2026-10-01", "100")]),
			t("2026-10-05"),
		);
		expect(days).toEqual([{ date: "2026-10-01", premiumPct: 0.06 }]);
	});
	it("withholds the last 24h: yesterday and today are never public", () => {
		const c = parseCoinbaseCandles(
			["09", "10", "11"].map((d) => cb(`2026-10-${d}`, 101)),
		);
		const b = parseBinanceDaily(
			["09", "10", "11"].map((d) => bn(`2026-10-${d}`, "100")),
		);
		const out = buildPremium(c, b, t("2026-10-11") + 3_600_000);
		expect(out.map((d) => d.date)).toEqual(["2026-10-09"]);
	});
	it("skips days missing on either side and caps at 30, oldest first", () => {
		const dates = Array.from({ length: 40 }, (_, i) =>
			new Date(t("2026-08-01") + i * 86_400_000).toISOString().slice(0, 10),
		);
		const c = parseCoinbaseCandles([...dates].reverse().map((d) => cb(d, 100)));
		const b = parseBinanceDaily(
			dates.filter((d) => d !== "2026-08-05").map((d) => bn(d, "100")),
		);
		const out = buildPremium(c, b, t("2026-12-01"));
		expect(out).toHaveLength(30);
		expect((out[0]?.date ?? "") < (out.at(-1)?.date ?? "")).toBe(true);
		expect(out.some((d) => d.date === "2026-08-05")).toBe(false);
	});
	it("rejects malformed payloads", () => {
		expect(() => parseCoinbaseCandles({ message: "rate limited" })).toThrow();
		expect(() => parseBinanceDaily([[0, "", "", "", "x"]])).toThrow();
	});
	it("summarises", () => {
		const days = [1, 2, 3, 4, 5, 6, 7, -1].map((p, i) => ({
			date: `2026-10-0${i + 1}`,
			premiumPct: p,
		}));
		const s = premiumSummary(days);
		expect(s?.positiveDays).toBe(7);
		expect(s?.avg7).toBe(3.71);
		expect(premiumSummary([])).toBeNull();
	});
});
