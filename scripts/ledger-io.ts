import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import type { CommitFields } from "../lib/ledger/commit";
import { checkSignal } from "../lib/ledger/rules";
import { parseSignalFrontmatter } from "../lib/schema/signal";

export const LEDGER_DIR = join(process.cwd(), "content", "ledger");
export const SECRETS_DIR = join(process.cwd(), ".ledger-secrets");

/** Private (gitignored) record of what was committed to; the salt goes public only at close. */
export type CommitSecret = { salt: string; fields: CommitFields };

export function writeSecret(id: string, secret: CommitSecret) {
	mkdirSync(SECRETS_DIR, { recursive: true });
	writeFileSync(
		join(SECRETS_DIR, `${id}.json`),
		`${JSON.stringify(secret, null, 2)}\n`,
	);
}

export function readSecret(id: string): CommitSecret | undefined {
	const path = join(SECRETS_DIR, `${id}.json`);
	return existsSync(path)
		? (JSON.parse(readFileSync(path, "utf8")) as CommitSecret)
		: undefined;
}

export const PLACEHOLDER = "【待填写】";

/** Current time as ISO 8601 in UTC+8 without milliseconds, e.g. 2026-10-14T10:31:00+08:00. */
export function nowUtc8(): string {
	return `${new Date(Date.now() + 8 * 3_600_000).toISOString().slice(0, 19)}+08:00`;
}

export function listIds(): string[] {
	if (!existsSync(LEDGER_DIR)) return [];
	return readdirSync(LEDGER_DIR, { recursive: true, encoding: "utf8" })
		.filter((f) => f.endsWith(".mdx"))
		.map((f) => (f.split("/").pop() as string).replace(/\.mdx$/, ""));
}

export function signalPath(id: string): string {
	return join(LEDGER_DIR, id.slice(3, 7), `${id}.mdx`);
}

export function readSignal(id: string) {
	const path = signalPath(id);
	if (!existsSync(path)) throw new Error(`no such file: ${path}`);
	const { data, content } = matter(readFileSync(path, "utf8"));
	return { path, data: data as Record<string, unknown>, body: content };
}

/** Validates with the same schema + rules as the build before anything touches disk. */
export function writeSignal(
	id: string,
	data: Record<string, unknown>,
	body = "",
) {
	const parsed = parseSignalFrontmatter(data);
	if (!parsed.success)
		throw new Error(`refusing to write ${id}:\n${parsed.error.message}`);
	const errors = checkSignal(parsed.data, { fileId: id, body }).filter(
		(i) => i.level === "error",
	);
	if (errors.length)
		throw new Error(
			`refusing to write ${id}:\n${errors.map((e) => e.message).join("\n")}`,
		);
	const path = signalPath(id);
	mkdirSync(join(path, ".."), { recursive: true });
	writeFileSync(path, matter.stringify(body, data));
	return path;
}

export function fail(message: string): never {
	console.error(`✗ ${message}`);
	process.exit(1);
}
