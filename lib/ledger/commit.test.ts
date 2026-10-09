import { describe, expect, it } from "vitest";
import { parseSignalFrontmatter } from "@/lib/schema/signal";
import { closeFrontmatter } from "./close";
import {
	type CommitFields,
	canonical,
	commitHash,
	newSalt,
	preimage,
	verifyCommit,
} from "./commit";
import { checkSignal } from "./rules";

const fields: CommitFields = {
	id: "IC-2026-0007",
	openedAt: "2026-10-14T10:02:00+08:00",
	direction: "long",
	asset: "$ARB",
	entryPrice: 0.412,
	targets: [0.45, 0.5],
	stopLoss: 0.379,
};
const salt = "0123456789abcdef0123456789abcdef";

describe("commitHash", () => {
	it("is a pinned, reproducible sha256 of salt:canonical", () => {
		expect(canonical(fields)).toBe(
			'["v1","IC-2026-0007","2026-10-14T10:02:00+08:00","long","$ARB",0.412,[0.45,0.5],0.379,null]',
		);
		expect(commitHash(fields, salt)).toMatch(/^[a-f0-9]{64}$/);
		expect(preimage(fields, salt).startsWith(`${salt}:["v1"`)).toBe(true);
		expect(commitHash(fields, salt)).toBe(commitHash({ ...fields }, salt));
	});
	it("changes when any committed field or the salt changes", () => {
		const h = commitHash(fields, salt);
		for (const f of [
			{ ...fields, asset: "$OP" },
			{ ...fields, entryPrice: 0.413 },
			{ ...fields, stopLoss: undefined },
			{ ...fields, targets: [0.45] },
			{ ...fields, invalidation: "x" },
			{ ...fields, direction: "short" },
		])
			expect(commitHash(f, salt)).not.toBe(h);
		expect(commitHash(fields, newSalt())).not.toBe(h);
	});
	it("verifies", () => {
		expect(verifyCommit(fields, salt, commitHash(fields, salt))).toBe(true);
		expect(
			verifyCommit({ ...fields, asset: "$OP" }, salt, commitHash(fields, salt)),
		).toBe(false);
	});
	it("salts are 32 hex chars and unique", () => {
		expect(newSalt()).toMatch(/^[a-f0-9]{32}$/);
		expect(newSalt()).not.toBe(newSalt());
	});
});

describe("ledger rules with a commitment", () => {
	const open = {
		id: fields.id,
		status: "open",
		openedAt: fields.openedAt,
		registeredAt: "2026-10-14T10:31:00+08:00",
		module: "oi-tracker",
		direction: "long" as const,
		chains: ["cex"],
		commitHash: commitHash(fields, salt),
	};
	const close = (over: Record<string, unknown> = {}) => {
		const closed = closeFrontmatter(open, {
			status: "hit",
			asset: fields.asset,
			entryPrice: fields.entryPrice,
			exitPrice: 0.5,
			closedAt: "2026-10-16T09:00:00+08:00",
			targets: fields.targets,
			stopLoss: fields.stopLoss,
			commitSalt: salt,
			evidence: [{ type: "tg", image: "/ledger/x.webp" }],
			...over,
		});
		const parsed = parseSignalFrontmatter(closed);
		if (!parsed.success) throw new Error(parsed.error.message);
		return checkSignal(parsed.data, { fileId: fields.id, body: "" })
			.filter((i) => i.level === "error")
			.map((i) => i.message);
	};

	it("accepts an open signal carrying only the hash", () => {
		expect(parseSignalFrontmatter(open).success).toBe(true);
	});
	it("rejects the salt on an open signal (would leak the commitment)", () => {
		expect(parseSignalFrontmatter({ ...open, commitSalt: salt }).success).toBe(
			false,
		);
	});
	it("passes when the revealed fields match", () =>
		expect(close()).toEqual([]));
	it("fails when the entry was changed after opening", () =>
		expect(close({ entryPrice: 0.4, exitPrice: 0.5 }).join()).toMatch(
			/does not match the revealed fields/,
		));
	it("fails when the salt is wrong", () =>
		expect(close({ commitSalt: "f".repeat(32) }).join()).toMatch(
			/does not match/,
		));
	it("fails when the salt is never revealed", () =>
		expect(close({ commitSalt: undefined }).join()).toMatch(/not revealed/));
});
