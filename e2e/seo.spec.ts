import { expect, type Page, test } from "@playwright/test";

const meta = (page: Page, sel: string) =>
	page.locator(sel).first().getAttribute("content");

async function jsonLd(page: Page) {
	const blocks = await page
		.locator('script[type="application/ld+json"]')
		.allTextContents();
	return blocks.flatMap((b) => {
		const d = JSON.parse(b) as unknown; // throws on invalid JSON → test fails
		return Array.isArray(d) ? d : [d];
	}) as { "@type": string; [k: string]: unknown }[];
}

const PAGES: [string, string[]][] = [
	["/", ["Organization", "WebSite"]],
	["/ledger", ["ItemList"]],
	["/ledger/IC-2026-0001", ["BreadcrumbList"]],
	["/cases/2026-01-17-surge", ["BreadcrumbList"]],
	["/tools/oi-tracker", ["BreadcrumbList"]],
	["/community", []],
	["/en", ["Organization", "WebSite"]],
];

for (const [path, types] of PAGES) {
	test(`seo: ${path}`, async ({ page, request }, info) => {
		test.skip(
			info.project.name !== "desktop",
			"markup is identical across viewports",
		);
		await page.goto(path);
		const canonical = await page
			.locator('link[rel="canonical"]')
			.getAttribute("href");
		expect(canonical, "canonical").toMatch(
			new RegExp(`${path === "/" ? "/?" : path}$`),
		);
		expect(await page.title()).toMatch(/0xInChain/);
		expect(
			(await meta(page, 'meta[name="description"]'))?.length ?? 0,
		).toBeGreaterThan(20);
		expect(await meta(page, 'meta[property="og:title"]')).toBeTruthy();
		expect(await meta(page, 'meta[name="twitter:card"]')).toBe(
			"summary_large_image",
		);
		const og = await meta(page, 'meta[property="og:image"]');
		expect(og, "og:image").toBeTruthy();
		// Detail pages must use their own card, not the brand default.
		if (/^\/(ledger|cases|tools)\/./.test(path))
			expect(og).toContain(`${path}/opengraph-image`);
		const ogPath = new URL(String(og)).pathname;
		// The dev server compiles image routes on first hit and can 500 while doing so concurrently.
		await expect
			.poll(async () => (await request.get(ogPath)).status(), {
				timeout: 20_000,
			})
			.toBe(200);
		expect((await request.get(ogPath)).headers()["content-type"]).toContain(
			"image/png",
		);
		const ld = await jsonLd(page);
		for (const t of types) expect(ld.map((d) => d["@type"])).toContain(t);
		for (const d of ld) expect(d["@context"]).toBe("https://schema.org");
	});
}

test("noindex on the confirmation page", async ({ page }, info) => {
	test.skip(info.project.name !== "desktop");
	await page.goto("/join/submitted");
	expect(await meta(page, 'meta[name="robots"]')).toContain("noindex");
});

test("sitemap lists ledger files with hreflang for the home pair; robots blocks non-production", async ({
	request,
}, info) => {
	test.skip(info.project.name !== "desktop");
	const xml = await (await request.get("/sitemap.xml")).text();
	expect(xml).toContain("/ledger/IC-2026-0001</loc>");
	expect(xml).toContain('hreflang="en"');
	expect(xml).not.toContain("/join/submitted");
	const robots = await (await request.get("/robots.txt")).text();
	expect(robots).toMatch(/Disallow: \/\s/);
});
