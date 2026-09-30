/**
 * JS budget report (WEBSITE_PLAN §16, revised in M12): gzip size of the scripts each prerendered
 * page loads, split into the Next/React runtime and our own code. The budget applies to our code:
 * a chunk counts as ours when it carries site copy (CJK text) or site identifiers.
 * Run after `pnpm build`:  pnpm bundle:report  (exit 1 when a page's own code exceeds the budget).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const OWN_BUDGET_KB = 30;
const PAGES = ["index", "ledger", "tools", "join", "cases", "en", "verify"];
const root = join(process.cwd(), ".next");
const OURS = /[一-鿿]|0xInChain|data-reveal|turnstile/;

const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;
let failed = false;
for (const page of PAGES) {
	const html = join(root, "server/app", `${page}.html`);
	if (!existsSync(html)) {
		console.log(`- ${page}: not prerendered`);
		continue;
	}
	const srcs = [
		...new Set(
			[
				...readFileSync(html, "utf8").matchAll(
					/<script src="\/_next\/([^"]+)"/g,
				),
			].map((m) => m[1] as string),
		),
	];
	let own = 0;
	let runtime = 0;
	for (const src of srcs) {
		const code = readFileSync(join(root, src));
		const size = gzipSync(code).length;
		if (OURS.test(code.toString("utf8"))) own += size;
		else runtime += size;
	}
	const over = own / 1024 > OWN_BUDGET_KB;
	failed ||= over;
	console.log(
		`${over ? "✗" : "✓"} /${page === "index" ? "" : page} — own ${kb(own)} (budget ${OWN_BUDGET_KB} KB) · runtime ${kb(runtime)} · total ${kb(own + runtime)}`,
	);
}
process.exit(failed ? 1 : 0);
