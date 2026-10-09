/**
 * Build gate for all content. Exits non-zero on any error.
 *   pnpm content:validate                 # dev: demo content and TBD config allowed
 *   CONTENT_STRICT=1 pnpm content:validate # production: also rejects demo content and TBD config
 * Production on Vercel (VERCEL_ENV=production) is strict automatically.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import {
	checkChronology,
	checkSequence,
	checkSignal,
	type Issue,
} from "../lib/ledger/rules";
import {
	AgentFrontmatter,
	CaseStudyFrontmatter,
	LegalFrontmatter,
	ModuleFrontmatter,
	ResearchFrontmatter,
} from "../lib/schema/content";
import { parseSignalFrontmatter } from "../lib/schema/signal";
import { site } from "../site.config";

const ROOT = process.cwd();
const STRICT =
	process.env.CONTENT_STRICT === "1" || process.env.VERCEL_ENV === "production";

type Report = { file: string } & Issue;
const reports: Report[] = [];
const add = (file: string, level: Issue["level"], message: string) =>
	reports.push({ file, level, message });

function listMdx(dir: string): string[] {
	const abs = join(ROOT, dir);
	try {
		statSync(abs);
	} catch {
		return [];
	}
	return readdirSync(abs, { recursive: true, encoding: "utf8" })
		.filter((f) => f.endsWith(".mdx"))
		.map((f) => join(abs, f));
}

function load(file: string) {
	const { data, content } = matter(readFileSync(file, "utf8"));
	return { data: data as Record<string, unknown>, body: content };
}

function zodIssues(file: string, error: z.ZodError) {
	for (const i of error.issues)
		add(file, "error", `${i.path.join(".") || "(root)"}: ${i.message}`);
}

function checkDemo(file: string, data: Record<string, unknown>) {
	if (data.demo === true) {
		add(
			file,
			STRICT ? "error" : "warning",
			"demo content (not allowed in production builds)",
		);
	}
}

// --- signals -----------------------------------------------------------------
const signalIds: string[] = [];
const registrations: { id: string; registeredAt: string }[] = [];
for (const file of listMdx("content/ledger")) {
	const rel = relative(ROOT, file);
	const { data, body } = load(file);
	checkDemo(rel, data);
	const parsed = parseSignalFrontmatter(data);
	if (!parsed.success) {
		zodIssues(rel, parsed.error);
		continue;
	}
	signalIds.push(parsed.data.id);
	registrations.push({
		id: parsed.data.id,
		registeredAt: parsed.data.registeredAt,
	});
	const fileId =
		rel
			.split("/")
			.pop()
			?.replace(/\.mdx$/, "") ?? "";
	if (parsed.data.status !== "open" && parsed.data.status !== "void") {
		if (body.includes("【待填写】"))
			add(
				rel,
				STRICT ? "error" : "warning",
				"thesis/review still contains 【待填写】",
			);
		else if (!body.trim())
			add(rel, "warning", "closed signal has no thesis/review body");
	}
	for (const issue of checkSignal(parsed.data, { fileId, body }))
		add(rel, issue.level, issue.message);
}
for (const issue of [
	...checkSequence(signalIds),
	...checkChronology(registrations),
])
	add("content/ledger", issue.level, issue.message);

// --- other collections -----------------------------------------------------------
const simple: [string, z.ZodType][] = [
	["content/cases", CaseStudyFrontmatter],
	["content/modules", ModuleFrontmatter],
	["content/research", ResearchFrontmatter],
];
for (const [dir, schema] of simple) {
	for (const file of listMdx(dir)) {
		const rel = relative(ROOT, file);
		const { data } = load(file);
		checkDemo(rel, data);
		const parsed = schema.safeParse(data);
		if (!parsed.success) zodIssues(rel, parsed.error);
	}
}
for (const file of listMdx("content/legal")) {
	const rel = relative(ROOT, file);
	const { data } = load(file);
	checkDemo(rel, data);
	const parsed = LegalFrontmatter.safeParse(data);
	if (!parsed.success) zodIssues(rel, parsed.error);
	else if (!parsed.data.reviewed)
		add(
			rel,
			"warning",
			"legal draft not yet reviewed by a lawyer (open-items D)",
		);
}
for (const file of listMdx("content/pages").filter((f) =>
	f.endsWith("agent.mdx"),
)) {
	const rel = relative(ROOT, file);
	const { data } = load(file);
	checkDemo(rel, data);
	const parsed = AgentFrontmatter.safeParse(data);
	if (!parsed.success) zodIssues(rel, parsed.error);
}

// featured cases: at most 3, at least one short / risk-alert when any are featured
const featured = listMdx("content/cases")
	.map((f) => load(f).data)
	.filter((d) => d.featured === true);
if (featured.length > 3)
	add(
		"content/cases",
		"error",
		`at most 3 featured cases (found ${featured.length})`,
	);
if (featured.length > 0 && !featured.some((d) => d.direction !== "long")) {
	add(
		"content/cases",
		"error",
		"featured cases must include at least one short or risk-alert",
	);
}

// --- site config -------------------------------------------------------------------
const tbd = JSON.stringify(site).match(/"TBD"/g)?.length ?? 0;
if (tbd > 0)
	add(
		"site.config.ts",
		STRICT ? "error" : "warning",
		`${tbd} value(s) still TBD`,
	);

if (/\.invalid(\/|$)/.test(site.url))
	add(
		"site.config.ts",
		STRICT ? "error" : "warning",
		`site.url is still the placeholder ${site.url} (open-items B12)`,
	);

// --- report ------------------------------------------------------------------------
const errors = reports.filter((r) => r.level === "error");
const warnings = reports.filter((r) => r.level === "warning");
for (const r of [...errors, ...warnings]) {
	const tag = r.level === "error" ? "✗" : "!";
	console.error(`${tag} ${r.file} — ${r.message}`);
}
console.error(
	`content:validate ${STRICT ? "(strict) " : ""}— ${signalIds.length} signals, ${errors.length} error(s), ${warnings.length} warning(s)`,
);
process.exit(errors.length > 0 ? 1 : 0);
