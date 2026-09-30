import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { serifTextProbe } from "./serif-probe";

/**
 * The display serif is a committed subset (app/fonts). New copy that renders a serif character
 * outside it would silently fall back to a system serif — fail instead, with the fix in the message.
 */
const chars = JSON.parse(
	readFileSync("app/fonts/serif-chars.json", "utf8"),
) as Record<"700" | "900", string>;

const PAGES = [
	"/",
	"/ledger",
	"/ledger/IC-2026-0001",
	"/cases",
	"/cases/2026-01-17-surge",
	"/methodology",
	"/tools",
	"/tools/oi-tracker",
	"/community",
	"/about",
	"/research",
	"/join",
	"/join/submitted",
	"/verify",
	"/legal/terms",
	"/en",
];

for (const path of PAGES) {
	test(`serif subset covers ${path}`, async ({ page }) => {
		await page.route("https://challenges.cloudflare.com/turnstile/**", (r) =>
			r.fulfill({
				contentType: "text/javascript",
				body: "window.turnstile={render(){return 'w'},reset(){},remove(){}}",
			}),
		);
		await page.goto(path);
		await page.waitForLoadState("networkidle");
		const found = await page.evaluate(serifTextProbe);
		const missing = (["700", "900"] as const).flatMap((w) =>
			[...new Set(found[w] ?? "")]
				.filter((ch) => ch.trim() && !chars[w].includes(ch))
				.map((ch) => `${w}:${ch}`),
		);
		expect(
			missing,
			"run `pnpm build && pnpm start` then `pnpm fonts:subset`",
		).toEqual([]);
	});
}
