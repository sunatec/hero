import { expect, test } from "@playwright/test";

/** Keyboard walk-through (WEBSITE_PLAN §22): every key flow works without a mouse. */

// Safari only Tabs to links / radios when the user enables it in system settings, so the
// Tab-order checks run in Chromium and Firefox; WebKit still runs the non-Tab flows.
const SAFARI_TAB = "Safari's default Tab order skips links and radios";

test("skip link is the first stop and moves focus to main", async ({
	page,
	browserName,
}) => {
	test.skip(browserName === "webkit", SAFARI_TAB);
	await page.goto("/ledger");
	await page.keyboard.press("Tab");
	const skip = page.getByRole("link", { name: "跳到主要内容" });
	await expect(skip).toBeFocused();
	await page.keyboard.press("Enter");
	await expect(page).toHaveURL(/#main$/);
});

test("focus is always visible on interactive elements", async ({
	page,
	isMobile,
	browserName,
}) => {
	test.skip(
		isMobile || browserName === "webkit",
		"desktop Chromium / Firefox tab order",
	);
	await page.goto("/");
	await page.waitForLoadState("networkidle");
	for (let i = 0; i < 12; i++) {
		await page.keyboard.press("Tab");
		const outline = await page.evaluate(() => {
			const el = document.activeElement as HTMLElement | null;
			if (!el || el === document.body) return "none";
			const cs = getComputedStyle(el);
			return cs.outlineStyle === "none" || cs.outlineWidth === "0px"
				? `none:${el.outerHTML.slice(0, 60)}`
				: "ok";
		});
		expect(outline).toBe("ok");
	}
});

test("mobile menu opens with the keyboard, traps nothing, closes on Escape", async ({
	page,
	isMobile,
}) => {
	test.skip(!isMobile, "menu is phone-only");
	await page.goto("/");
	await page.waitForLoadState("networkidle");
	const button = page.getByRole("button", { name: "菜单" });
	await button.focus();
	await page.keyboard.press("Enter");
	const dialog = page.getByRole("dialog");
	await expect(dialog).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(dialog).toBeHidden();
	await expect(button).toBeFocused();
});

test("FAQ answers open with the keyboard", async ({ page }) => {
	await page.goto("/community");
	const summary = page.locator("summary", { hasText: "数据从哪里来？" });
	await summary.focus();
	await page.keyboard.press("Enter");
	await expect(page.locator("details", { has: summary })).toHaveAttribute(
		"open",
		"",
	);
});

test("the join form can be completed with the keyboard alone", async ({
	page,
	browserName,
}) => {
	test.skip(browserName === "webkit", SAFARI_TAB);
	await page.route("https://challenges.cloudflare.com/turnstile/**", (r) =>
		r.fulfill({
			contentType: "text/javascript",
			body: "window.turnstile={render(el,o){setTimeout(()=>o.callback('e2e-pass'),20);return 'w'},reset(){},remove(){}}",
		}),
	);
	await page.goto("/join");
	await page.waitForLoadState("networkidle");
	await page.getByLabel("TG 用户名").focus();
	await page.keyboard.type("keyboard_only");
	// Radios: Tab into the group, arrows move the selection.
	await page.keyboard.press("Tab");
	await page.keyboard.press("Space");
	await expect(page.getByRole("radio", { name: "1 年以内" })).toBeChecked();
	await page.keyboard.press("ArrowRight");
	await expect(page.getByRole("radio", { name: "1–3 年" })).toBeChecked();
	await page.getByRole("checkbox", { name: "现货" }).focus();
	await page.keyboard.press("Space");
	await expect(page.getByRole("checkbox", { name: "现货" })).toBeChecked();
	await page.getByRole("radio", { name: "Telegram" }).focus();
	await page.keyboard.press("Space");
	await page.getByRole("checkbox", { name: /我已阅读并理解/ }).focus();
	await page.keyboard.press("Space");
	await page.getByRole("button", { name: "提交申请" }).focus();
	await page.keyboard.press("Enter");
	await expect(page).toHaveURL(/\/join\/submitted$/);
});
