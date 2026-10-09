import type { Signal } from "@/lib/schema/signal";
import { commitHash } from "./commit";
import { closedReturnPct } from "./returns";

export type Issue = { level: "error" | "warning"; message: string };

const TWO_HOURS = 2 * 60 * 60 * 1000;
const RETURN_TOLERANCE = 0.1;

/** Cross-field rules from docs/content-model.md §1 that a schema alone cannot express. */
export function checkSignal(
	signal: Signal,
	ctx: { fileId: string; body: string },
): Issue[] {
	const issues: Issue[] = [];
	const err = (message: string) => issues.push({ level: "error", message });

	if (signal.id !== ctx.fileId)
		err(`id ${signal.id} does not match file name ${ctx.fileId}`);

	const opened = Date.parse(signal.openedAt);
	const registered = Date.parse(signal.registeredAt);
	if (registered < opened) err("registeredAt is before openedAt");
	if (registered - opened > TWO_HOURS) {
		issues.push({
			level: "warning",
			message: "registered more than 2h after opening (shown as 延迟登记)",
		});
	}

	if (signal.status === "open") {
		if (ctx.body.trim() !== "")
			err(
				"open signals must have an empty body (thesis is member-only until close)",
			);
		return issues;
	}

	if (signal.status === "void") {
		if (signal.commitSalt && !signal.commitHash)
			err("commitSalt without commitHash");
		return issues;
	}

	if (signal.commitSalt && !signal.commitHash)
		err("commitSalt without commitHash");
	if (signal.commitHash) {
		if (!signal.commitSalt) {
			err("commitHash is set but commitSalt was not revealed at close");
		} else if (commitHash(signal, signal.commitSalt) !== signal.commitHash) {
			err(
				"commitHash does not match the revealed fields — asset, entry, targets, stop or invalidation changed after opening",
			);
		}
	}

	if (Date.parse(signal.closedAt) <= opened)
		err("closedAt must be after openedAt");
	if (signal.maePct > 0) err(`maePct must be ≤ 0 (got ${signal.maePct})`);
	if (signal.mfePct < 0) err(`mfePct must be ≥ 0 (got ${signal.mfePct})`);
	if (
		signal.closedReturnPct > signal.mfePct ||
		signal.closedReturnPct < signal.maePct
	) {
		err(
			`closedReturnPct ${signal.closedReturnPct} must lie between maePct ${signal.maePct} and mfePct ${signal.mfePct}`,
		);
	}
	const expected = closedReturnPct(
		signal.direction,
		signal.entryPrice,
		signal.exitPrice,
	);
	if (Math.abs(expected - signal.closedReturnPct) > RETURN_TOLERANCE) {
		err(
			`closedReturnPct ${signal.closedReturnPct} does not match prices (expected ${expected})`,
		);
	}
	return issues;
}

/** Ids within a year must be 1..N with no gaps; voided ids still occupy their number. */
export function checkSequence(ids: string[]): Issue[] {
	const byYear = new Map<string, number[]>();
	for (const id of ids) {
		const [, year, num] = id.split("-");
		if (!year || !num) continue;
		byYear.set(year, [...(byYear.get(year) ?? []), Number(num)]);
	}
	const issues: Issue[] = [];
	for (const [year, nums] of byYear) {
		const sorted = [...nums].sort((a, b) => a - b);
		sorted.forEach((n, i) => {
			if (n !== i + 1) {
				issues.push({
					level: "error",
					message: `IC-${year}: expected #${i + 1} but found #${n} (gap or duplicate)`,
				});
			}
		});
	}
	return issues;
}

/** Numbers are handed out at registration, so a higher id can never be registered earlier. */
export function checkChronology(
	items: { id: string; registeredAt: string }[],
): Issue[] {
	const sorted = [...items].sort((a, b) => a.id.localeCompare(b.id));
	const issues: Issue[] = [];
	for (let i = 1; i < sorted.length; i++) {
		const prev = sorted[i - 1] as (typeof sorted)[number];
		const cur = sorted[i] as (typeof sorted)[number];
		if (Date.parse(cur.registeredAt) < Date.parse(prev.registeredAt)) {
			issues.push({
				level: "error",
				message: `${cur.id} was registered before ${prev.id} — ids must follow registration order`,
			});
		}
	}
	return issues;
}
