import { expect, type Page, test } from "@playwright/test";

/** §20 events: names, props, and never any form content. */
type Ev = [string, Record<string, string> | undefined];

async function capture(page: Page) {
	await page.addInitScript(() => {
		const w = window as unknown as { __ev: unknown[]; plausible: unknown };
		w.__ev = [];
		w.plausible = (e: string, o?: { props?: unknown }) =>
			w.__ev.push([e, o?.props]);
	});
}
const events = (page: Page) =>
	page.evaluate(() => (window as unknown as { __ev: Ev[] }).__ev);

test.beforeEach(async ({ page }, info) => {
	test.skip(
		info.project.name !== "desktop",
		"event wiring is viewport-independent",
	);
	await capture(page);
});

test("apply CTA clicks carry their location", async ({ page }) => {
	await page.goto("/ledger");
	await page.waitForLoadState("networkidle");
	await page
		.getByRole("banner")
		.getByRole("link", { name: "申请加入" })
		.click();
	await expect(page).toHaveURL(/\/join$/);
	expect(await events(page)).toContainEqual([
		"cta_apply_click",
		{ location: "nav" },
	]);
});

test("ledger filters and redaction hovers are tracked", async ({ page }) => {
	await page.goto("/ledger");
	await page.waitForLoadState("networkidle");
	await page.getByLabel("状态").selectOption("open");
	await page.locator("main [data-tip]:visible").first().hover();
	const ev = await events(page);
	expect(ev).toContainEqual([
		"ledger_filter",
		{ key: "status", value: "open" },
	]);
	expect(ev).toContainEqual(["redaction_reveal", { location: "/ledger" }]);
	expect(ev.filter(([e]) => e === "redaction_reveal")).toHaveLength(1);
});

test("join form funnel events contain no answers", async ({ page }) => {
	await page.route("https://challenges.cloudflare.com/turnstile/**", (r) =>
		r.fulfill({
			contentType: "text/javascript",
			body: "window.turnstile={render(el,o){setTimeout(()=>o.callback('e2e-pass'),20);return 'w'},reset(){},remove(){}}",
		}),
	);
	await page.goto("/join");
	await page.waitForLoadState("networkidle");
	const handle = `track_${Date.now().toString(36)}`;
	await page.getByLabel("TG 用户名").fill(handle);
	await page.getByRole("radio", { name: "1–3 年" }).check();
	await page.getByRole("checkbox", { name: "现货" }).check();
	await page.getByRole("radio", { name: "X", exact: true }).check();
	await page.getByRole("checkbox", { name: /我已阅读并理解/ }).check();
	// The page navigates on success, so mirror events into sessionStorage to read them afterwards.
	await page.evaluate(() => {
		const w = window as unknown as { __ev: unknown[] };
		const push = w.__ev.push.bind(w.__ev);
		w.__ev.push = (...items: unknown[]) => {
			sessionStorage.setItem("__ev", JSON.stringify([...w.__ev, ...items]));
			return push(...items);
		};
	});
	await page.getByRole("button", { name: "提交申请" }).click();
	await expect(page).toHaveURL(/\/join\/submitted$/);
	const ev = JSON.parse(
		(await page.evaluate(() => sessionStorage.getItem("__ev"))) ?? "[]",
	) as Ev[];
	const names = ev.map(([e]) => e);
	expect(names).toEqual(
		expect.arrayContaining([
			"apply_form_start",
			"apply_form_submit",
			"apply_form_success",
		]),
	);
	expect(JSON.stringify(ev)).not.toContain(handle);
});
