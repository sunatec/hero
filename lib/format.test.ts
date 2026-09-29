import { describe, expect, it } from "vitest";
import {
	formatDate,
	formatDateTime,
	formatPct,
	formatShort,
	holdingDays,
	pctTone,
} from "./format";
import { parseRedacted } from "./redact";

describe("formatPct", () => {
	it("adds a plus sign", () => expect(formatPct(18.4)).toBe("+18.4%"));
	it("uses U+2212 for negatives", () => expect(formatPct(-8)).toBe("−8.0%"));
	it("rounds to one decimal", () => expect(formatPct(21.649)).toBe("+21.6%"));
	it("renders zero without a sign", () => expect(formatPct(0)).toBe("0.0%"));
	it("does not produce negative zero", () =>
		expect(formatPct(-0.04)).toBe("0.0%"));
	it("tones", () =>
		expect([pctTone(1), pctTone(-1), pctTone(0)]).toEqual([
			"gain",
			"loss",
			"flat",
		]));
});

describe("dates are always UTC+8", () => {
	it("formats a +08:00 timestamp as-is", () =>
		expect(formatDateTime("2026-10-14T10:02:00+08:00")).toBe(
			"2026.10.14 10:02",
		));
	it("converts a UTC timestamp", () =>
		expect(formatDateTime("2026-10-14T02:02:00Z")).toBe("2026.10.14 10:02"));
	it("rolls over midnight", () =>
		expect(formatShort("2026-10-13T20:30:00Z")).toBe("10.14 04:30"));
	it("formats date-only strings", () =>
		expect(formatDate("2026-05-27")).toBe("2026.05.27"));
	it("counts holding days (min 1)", () => {
		expect(
			holdingDays("2026-10-10T09:12:00+08:00", "2026-10-13T03:18:00+08:00"),
		).toBe(3);
		expect(
			holdingDays("2026-10-10T09:12:00+08:00", "2026-10-10T10:00:00+08:00"),
		).toBe(1);
	});
});

describe("parseRedacted", () => {
	it("splits text and redactions", () =>
		expect(parseRedacted("集群 ▇{8} 共 6 地址")).toEqual([
			{ kind: "text", text: "集群 " },
			{ kind: "redact", width: 8 },
			{ kind: "text", text: " 共 6 地址" },
		]));
	it("handles adjacent and edge tokens", () =>
		expect(parseRedacted("▇{3}▇{4}")).toEqual([
			{ kind: "redact", width: 3 },
			{ kind: "redact", width: 4 },
		]));
	it("clamps widths", () =>
		expect(parseRedacted("▇{1} ▇{99}")[0]).toEqual({
			kind: "redact",
			width: 2,
		}));
	it("leaves plain text alone", () =>
		expect(parseRedacted("OI +14.2%")).toEqual([
			{ kind: "text", text: "OI +14.2%" },
		]));
});

describe("formatPrice / daysSince", async () => {
	const { formatPrice, daysSince } = await import("./format");
	it("two decimals above 1", () => expect(formatPrice(38.2)).toBe("38.20"));
	it("four significant digits below 1", () =>
		expect(formatPrice(0.412)).toBe("0.4120"));
	it("tiny prices", () => expect(formatPrice(0.000012346)).toBe("0.00001235"));
	it("counts the start day as day 1", () =>
		expect(
			daysSince("2026-10-01", Date.parse("2026-10-01T15:00:00+08:00")),
		).toBe(1));
	it("counts later days", () =>
		expect(
			daysSince("2026-10-01", Date.parse("2026-10-14T09:00:00+08:00")),
		).toBe(14));
});
