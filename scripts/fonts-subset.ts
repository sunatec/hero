/**
 * Build the self-hosted Noto Serif SC subsets (WEBSITE_PLAN §16, M12).
 *
 *   pnpm build && pnpm start &   # or any running server
 *   pnpm fonts:subset [baseUrl]  # default http://localhost:3000
 *
 * Visits every URL in the sitemap (+ noindex pages), collects the characters that are actually
 * rendered in the serif face per weight, asks Google Fonts for exactly those glyphs (css2 `text=`),
 * and writes app/fonts/noto-serif-sc-{700,900}.woff2 plus app/fonts/serif-chars.json.
 * e2e/fonts.spec.ts fails when a page renders a serif character missing from the subset.
 */
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { serifTextProbe } from "../e2e/serif-probe";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const EXTRA = ["/join/submitted", "/design-system"];
const WEIGHTS = ["700", "900"] as const;
// Always include ASCII and common CJK punctuation so new numbers / IDs never fall back.
const BASELINE =
	" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~·—…、。「」『』《》（），：；！？【】％＋－";

export async function collectSerifChars(
	baseUrl: string,
): Promise<Record<string, string>> {
	const xml = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
	const paths = [
		...new Set([
			...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
				(m) => new URL(m[1] as string).pathname,
			),
			...EXTRA,
		]),
	];
	const browser = await chromium.launch({
		channel: process.env.CI ? undefined : "chrome",
	});
	const acc: Record<string, Set<string>> = {
		"700": new Set(),
		"900": new Set(),
	};
	for (const width of [1440, 390]) {
		const page = await browser.newPage({ viewport: { width, height: 900 } });
		for (const path of paths) {
			await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
			const found = await page.evaluate(serifTextProbe);
			for (const w of WEIGHTS)
				for (const ch of found[w] ?? "") if (ch.trim()) acc[w]?.add(ch);
		}
		await page.close();
	}
	await browser.close();
	return Object.fromEntries(
		WEIGHTS.map((w) => [
			w,
			[...new Set([...(acc[w] ?? []), ...BASELINE])].sort().join(""),
		]),
	);
}

const UA =
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

async function download(weight: string, text: string) {
	const url = `https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@${weight}&text=${encodeURIComponent(text)}&display=swap`;
	const css = await (
		await fetch(url, { headers: { "User-Agent": UA } })
	).text();
	const src = css.match(/src: url\((.+?)\) format\('woff2'\)/)?.[1];
	if (!src) throw new Error(`no woff2 for ${weight}: ${css.slice(0, 200)}`);
	const buf = Buffer.from(await (await fetch(src)).arrayBuffer());
	writeFileSync(`app/fonts/noto-serif-sc-${weight}.woff2`, buf);
	return buf.length;
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const chars = await collectSerifChars(base);
	writeFileSync(
		"app/fonts/serif-chars.json",
		`${JSON.stringify(chars, null, "\t")}\n`,
	);
	for (const w of WEIGHTS) {
		const text = chars[w] ?? "";
		const bytes = await download(w, text);
		console.log(
			`Noto Serif SC ${w}: ${[...text].length} chars → ${(bytes / 1024).toFixed(1)} KB`,
		);
	}
}
