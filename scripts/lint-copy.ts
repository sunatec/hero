/**
 * Scans user-facing copy for banned wording (docs/brand.md §3.1). Exits non-zero on any hit.
 * Allow a specific line by adding `copy-lint-allow` in a comment on that line.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const ROOT = process.cwd();
const TARGETS = ["app", "components", "content", "docs/copy"];
const EXTS = new Set([".ts", ".tsx", ".mdx", ".md"]);

const BANNED = [
	"稳赚",
	"保本",
	"必涨",
	"必赚",
	"财富自由",
	"躺赚",
	"暴富",
	"翻倍保证",
	"无风险",
	"零风险",
	"胜率高达",
	"百分百",
	"错过就亏",
	"错过再等",
	"最后名额",
	"最后机会",
	"仅剩",
	"手慢无",
	"上车",
	"梭哈",
	"巨婴",
	"韭菜",
	"白嫖",
];
/** Context-dependent words: banned unless the line matches the allow pattern. */
const CONDITIONAL: { word: string; allowIf: RegExp }[] = [
	{ word: "内幕", allowIf: /(不|没有|并非)[^。]{0,6}内幕/ },
	{ word: "100%", allowIf: /(width|height|size|%\s*[;,)]|inset|\d+%\s+\d)/ },
];

function walk(dir: string): string[] {
	const abs = join(ROOT, dir);
	try {
		statSync(abs);
	} catch {
		return [];
	}
	return readdirSync(abs, { recursive: true, encoding: "utf8" })
		.map((f) => join(abs, f))
		.filter((f) => EXTS.has(extname(f)) && statSync(f).isFile());
}

let hits = 0;
for (const file of TARGETS.flatMap(walk)) {
	const lines = readFileSync(file, "utf8").split("\n");
	lines.forEach((line, i) => {
		if (line.includes("copy-lint-allow")) return;
		const found = [
			...BANNED.filter((w) => line.includes(w)),
			...CONDITIONAL.filter(
				(c) => line.includes(c.word) && !c.allowIf.test(line),
			).map((c) => c.word),
		];
		for (const word of found) {
			hits++;
			console.error(`✗ ${relative(ROOT, file)}:${i + 1} — 「${word}」`);
		}
	});
}
console.error(`copy:lint — ${hits} hit(s)`);
process.exit(hits > 0 ? 1 : 0);
