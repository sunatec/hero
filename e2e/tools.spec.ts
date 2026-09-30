import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const panes = (page: import("@playwright/test").Page) =>
	page.locator('section[aria-labelledby="modules-h"] article');

test("toolbox lists 8 running modules with a separate roadmap", async ({
	page,
}) => {
	await page.goto("/tools");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		"链上工具箱",
	);
	await expect(panes(page)).toHaveCount(8);
	await expect(
		page.getByRole("heading", { name: "Roadmap · 规划中" }),
	).toBeVisible();
	// Samples stay redacted; no pane offers 打开工具 until a module has a url.
	await expect(page.getByRole("link", { name: /打开/ })).toHaveCount(0);
});

test("category and status filters live in the URL", async ({ page }) => {
	await page.goto("/tools");
	await page.waitForLoadState("networkidle");
	await page.getByRole("button", { name: "聪明钱" }).click();
	await expect(page).toHaveURL(/category=smart-money/);
	await expect(panes(page)).toHaveCount(4);
	await page.getByRole("button", { name: "测试中" }).click();
	await expect(page).toHaveURL(/status=beta/);
	await expect(panes(page)).toHaveCount(2);
	await page.getByRole("button", { name: /^全部/ }).click();
	await expect(panes(page)).toHaveCount(2);
});

test("module detail walks the seven panes in order", async ({ page }) => {
	await page.goto("/tools/oi-tracker");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		"OI 异动预警",
	);
	const titles = await page.locator("main h2").allTextContents();
	expect(titles).toEqual([
		"它是什么",
		"为什么重要",
		"数据源与方法",
		"推送样例",
		"局限性",
		"关联台账",
		"如何获得",
	]);
	await expect(
		page.getByRole("link", { name: /申请加入/ }).last(),
	).toHaveAttribute("href", "/join");
});

test("planned module shows no data panes and no CTA", async ({ page }) => {
	await page.goto("/tools/funding-rate");
	await expect(page.locator("main h2")).toHaveText(["它是什么", "如何获得"]);
	await expect(page.getByText("规划中，上线时间待定。")).toBeVisible();
});

for (const path of [
	"/tools",
	"/tools/smart-money-radar",
	"/tools/funding-rate",
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
				(v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
			),
		).toEqual([]);
	});
}
