import type { Direction } from "@/lib/schema/common";

/** Client-safe case shape (no compiled MDX). */
export type CaseRow = {
	slug: string;
	date: string;
	assets: string[];
	direction: Direction;
	method: string;
	result: "profit" | "loss" | "avoided" | "unknown";
	claim?: string;
	titleOriginal: string;
	xUrl: string;
	verified: boolean;
};

export type CaseFilter = { direction?: string; method?: string; year?: string };

/** direction accepts "long" or "short" — the latter groups shorts and risk alerts. */
export function filterCases(rows: CaseRow[], f: CaseFilter): CaseRow[] {
	return rows.filter(
		(c) =>
			(!f.direction ||
				(f.direction === "short"
					? c.direction !== "long"
					: c.direction === f.direction)) &&
			(!f.method || c.method === f.method) &&
			(!f.year || c.date.startsWith(f.year)),
	);
}
