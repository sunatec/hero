import { describe, expect, it } from "vitest";
import { accessFor, filterTools, type ToolRow, toolActions } from "./tools";

const base: ToolRow = {
	slug: "oi-tracker",
	code: "M-01",
	nameZh: "OI 异动预警",
	nameEn: "Elite OI Tracker",
	tagline: "t",
	category: "derivatives",
	status: "member",
	sources: [],
	chains: [],
	samples: [],
	ledgerCount: 0,
};

describe("toolActions", () => {
	it("only links to the detail page without a url", () => {
		expect(toolActions(base).map((a) => a.kind)).toEqual(["detail"]);
	});
	it("adds 打开工具 as soon as a url is set", () => {
		const a = toolActions({ ...base, url: "https://example.com/oi" });
		expect(a).toHaveLength(2);
		expect(a[1]).toEqual({
			kind: "open",
			href: "https://example.com/oi",
			label: "打开工具",
			external: true,
		});
	});
});

describe("accessFor", () => {
	it("member modules point to /join", () => {
		expect(accessFor(base).cta?.href).toBe("/join");
	});
	it("a url replaces the join CTA with 打开工具", () => {
		expect(accessFor({ ...base, url: "https://x.test" }).cta?.label).toBe(
			"打开工具",
		);
	});
	it("planned modules offer no CTA", () => {
		expect(accessFor({ ...base, status: "planned" }).cta).toBeUndefined();
	});
	it("public without url has no CTA", () => {
		expect(accessFor({ ...base, status: "public" }).cta).toBeUndefined();
	});
});

describe("filterTools", () => {
	const rows = [
		base,
		{ ...base, slug: "a", category: "smart-money", status: "beta" },
		{ ...base, slug: "b", category: "smart-money", status: "member" },
	] satisfies ToolRow[];
	it("filters by category and status together", () => {
		expect(filterTools(rows, {}).length).toBe(3);
		expect(filterTools(rows, { category: "smart-money" }).length).toBe(2);
		expect(
			filterTools(rows, { category: "smart-money", status: "beta" }).map(
				(r) => r.slug,
			),
		).toEqual(["a"]);
	});
});
