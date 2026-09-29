import { describe, expect, it } from "vitest";
import { parseSignalFrontmatter } from "@/lib/schema/signal";
import { closedReturnPct } from "./returns";
import { checkSequence, checkSignal } from "./rules";

const base = {
	id: "IC-2026-0001",
	openedAt: "2026-10-10T09:12:00+08:00",
	registeredAt: "2026-10-10T09:50:00+08:00",
	module: "oi-tracker",
	direction: "long",
	chains: ["cex"],
};

const closed = {
	...base,
	status: "stopped",
	asset: "$ARB",
	entryPrice: 0.412,
	closedAt: "2026-10-13T03:18:00+08:00",
	exitPrice: 0.379,
	mfePct: 6.3,
	maePct: -8,
	closedReturnPct: -8,
	evidence: [{ type: "tg", image: "/x.webp" }],
};

function parsed(data: unknown) {
	const r = parseSignalFrontmatter(data);
	if (!r.success) throw new Error(r.error.message);
	return r.data;
}

describe("closedReturnPct", () => {
	it("long", () => expect(closedReturnPct("long", 38.2, 45.23)).toBe(18.4));
	it("short profits when price falls", () =>
		expect(closedReturnPct("short", 100, 90)).toBe(10));
	it("risk-alert measures avoided downside like a short", () =>
		expect(closedReturnPct("risk-alert", 1, 0.7)).toBe(30));
	it("long loss", () => expect(closedReturnPct("long", 0.412, 0.379)).toBe(-8));
});

describe("schema: open signals never carry member-only fields", () => {
	it("accepts a minimal open signal", () => {
		expect(parseSignalFrontmatter({ ...base, status: "open" }).success).toBe(
			true,
		);
	});
	for (const leaked of [
		"asset",
		"entryPrice",
		"stopLoss",
		"targets",
		"invalidation",
		"exitPrice",
	]) {
		it(`rejects open signal with ${leaked}`, () => {
			const r = parseSignalFrontmatter({
				...base,
				status: "open",
				[leaked]: leaked === "asset" ? "$X" : 1,
			});
			expect(r.success).toBe(false);
		});
	}
	it("rejects unknown keys on closed signals too", () => {
		expect(parseSignalFrontmatter({ ...closed, secret: "x" }).success).toBe(
			false,
		);
	});
	it("requires voidReason on void signals", () => {
		expect(parseSignalFrontmatter({ ...base, status: "void" }).success).toBe(
			false,
		);
		expect(
			parseSignalFrontmatter({
				...base,
				status: "void",
				voidReason: "重复登记",
			}).success,
		).toBe(true);
	});
	it("rejects unquoted YAML timestamps (Date objects)", () => {
		expect(
			parseSignalFrontmatter({ ...base, status: "open", openedAt: new Date() })
				.success,
		).toBe(false);
	});
});

describe("checkSignal", () => {
	const ctx = { fileId: "IC-2026-0001", body: "" };
	const errors = (data: unknown, c = ctx) =>
		checkSignal(parsed(data), c).filter((i) => i.level === "error");

	it("passes a consistent closed signal", () =>
		expect(errors(closed)).toEqual([]));
	it("flags closed return above MFE (the M1 mockup bug)", () =>
		expect(
			errors({
				...closed,
				direction: "long",
				mfePct: 5,
				maePct: -2,
				closedReturnPct: 18.4,
				exitPrice: 0.4878,
			}),
		).not.toEqual([]));
	it("flags a return that does not match prices", () =>
		expect(errors({ ...closed, closedReturnPct: -5, maePct: -8 })).not.toEqual(
			[],
		));
	it("flags positive MAE", () =>
		expect(errors({ ...closed, maePct: 1 })).not.toEqual([]));
	it("flags closedAt before openedAt", () =>
		expect(
			errors({ ...closed, closedAt: "2026-10-09T00:00:00+08:00" }),
		).not.toEqual([]));
	it("flags an open signal with a body", () =>
		expect(
			errors({ ...base, status: "open" }, { ...ctx, body: "依据：…" }),
		).not.toEqual([]));
	it("flags id / file name mismatch", () =>
		expect(errors(closed, { ...ctx, fileId: "IC-2026-0002" })).not.toEqual([]));
	it("warns (not errors) on late registration", () => {
		const issues = checkSignal(
			parsed({
				...base,
				status: "open",
				registeredAt: "2026-10-10T12:00:00+08:00",
			}),
			ctx,
		);
		expect(issues.map((i) => i.level)).toEqual(["warning"]);
	});
});

describe("checkSequence", () => {
	it("accepts 1..N", () =>
		expect(checkSequence(["IC-2026-0002", "IC-2026-0001"])).toEqual([]));
	it("flags a gap", () =>
		expect(checkSequence(["IC-2026-0001", "IC-2026-0003"])).not.toEqual([]));
	it("flags a duplicate", () =>
		expect(checkSequence(["IC-2026-0001", "IC-2026-0001"])).not.toEqual([]));
	it("numbers each year independently", () =>
		expect(checkSequence(["IC-2026-0001", "IC-2027-0001"])).toEqual([]));
});
