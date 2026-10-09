/**
 * Register a new (open) signal. Only public fields — member-only details are added at close.
 *
 *   pnpm new:signal --module oi-tracker --direction long --chains bsc,base [--opened-at 2026-10-14T10:02:00+08:00]
 *                   [--asset '$ARB' --entry 0.412 [--targets 0.45,0.5] [--stop 0.379] [--invalidation '…']]
 *
 * --opened-at is the moment the signal was pushed to the members' channel (defaults to now).
 * With --asset and --entry the member-only details are committed to by SHA-256 (Q21-C): only the
 * hash is written to the ledger; the salt stays in .ledger-secrets/ until `pnpm close:signal`.
 */
import { parseArgs } from "node:util";
import { nextId } from "../lib/ledger/close";
import { commitHash, newSalt } from "../lib/ledger/commit";
import { Asset, Chain, Direction, ModuleSlug } from "../lib/schema/common";
import { fail, listIds, nowUtc8, writeSecret, writeSignal } from "./ledger-io";

const { values } = parseArgs({
	options: {
		module: { type: "string" },
		direction: { type: "string" },
		chains: { type: "string" },
		"opened-at": { type: "string" },
		asset: { type: "string" },
		entry: { type: "string" },
		targets: { type: "string" },
		stop: { type: "string" },
		invalidation: { type: "string" },
	},
});

const module = ModuleSlug.safeParse(values.module);
if (!module.success)
	fail(`--module must be one of: ${ModuleSlug.options.join(", ")}`);
const direction = Direction.safeParse(values.direction);
if (!direction.success)
	fail(`--direction must be one of: ${Direction.options.join(", ")}`);
const chains = (values.chains ?? "").split(",").filter(Boolean);
if (!chains.length || chains.some((c) => !Chain.safeParse(c).success)) {
	fail(`--chains must be a comma list of: ${Chain.options.join(", ")}`);
}
if (Boolean(values.asset) !== Boolean(values.entry))
	fail("--asset and --entry go together (both commit, or neither)");

const positive = (name: string, v: string) => {
	const n = Number(v);
	if (!Number.isFinite(n) || n <= 0) fail(`--${name} must be positive numbers`);
	return n;
};

const registeredAt = nowUtc8();
const openedAt = values["opened-at"] ?? registeredAt;
const id = nextId(listIds(), openedAt);

let commit: { hash: string } | undefined;
if (values.asset && values.entry) {
	if (!Asset.safeParse(values.asset).success)
		fail("--asset must look like '$ARB'");
	const fields = {
		id,
		openedAt,
		direction: direction.data as string,
		asset: values.asset,
		entryPrice: positive("entry", values.entry),
		...(values.targets
			? {
					targets: values.targets.split(",").map((t) => positive("targets", t)),
				}
			: {}),
		...(values.stop ? { stopLoss: positive("stop", values.stop) } : {}),
		...(values.invalidation ? { invalidation: values.invalidation } : {}),
	};
	const salt = newSalt();
	writeSecret(id, { salt, fields });
	commit = { hash: commitHash(fields, salt) };
}

try {
	const path = writeSignal(id, {
		id,
		status: "open",
		openedAt,
		registeredAt,
		module: module.data,
		direction: direction.data,
		chains,
		...(commit ? { commitHash: commit.hash } : {}),
	});
	console.log(`✓ ${id} registered → ${path}`);
	if (commit) {
		console.log(`  commitHash ${commit.hash}`);
		console.log(
			`  Salt kept in .ledger-secrets/${id}.json (gitignored) — back it up; without it the commitment cannot be revealed.`,
		);
	} else {
		console.log(
			"  No commitment: pass --asset and --entry to publish a SHA-256 commitment.",
		);
	}
	console.log("  Only public fields were written. Close it later with:");
	console.log(
		`  pnpm close:signal ${id} --status hit --exit … --closed-at … --evidence tg:/ledger/${id}/tg.webp`,
	);
} catch (e) {
	fail((e as Error).message);
}
