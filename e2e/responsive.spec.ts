import { expect, type Page, test } from "@playwright/test";

/**
 * M10: every page at the five widths from WEBSITE_PLAN §17 —
 * no page-level horizontal scroll, and ≥ 44px touch targets on phones.
 * Set SHOTS=1 to also write full-page screenshots to screenshots/responsive/ (git-ignored).
 */
const PAGES = [
	"/",
	"/ledger",
	"/ledger/IC-2026-0001",
	"/ledger/IC-2026-0003",
	"/cases",
	"/cases/2026-01-17-surge",
	"/methodology",
	"/tools",
	"/tools/smart-money-radar",
	"/tools/funding-rate",
	"/community",
	"/about",
	"/research",
	"/join",
	"/join/submitted",
	"/verify",
	"/legal/terms",
	"/en",
	"/en/about",
];
const WIDTHS = [360, 390, 768, 1024, 1440];

async function overflow(page: Page) {
	return page.evaluate(() => {
		const doc = document.documentElement;
		const excess = doc.scrollWidth - doc.clientWidth;
		if (excess <= 0) return null;
		// Report the widest offenders so a failure points at the cause.
		const offenders = [...document.querySelectorAll("body *")]
			.map((el) => ({ el, r: el.getBoundingClientRect() }))
			.filter(({ el, r }) => {
				if (r.right <= doc.clientWidth + 1 || r.width === 0) return false;
				// Content inside an intentional horizontal scroller is fine.
				for (let p = el.parentElement; p; p = p.parentElement) {
					const o = getComputedStyle(p).overflowX;
					if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip")
						return false;
				}
				return true;
			})
			.slice(0, 5)
			.map(
				({ el, r }) =>
					`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} → ${Math.round(r.right)}`,
			);
		return { excess, offenders };
	});
}

/** Controls that are not inline text links must be at least 44×44 (WCAG 2.5.8 exempts inline links). */
async function smallTargets(page: Page) {
	return page.evaluate(() => {
		const sel =
			"a, button, select, summary, input:not([type=radio]):not([type=checkbox]):not([type=hidden]), textarea, [role=button], label:has(input[type=radio]), label:has(input[type=checkbox])";
		const out: string[] = [];
		for (const el of document.querySelectorAll<HTMLElement>(sel)) {
			const cs = getComputedStyle(el);
			if (cs.visibility === "hidden" || cs.display === "none") continue;
			const box = el.getBoundingClientRect();
			if (box.width === 0 || box.height === 0) continue;
			// The `tap` utility widens the hit area with an absolutely positioned ::after.
			const after = getComputedStyle(el, "::after");
			const hit = after.content !== "none" && after.position === "absolute";
			const r = {
				top: box.top,
				width: Math.max(
					box.width,
					hit ? Number.parseFloat(after.width) || 0 : 0,
				),
				height: Math.max(
					box.height,
					hit ? Number.parseFloat(after.height) || 0 : 0,
				),
			};
			if (el.closest("[aria-hidden=true], .sr-only, [inert]")) continue;
			// Inline links inside running text are exempt.
			if (el.tagName === "A" && cs.display === "inline") {
				const block = el.parentElement;
				const text = block?.textContent?.trim() ?? "";
				if (text.length > (el.textContent?.trim().length ?? 0) + 4) continue;
			}
			// Hidden by the sticky bar's slide-out transform.
			if (r.top >= window.innerHeight + 10 && el.closest(".fixed")) continue;
			if (r.height < 44 || r.width < 44) {
				out.push(
					`${el.tagName.toLowerCase()} "${(el.textContent ?? el.getAttribute("aria-label") ?? "").trim().slice(0, 24)}" ${Math.round(r.width)}×${Math.round(r.height)}`,
				);
			}
		}
		return [...new Set(out)];
	});
}

for (const width of WIDTHS) {
	test.describe(`${width}px`, () => {
		test.use({ viewport: { width, height: width < 768 ? 844 : 900 } });
		for (const path of PAGES) {
			test(path, async ({ page }, info) => {
				test.skip(
					info.project.name !== "desktop",
					"viewport set per test; run once",
				);
				await page.route(
					"https://challenges.cloudflare.com/turnstile/**",
					(r) =>
						r.fulfill({
							contentType: "text/javascript",
							body: "window.turnstile={render(){return 'w'},reset(){},remove(){}}",
						}),
				);
				await page.goto(path);
				await page.waitForLoadState("networkidle");
				expect(
					await overflow(page),
					"page-level horizontal overflow",
				).toBeNull();
				if (width < 768)
					expect(await smallTargets(page), "touch targets < 44px").toEqual([]);
				if (process.env.SHOTS) {
					await page.screenshot({
						path: `screenshots/responsive/${width}/${path === "/" ? "home" : path.slice(1).replaceAll("/", "_")}.png`,
						fullPage: true,
					});
				}
			});
		}
	});
}

test("tapping a redaction shows its tip without widening the page", async ({
	page,
	isMobile,
}) => {
	test.skip(!isMobile, "touch only");
	await page.goto("/ledger/IC-2026-0003");
	await page.waitForLoadState("networkidle");
	const bars = page.locator("main [data-tip]:visible");
	const last = bars.last();
	await last.scrollIntoViewIfNeeded();
	await last.tap();
	await expect(last).toHaveAttribute("data-open", "");
	expect(await overflow(page)).toBeNull();
	await page.touchscreen.tap(4, 500);
	await expect(last).not.toHaveAttribute("data-open");
});

test("ledger filters open in a bottom sheet on phones", async ({
	page,
	isMobile,
}) => {
	test.skip(!isMobile, "phones only");
	await page.goto("/ledger");
	await page.waitForLoadState("networkidle");
	await expect(page.getByLabel("状态")).toBeHidden();
	await page.getByRole("button", { name: "筛选" }).click();
	const sheet = page.getByRole("dialog", { name: "筛选台账" });
	await expect(sheet).toBeVisible();
	const box = await sheet.boundingBox();
	const vh = page.viewportSize()?.height ?? 0;
	expect(Math.round((box?.y ?? 0) + (box?.height ?? 0))).toBe(vh);
	await sheet.getByRole("button", { name: "完成" }).click();
	await expect(sheet).toBeHidden();
});
