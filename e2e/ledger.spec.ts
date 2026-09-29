import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const visibleIds = async (page: import("@playwright/test").Page) =>
	page.locator("main a[href^='/ledger/IC-']:visible").allTextContents();

test.describe("ledger index", () => {
	test("filters from the URL and shows the filtered count", async ({
		page,
	}) => {
		await page.goto("/ledger?status=closed");
		await expect(page.getByText("当前筛选：2 份")).toBeVisible();
		expect(await visibleIds(page)).toEqual(["IC-2026-0002", "IC-2026-0001"]);
	});

	test("changing a select updates the URL and the list; clear resets", async ({
		page,
	}) => {
		await page.goto("/ledger");
		// interact only after hydration, otherwise the change event has no listener yet
		await page.waitForLoadState("networkidle");
		await page.getByLabel("状态").selectOption("open");
		await expect(page).toHaveURL(/status=open/);
		expect(await visibleIds(page)).toEqual(["IC-2026-0003"]);
		await page.getByRole("button", { name: "清除筛选" }).click();
		await expect(page).toHaveURL(/\/ledger$/, { timeout: 15_000 });
		expect(await visibleIds(page)).toHaveLength(3);
	});

	test("an impossible filter shows the empty state", async ({ page }) => {
		await page.goto("/ledger?status=hit&direction=short");
		await expect(page.getByText("没有符合条件的档案。")).toBeVisible();
	});

	test("stats recompute for the filter", async ({ page }) => {
		await page.goto("/ledger?module=oi-tracker");
		await expect(
			page.locator("main p").filter({ hasText: "已登记" }).first(),
		).toContainText("已登记 1");
	});
});

test.describe("signal detail", () => {
	test("open file: member fields redacted, no asset anywhere in the HTML", async ({
		page,
	}) => {
		await page.goto("/ledger/IC-2026-0003");
		await expect(page.getByRole("heading", { level: 1 })).toContainText("做多");
		expect(
			await page.locator('main [aria-label="成员可见内容，已隐藏"]').count(),
		).toBeGreaterThanOrEqual(4);
		const html = await page.content();
		expect(html).not.toMatch(/entryPrice|closedReturnPct/);
	});

	test("closed file: returns, chart summary, thesis and evidence", async ({
		page,
	}) => {
		await page.goto("/ledger/IC-2026-0002");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			"$HYPE 做多",
		);
		await expect(page.getByText("+18.4%").first()).toBeVisible();
		await expect(page.locator("figcaption")).toContainText("命中结案于 45.23");
		await expect(
			page.getByText("依据", { exact: false }).first(),
		).toBeVisible();
		await expect(
			page.getByText("TG 推送截图 · 成员频道推送截图（示例）（截图待上传）"),
		).toBeVisible();
	});

	test("prev / next follow id order", async ({ page }) => {
		await page.goto("/ledger/IC-2026-0002");
		await expect(
			page.getByRole("link", { name: /上一份 IC-2026-0001/ }),
		).toBeVisible();
		await expect(
			page.getByRole("link", { name: /下一份 IC-2026-0003/ }),
		).toBeVisible();
	});

	test("has an og:image generated from the file", async ({ page, request }) => {
		await page.goto("/ledger/IC-2026-0002");
		const og = await page
			.locator('meta[property="og:image"]')
			.getAttribute("content");
		expect(og).toMatch(/\/ledger\/IC-2026-0002\/opengraph-image/);
		const res = await request.get(new URL(og as string).pathname);
		expect(res.status()).toBe(200);
		expect(res.headers()["content-type"]).toBe("image/png");
	});

	test("unknown ids 404", async ({ request }) => {
		expect((await request.get("/ledger/IC-2026-9999")).status()).toBe(404);
	});
});

test.describe("ledger a11y", () => {
	for (const path of [
		"/ledger",
		"/ledger?status=closed",
		"/ledger/IC-2026-0002",
		"/ledger/IC-2026-0003",
	]) {
		test(`axe: ${path}`, async ({ page }) => {
			await page.goto(path);
			const r = await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
				.analyze();
			const blocking = r.violations.filter(
				(v) => v.impact === "serious" || v.impact === "critical",
			);
			expect(
				blocking.map(
					(v) =>
						`${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
				),
			).toEqual([]);
		});
	}
});
