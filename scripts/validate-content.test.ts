import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const SCRIPT = join(__dirname, "validate-content.ts");
const TSX = join(__dirname, "..", "node_modules", ".bin", "tsx");
let dir = "";

function run(files: Record<string, string>, env: Record<string, string> = {}) {
	dir = mkdtempSync(join(tmpdir(), "ic-validate-"));
	for (const [path, body] of Object.entries(files)) {
		mkdirSync(join(dir, path, ".."), { recursive: true });
		writeFileSync(join(dir, path), body);
	}
	return spawnSync(TSX, [SCRIPT], {
		cwd: dir,
		encoding: "utf8",
		env: { ...process.env, ...env },
	});
}

afterEach(() => {
	if (dir) rmSync(dir, { recursive: true, force: true });
});

const open = (extra = "") => `---
id: IC-2026-0001
status: open
openedAt: "2026-10-14T10:02:00+08:00"
registeredAt: "2026-10-14T10:31:00+08:00"
module: smart-money-radar
direction: long
chains: [base]
${extra}---
`;

describe("validate-content (end to end)", () => {
	it("passes a clean open signal", () => {
		const r = run({ "content/ledger/2026/IC-2026-0001.mdx": open() });
		expect(r.status).toBe(0);
	});

	it("fails the build when an open signal leaks a member-only field", () => {
		const r = run({
			"content/ledger/2026/IC-2026-0001.mdx": open("asset: $SECRET\n"),
		});
		expect(r.status).toBe(1);
		expect(r.stderr).toMatch(/asset/);
	});

	it("fails the build on a sequence gap", () => {
		const r = run({
			"content/ledger/2026/IC-2026-0001.mdx": open(),
			"content/ledger/2026/IC-2026-0003.mdx": open().replace(
				"IC-2026-0001",
				"IC-2026-0003",
			),
		});
		expect(r.status).toBe(1);
		expect(r.stderr).toMatch(/gap or duplicate/);
	});

	it("rejects demo content only in strict mode", () => {
		const files = {
			"content/ledger/2026/IC-2026-0001.mdx": open("demo: true\n"),
		};
		expect(run(files).status).toBe(0);
		rmSync(dir, { recursive: true, force: true });
		const strict = run(files, { CONTENT_STRICT: "1" });
		expect(strict.status).toBe(1);
		expect(strict.stderr).toMatch(/demo content/);
	});
});
