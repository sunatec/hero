import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("cases", () => {
	test("index: curated notice, every card labelled unverified", async ({
		page,
	}) => {
		await page.goto("/cases");
		await expect(
			page.getByRole("note").filter({ hasText: "精选 · 非完整记录" }),
		).toBeVisible();
		await expect(page.getByText("共 54 条")).toBeVisible();
		const cards = page.locator('main article[data-tab^="精选"]');
		expect(await cards.count()).toBe(54);
		expect(await cards.filter({ hasText: "未核验" }).count()).toBe(54);
	});

	test("claims are always shown as max-return", async ({ page }) => {
		await page.goto("/cases");
		const withClaim = page.locator('main article[data-tab^="精选"]', {
			hasText: "%",
		});
		expect(await withClaim.count()).toBeGreaterThan(20);
		expect(await withClaim.filter({ hasNotText: "最大涨幅口径" }).count()).toBe(
			0,
		);
	});

	test("filter: shorts and risk alerts", async ({ page }) => {
		await page.goto("/cases?direction=short");
		await expect(page.getByText(/当前筛选：\d+ 条/)).toBeVisible();
		const titles = await page
			.locator('main article[data-tab^="精选"] h3')
			.allTextContents();
		expect(titles.length).toBeGreaterThan(0);
		for (const t of titles) expect(t).toMatch(/做空|风险预警/);
	});

	test("detail: original quote, metric note and X link", async ({ page }) => {
		await page.goto("/cases/2026-05-23-btc");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			"$BTC 做空",
		);
		await expect(page.getByText("「81K $BTC 空单止盈」")).toBeVisible();
		await expect(
			page.getByRole("link", { name: /在 X 查看原帖/ }),
		).toHaveAttribute(
			"href",
			"https://x.com/0xInChain/status/2058036852230422548",
		);
	});

	test("the migration skipped $BNC", async ({ request }) => {
		const html = await (await request.get("/cases")).text();
		expect(html).not.toContain("$BNC");
	});

	test("cases never feed the ledger stats", async ({ page }) => {
		await page.goto("/ledger");
		await expect(
			page.locator("main p").filter({ hasText: "已登记" }).first(),
		).toContainText("已登记 3");
	});
});

test.describe("methodology", () => {
	test("table of contents jumps to each rule", async ({ page }) => {
		await page.goto("/methodology");
		await page.getByRole("link", { name: "06 收益口径" }).click();
		await expect(page).toHaveURL(/#returns$/);
		await expect(
			page.getByRole("heading", { name: /收益口径/ }),
		).toBeInViewport();
	});

	test("lists every closing status as a stamp", async ({ page }) => {
		await page.goto("/methodology");
		for (const s of ["命中", "止损", "失效", "超时", "作废"]) {
			await expect(page.locator(`[data-status]`, { hasText: s })).toHaveCount(
				1,
			);
		}
	});
});

test.describe("M6b a11y", () => {
	for (const path of ["/cases", "/cases/2026-05-23-btc", "/methodology"]) {
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
