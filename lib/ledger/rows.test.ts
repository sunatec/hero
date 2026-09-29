import { describe, expect, it } from "vitest";
import {
	applyFilter,
	type LedgerRow,
	monthOf,
	PAGE_SIZE,
	paginate,
} from "./rows";

const row = (
	id: string,
	status: LedgerRow["status"],
	extra: Partial<LedgerRow> = {},
): LedgerRow => ({
	id,
	openedAt: "2026-10-10T09:12:00+08:00",
	registeredAt: "2026-10-10T09:50:00+08:00",
	status,
	direction: "long",
	chains: ["cex"],
	module: "oi-tracker",
	moduleLabel: "M-01 OI 异动预警",
	...extra,
});

const rows = [
	row("IC-2026-0001", "stopped"),
	row("IC-2026-0002", "hit", {
		module: "hyperliquid-radar",
		chains: ["hyperliquid"],
	}),
	row("IC-2026-0003", "open", {
		direction: "short",
		openedAt: "2026-11-01T00:30:00+08:00",
	}),
	row("IC-2026-0004", "void"),
];

describe("applyFilter", () => {
	const ids = (f: Parameters<typeof applyFilter>[1]) =>
		applyFilter(rows, f).map((r) => r.id);
	it("no filter keeps everything", () => expect(ids({})).toHaveLength(4));
	it("closed groups hit/invalidated/stopped/expired (not void)", () =>
		expect(ids({ status: "closed" })).toEqual([
			"IC-2026-0001",
			"IC-2026-0002",
		]));
	it("single status", () =>
		expect(ids({ status: "open" })).toEqual(["IC-2026-0003"]));
	it("module + chain", () =>
		expect(ids({ module: "hyperliquid-radar", chain: "hyperliquid" })).toEqual([
			"IC-2026-0002",
		]));
	it("direction", () =>
		expect(ids({ direction: "short" })).toEqual(["IC-2026-0003"]));
	it("month uses UTC+8", () =>
		expect(ids({ month: "2026-11" })).toEqual(["IC-2026-0003"]));
	it("unknown values match nothing", () =>
		expect(ids({ status: "bogus" })).toEqual([]));
});

describe("monthOf / paginate", () => {
	it("month in UTC+8", () =>
		expect(monthOf("2026-10-31T17:00:00Z")).toBe("2026-11"));
	const many = Array.from({ length: 120 }, (_, i) => i);
	it("pages of 50", () =>
		expect(paginate(many, 2)).toMatchObject({
			page: 2,
			pages: 3,
			items: many.slice(PAGE_SIZE, 100),
		}));
	it("clamps out-of-range pages", () => {
		expect(paginate(many, 99).page).toBe(3);
		expect(paginate(many, Number.NaN).page).toBe(1);
		expect(paginate([], 1)).toMatchObject({ page: 1, pages: 1, items: [] });
	});
});
