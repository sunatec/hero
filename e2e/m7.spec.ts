import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("community: five benefits, rules, FAQ with pending answers marked", async ({
	page,
}) => {
	await page.goto("/community");
	await expect(page.getByRole("heading", { level: 1 })).toContainText(
		"中文实战交易者",
	);
	await expect(
		page.locator("#c1 ~ ol li, section[aria-labelledby=c1] ol > li"),
	).toHaveCount(5);
	await expect(page.getByText("0xRouter")).toHaveCount(0);
	const faq = page.locator("details", { hasText: "续费怎么算？" });
	await faq.locator("summary").click();
	await expect(faq.getByText("待补充")).toBeVisible();
});

test("about: placeholders are visible, not invented", async ({ page }) => {
	await page.goto("/about");
	await expect(page.getByText("待补充").first()).toBeVisible();
	await expect(page.getByText("Notion 收录的最早一条公开推文")).toBeVisible();
	await expect(page.getByText("@gongxifacai_998")).toBeVisible();
});

test("research: empty state while there are no articles", async ({
	page,
	request,
}) => {
	await page.goto("/research");
	await expect(page.getByText("第一篇 Research 正在撰写。")).toBeVisible();
	expect((await request.get("/research/__none__")).status()).toBe(404);
});

test.describe("english front door", () => {
	test("hreflang pairs link both ways", async ({ page }) => {
		await page.goto("/");
		await expect(
			page.locator('link[rel="alternate"][hreflang="en"]'),
		).toHaveAttribute("href", /\/en$/);
		await page.goto("/en");
		await expect(
			page.locator('link[rel="alternate"][hreflang="zh-CN"]'),
		).toHaveAttribute("href", /\/$/);
	});

	test("english content is marked lang=en and offers no apply CTA", async ({
		page,
	}) => {
		await page.goto("/en");
		await expect(page.locator('div[lang="en"] h1')).toHaveText("0xInChain");
		await expect(page.getByRole("link", { name: "申请加入" })).toHaveCount(0);
		await expect(
			page.getByText("It is Chinese-speaking only for now."),
		).toBeVisible();
		await expect(page.getByRole("contentinfo")).toContainText(
			"Nothing on this site is investment advice",
		);
	});

	test("language switch goes back to Chinese", async ({ page, isMobile }) => {
		test.skip(isMobile, "desktop switch; mobile uses the menu");
		await page.goto("/en");
		await page
			.getByRole("banner")
			.getByRole("link", { name: "中文", exact: true })
			.click();
		await expect(page).toHaveURL(/\/$/);
		await expect(
			page.getByRole("banner").getByRole("link", { name: "申请加入" }),
		).toBeVisible();
	});
});

test.describe("M7 a11y", () => {
	for (const path of [
		"/community",
		"/about",
		"/research",
		"/en",
		"/en/about",
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
