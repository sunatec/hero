import { holdingDays } from "@/lib/format";
import type { SignalStatus } from "@/lib/schema/signal";
import { round1 } from "./returns";

type ClosedLike = {
	status: "hit" | "invalidated" | "stopped" | "expired";
	openedAt: string;
	closedAt: string;
	closedReturnPct: number;
};
type Any = { id: string; status: SignalStatus; openedAt: string } & Partial<
	Omit<ClosedLike, "status">
>;

export type LedgerStats = {
	/** Every registered id, including voided ones (they still occupy their number). */
	registered: number;
	counts: Record<Exclude<SignalStatus, "void">, number> & { void: number };
	closed: number;
	/** Median closed return over closed signals; null when none. */
	medianReturn: number | null;
	avgHoldingDays: number | null;
	/** Fewer than 10 closed signals: stats are shown with a small-sample caveat. */
	smallSample: boolean;
	firstOpenedAt: string | null;
};

const CLOSED = new Set(["hit", "invalidated", "stopped", "expired"]);

export function isClosed<T extends { status: SignalStatus }>(
	s: T,
): s is T & ClosedLike {
	return CLOSED.has(s.status);
}

export function median(values: number[]): number | null {
	if (values.length === 0) return null;
	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	const value =
		sorted.length % 2
			? (sorted[mid] as number)
			: ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2;
	return round1(value);
}

/** Aggregate stats — methodology §5: void never counts; open signals don't count towards returns. */
export function ledgerStats(signals: Any[]): LedgerStats {
	const counts = {
		open: 0,
		hit: 0,
		invalidated: 0,
		stopped: 0,
		expired: 0,
		void: 0,
	};
	for (const s of signals) counts[s.status]++;
	const closed = signals.filter(isClosed);
	const days = closed.map((s) => holdingDays(s.openedAt, s.closedAt));
	const first =
		signals
			.map((s) => s.openedAt)
			.sort((a, b) => Date.parse(a) - Date.parse(b))[0] ?? null;
	return {
		registered: signals.length,
		counts,
		closed: closed.length,
		medianReturn: median(closed.map((s) => s.closedReturnPct)),
		avgHoldingDays: days.length
			? round1(days.reduce((a, b) => a + b, 0) / days.length)
			: null,
		smallSample: closed.length < 10,
		firstOpenedAt: first,
	};
}

/** Newest first by id (ids are sequential per year). */
export function byNewest<T extends { id: string }>(a: T, b: T): number {
	return b.id.localeCompare(a.id);
}
