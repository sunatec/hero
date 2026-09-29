import { expect, test } from "@playwright/test";

test("homepage visual baseline", async ({ page }) => {
	await page.goto("/");
	await page.evaluate(() => document.fonts.ready);
	await expect(page).toHaveScreenshot("home.png", { fullPage: true });
});

test("hero card shows the most recently closed file, not the highest id", async ({
	page,
}) => {
	await page.goto("/");
	// demo data: IC-2026-0002 closed 10.13 16:40, after IC-2026-0001 (10.13 03:18)
	await expect(page.locator('[data-tab^="最新结案"]')).toHaveAttribute(
		"data-tab",
		"最新结案 · IC-2026-0002",
	);
});

test("open files on the homepage never reveal their asset", async ({
	page,
}) => {
	await page.goto("/");
	const row = page.locator("tr", { hasText: "IC-2026-0003" });
	await expect(row.locator('[aria-label="成员可见内容，已隐藏"]')).toHaveCount(
		1,
	);
});

test("section order follows WEBSITE_PLAN §6.1 (Research hidden while empty)", async ({
	page,
}) => {
	await page.goto("/");
	const titles = (await page.locator("main h2").allTextContents()).map((h) =>
		h.replace(/^§\s*\d+/, "").trim(),
	);
	expect(titles).toEqual([
		"证据",
		"我们盯什么",
		"最新台账",
		"情报如何产生",
		"情报样本",
		"链上工具箱",
		"精选案例",
		"主理人档案",
		"这间情报室适合谁",
		"加入",
	]);
});
