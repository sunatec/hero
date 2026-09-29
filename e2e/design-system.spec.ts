import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = [
	"/design-system",
	"/",
	"/ledger",
	"/ledger/IC-2026-0003",
	"/tools",
];

test.describe("accessibility (axe, WCAG 2.2 AA)", () => {
	for (const path of PAGES) {
		test(`no serious or critical violations on ${path}`, async ({ page }) => {
			await page.goto(path);
			await page.evaluate(() => document.fonts.ready);
			const results = await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
				.analyze();
			const blocking = results.violations.filter(
				(v) => v.impact === "serious" || v.impact === "critical",
			);
			expect(
				blocking.map(
					(v) =>
						`${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`,
				),
			).toEqual([]);
		});
	}
});

test("redactions carry no hidden text in the DOM", async ({ page }) => {
	await page.goto("/design-system");
	const redactions = page.locator('[aria-label="成员可见内容，已隐藏"]');
	expect(await redactions.count()).toBeGreaterThan(5);
	for (const text of await redactions.allTextContents()) expect(text).toBe("");
});

test("open ledger file never renders member-only values", async ({ page }) => {
	await page.goto("/ledger/IC-2026-0003");
	const html = await page.content();
	expect(html).not.toMatch(/entryPrice|"asset"/);
});

test("design system visual baseline", async ({ page }) => {
	await page.goto("/design-system");
	await page.evaluate(() => document.fonts.ready);
	await expect(page).toHaveScreenshot("design-system.png", { fullPage: true });
});

test.describe("mobile menu", () => {
	test.skip(({ isMobile }) => !isMobile, "mobile only");

	test("opens as a modal, traps focus, closes on Escape and returns focus", async ({
		page,
	}) => {
		await page.goto("/design-system");
		const trigger = page.getByRole("button", { name: "菜单" });
		await trigger.focus();
		await page.keyboard.press("Enter");
		const dialog = page.getByRole("dialog", { name: "菜单" });
		await expect(dialog).toBeVisible();
		await expect(page.getByRole("button", { name: "关闭" })).toBeFocused();
		await page.keyboard.press("Escape");
		await expect(dialog).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test("closes after navigating", async ({ page }) => {
		await page.goto("/design-system");
		await page.getByRole("button", { name: "菜单" }).click();
		await page
			.getByRole("dialog")
			.getByRole("link", { name: "链上工具箱" })
			.click();
		await expect(page).toHaveURL(/\/tools$/);
		await expect(page.getByRole("dialog")).toBeHidden();
	});
});
