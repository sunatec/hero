import { expect, test } from "@playwright/test";

/** M11: motion never hides first-frame content, and reduced motion disables it entirely. */
test.describe("with motion", () => {
	test.use({ reducedMotion: "no-preference" });

	test("nothing above the fold is ever hidden", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		const hiddenInView = await page.evaluate(
			() =>
				[
					...document.querySelectorAll<HTMLElement>("[data-motion=pending]"),
				].filter((el) => el.getBoundingClientRect().top < window.innerHeight)
					.length,
		);
		expect(hiddenInView).toBe(0);
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
	});

	test("below-the-fold elements reveal on scroll and numbers settle on the real value", async ({
		page,
	}) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		const pending = page.locator("[data-motion=pending]");
		expect(await pending.count()).toBeGreaterThan(0);
		const k = await page
			.locator("[data-reveal=line]")
			.evaluateAll((els) =>
				els.map((el) => el.getAttribute("data-motion")).lastIndexOf("pending"),
			);
		expect(k).toBeGreaterThanOrEqual(0);
		const line = page.locator("[data-reveal=line]").nth(k);
		await line.scrollIntoViewIfNeeded();
		await expect(line).toHaveAttribute("data-motion", "shown");
		// Numbers only count up when they started off-screen (phones); either way they end on the real value.
		const count = page.locator("[data-count]").first();
		const expected = String(await count.getAttribute("data-count"));
		await count.scrollIntoViewIfNeeded();
		await expect(count).toHaveText(expected, { timeout: 2000 });
		if (process.env.SHOTS) {
			await page.waitForTimeout(900);
			await page.screenshot({ path: "screenshots/motion/proof-motion.png" });
		}
	});

	test("ledger rows print in once scrolled into view", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		const rows = page.locator("[data-reveal=rows]:visible").first();
		await rows.scrollIntoViewIfNeeded();
		await expect(rows).toHaveAttribute("data-motion", "shown");
		await expect(rows.locator("> *").last()).toHaveCSS("opacity", "1", {
			timeout: 2000,
		});
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("no element is ever put into a pending or animated state", async ({
		page,
	}) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(300);
		expect(await page.locator("[data-motion]").count()).toBe(0);
		if (process.env.SHOTS)
			await page.screenshot({ path: "screenshots/motion/proof-reduced.png" });
	});
});
