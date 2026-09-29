/**
 * Register a new (open) signal. Only public fields — member-only details are added at close.
 *
 *   pnpm new:signal --module oi-tracker --direction long --chains bsc,base [--opened-at 2026-10-14T10:02:00+08:00]
 *
 * --opened-at is the moment the signal was pushed to the members' channel (defaults to now).
 */
import { parseArgs } from "node:util";
import { nextId } from "../lib/ledger/close";
import { Chain, Direction, ModuleSlug } from "../lib/schema/common";
import { fail, listIds, nowUtc8, writeSignal } from "./ledger-io";

const { values } = parseArgs({
	options: {
		module: { type: "string" },
		direction: { type: "string" },
		chains: { type: "string" },
		"opened-at": { type: "string" },
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

const registeredAt = nowUtc8();
const openedAt = values["opened-at"] ?? registeredAt;
const id = nextId(listIds(), openedAt);

try {
	const path = writeSignal(id, {
		id,
		status: "open",
		openedAt,
		registeredAt,
		module: module.data,
		direction: direction.data,
		chains,
	});
	console.log(`✓ ${id} registered → ${path}`);
	console.log("  Only public fields were written. Close it later with:");
	console.log(
		`  pnpm close:signal ${id} --status hit --asset '$XXX' --entry … --exit … --closed-at … --evidence tg:/ledger/${id}/tg.webp`,
	);
} catch (e) {
	fail((e as Error).message);
}
