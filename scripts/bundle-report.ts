/**
 * JS budget report (WEBSITE_PLAN §16, M11/M12): gzip size of the scripts each prerendered page loads.
 * Run after `pnpm build`:  pnpm bundle:report  (exit 1 when a page exceeds its budget).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const BUDGET_KB = 120;
const PAGES = ["index", "ledger", "tools", "join", "cases", "en"];
const root = join(process.cwd(), ".next");

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
	const bytes = srcs.reduce(
		(sum, src) => sum + gzipSync(readFileSync(join(root, src))).length,
		0,
	);
	const kb = bytes / 1024;
	const over = kb > BUDGET_KB;
	failed ||= over;
	console.log(
		`${over ? "✗" : "✓"} /${page === "index" ? "" : page} — ${kb.toFixed(1)} KB gzip across ${srcs.length} scripts (budget ${BUDGET_KB} KB)`,
	);
}
process.exit(failed ? 1 : 0);
