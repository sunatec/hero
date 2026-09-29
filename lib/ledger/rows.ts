import type { Chain, Direction, ModuleSlug } from "@/lib/schema/common";
import type { SignalStatus } from "@/lib/schema/signal";

/**
 * The only shape that crosses into client components. Built on the server from public fields;
 * open signals have no asset / price here because their files don't contain them.
 */
export type LedgerRow = {
	id: string;
	openedAt: string;
	registeredAt: string;
	status: SignalStatus;
	direction: Direction;
	chains: Chain[];
	module: ModuleSlug;
	moduleLabel: string;
	asset?: string;
	closedAt?: string;
	closedReturnPct?: number;
};

export type LedgerFilter = {
	status?: string;
	module?: string;
	chain?: string;
	direction?: string;
	month?: string;
};

const CLOSED = new Set(["hit", "invalidated", "stopped", "expired"]);

/** "2026-10" in UTC+8. */
export function monthOf(iso: string): string {
	return new Date(Date.parse(iso) + 8 * 3_600_000).toISOString().slice(0, 7);
}

/** status accepts a concrete status or the groups "open" / "closed". Unknown values match nothing. */
export function applyFilter(rows: LedgerRow[], f: LedgerFilter): LedgerRow[] {
	return rows.filter(
		(r) =>
			(!f.status ||
				(f.status === "closed"
					? CLOSED.has(r.status)
					: r.status === f.status)) &&
			(!f.module || r.module === f.module) &&
			(!f.chain || r.chains.includes(f.chain as Chain)) &&
			(!f.direction || r.direction === f.direction) &&
			(!f.month || monthOf(r.openedAt) === f.month),
	);
}

export const PAGE_SIZE = 50;

export function paginate<T>(items: T[], page: number) {
	const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
	const current = Math.min(Math.max(1, Math.floor(page) || 1), pages);
	return {
		items: items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
		page: current,
		pages,
	};
}
