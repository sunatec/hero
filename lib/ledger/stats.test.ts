import { describe, expect, it } from "vitest";
import { byNewest, ledgerStats, median } from "./stats";

const closed = (
	id: string,
	status: "hit" | "stopped" | "invalidated" | "expired",
	ret: number,
	days = 2,
) => ({
	id,
	status,
	openedAt: "2026-10-01T00:00:00+08:00",
	closedAt: new Date(
		Date.parse("2026-10-01T00:00:00+08:00") + days * 86_400_000,
	).toISOString(),
	closedReturnPct: ret,
});

describe("median", () => {
	it("odd", () => expect(median([3, -8, 18.4])).toBe(3));
	it("even", () => expect(median([1, 2, 3, 4])).toBe(2.5));
	it("empty", () => expect(median([])).toBeNull());
});

describe("ledgerStats", () => {
	const signals = [
		closed("IC-2026-0001", "hit", 18.4, 2),
		closed("IC-2026-0002", "stopped", -8, 3),
		{
			id: "IC-2026-0003",
			status: "open" as const,
			openedAt: "2026-10-14T10:02:00+08:00",
		},
		{
			id: "IC-2026-0004",
			status: "void" as const,
			openedAt: "2026-09-30T10:00:00+08:00",
		},
	];
	const s = ledgerStats(signals);

	it("counts every registered id including void", () =>
		expect(s.registered).toBe(4));
	it("counts per status", () =>
		expect(s.counts).toEqual({
			open: 1,
			hit: 1,
			invalidated: 0,
			stopped: 1,
			expired: 0,
			void: 1,
		}));
	it("ignores open and void in return stats", () => {
		expect(s.closed).toBe(2);
		expect(s.medianReturn).toBe(5.2);
	});
	it("averages holding days over closed only", () =>
		expect(s.avgHoldingDays).toBe(2.5));
	it("flags small samples", () => expect(s.smallSample).toBe(true));
	it("finds the first opened date", () =>
		expect(s.firstOpenedAt).toBe("2026-09-30T10:00:00+08:00"));
	it("handles an empty ledger", () => {
		const e = ledgerStats([]);
		expect([
			e.registered,
			e.medianReturn,
			e.avgHoldingDays,
			e.firstOpenedAt,
		]).toEqual([0, null, null, null]);
	});
	it("sorts newest first", () =>
		expect(
			signals
				.map((x) => x.id)
				.sort()
				.reverse(),
		).toEqual([...signals].sort(byNewest).map((x) => x.id)));
});
