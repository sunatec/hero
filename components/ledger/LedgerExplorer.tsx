"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pct } from "@/components/dossier/Fields";
import { directionLabel, statusLabel } from "@/lib/i18n/labels";
import {
	applyFilter,
	type LedgerFilter,
	type LedgerRow,
	monthOf,
	paginate,
} from "@/lib/ledger/rows";
import { ledgerStats } from "@/lib/ledger/stats";
import type { Direction } from "@/lib/schema/common";
import type { SignalStatus } from "@/lib/schema/signal";
import { LedgerList } from "./LedgerList";

const KEYS = ["status", "module", "chain", "direction", "month"] as const;
type Key = (typeof KEYS)[number];

const CHAIN_LABEL: Record<string, string> = {
	eth: "ETH",
	bsc: "BSC",
	base: "BASE",
	sol: "SOL",
	hyperliquid: "Hyperliquid",
	cex: "CEX",
	other: "其他",
};

const STATUS_OPTIONS: { value: string; label: string }[] = [
	{ value: "open", label: "进行中" },
	{ value: "closed", label: "已结案（全部）" },
	...(
		["hit", "invalidated", "stopped", "expired", "void"] as SignalStatus[]
	).map((s) => ({
		value: s,
		label: statusLabel[s],
	})),
];

function unique<T>(xs: T[]) {
	return [...new Set(xs)];
}

export function LedgerStats({ rows }: { rows: LedgerRow[] }) {
	const s = ledgerStats(rows);
	const items: [string, number][] = [
		["已登记", s.registered],
		["命中", s.counts.hit],
		["失效", s.counts.invalidated],
		["止损", s.counts.stopped],
		["超时", s.counts.expired],
		["进行中", s.counts.open],
	];
	return (
		<p className="m-0 flex flex-wrap gap-x-7 gap-y-2 border-y border-line py-4 font-mono text-[13px] text-bone-dim">
			{items.map(([k, v]) => (
				<span key={k}>
					{k} <b className="font-medium text-bone">{v}</b>
				</span>
			))}
			<span>
				结案收益中位数{" "}
				{s.medianReturn === null ? (
					<b className="font-medium text-bone">—</b>
				) : (
					<Pct value={s.medianReturn} />
				)}
				{s.smallSample && s.closed > 0 ? "（样本较少）" : ""}
			</span>
		</p>
	);
}

export function LedgerExplorer({ rows }: { rows: LedgerRow[] }) {
	const params = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const filter: LedgerFilter = Object.fromEntries(
		KEYS.map((k) => [k, params.get(k) ?? undefined]).filter(([, v]) => v),
	);
	const active = Object.keys(filter).length > 0;
	const filtered = applyFilter(rows, filter);
	const { items, page, pages } = paginate(
		filtered,
		Number(params.get("page") ?? 1),
	);

	const set = (key: Key | "page", value: string | null) => {
		const next = new URLSearchParams(params.toString());
		if (value) next.set(key, value);
		else next.delete(key);
		if (key !== "page") next.delete("page");
		const qs = next.toString();
		router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
	};

	const moduleOptions = unique(rows.map((r) => r.module)).map((m) => ({
		value: m,
		label: rows.find((r) => r.module === m)?.moduleLabel ?? m,
	}));
	const chainOptions = unique(rows.flatMap((r) => r.chains)).map((c) => ({
		value: c,
		label: CHAIN_LABEL[c] ?? c,
	}));
	const dirOptions = unique(rows.map((r) => r.direction)).map((d) => ({
		value: d,
		label: directionLabel[d as Direction],
	}));
	const monthOptions = unique(rows.map((r) => monthOf(r.openedAt)))
		.sort()
		.reverse()
		.map((m) => ({ value: m, label: m.replace("-", ".") }));

	const selects: {
		key: Key;
		label: string;
		options: { value: string; label: string }[];
	}[] = [
		{ key: "status", label: "状态", options: STATUS_OPTIONS },
		{ key: "module", label: "模块", options: moduleOptions },
		{ key: "chain", label: "链", options: chainOptions },
		{ key: "direction", label: "方向", options: dirOptions },
		{ key: "month", label: "月份", options: monthOptions },
	];

	return (
		<>
			<LedgerStats rows={filtered} />
			<fieldset className="m-0 mt-5 mb-3 flex flex-wrap items-end gap-3 border-0 p-0">
				<legend className="sr-only">筛选台账</legend>
				{selects.map((s) => (
					<label
						key={s.key}
						className="flex flex-col gap-1 font-mono text-[11px] tracking-[0.1em] text-dossier"
					>
						{s.label}
						<select
							value={filter[s.key] ?? ""}
							onChange={(e) => set(s.key, e.target.value || null)}
							className="min-h-11 rounded-file border border-line bg-ink-1 px-3 font-sans text-sm tracking-normal text-bone"
						>
							<option value="">全部</option>
							{s.options.map((o) => (
								<option key={o.value} value={o.value}>
									{o.label}
								</option>
							))}
						</select>
					</label>
				))}
				{active ? (
					<button
						type="button"
						onClick={() => router.replace(pathname, { scroll: false })}
						className="min-h-11 px-2 font-mono text-[13px] text-bone underline underline-offset-4 hover:text-stamp"
					>
						清除筛选
					</button>
				) : null}
			</fieldset>
			<p
				aria-live="polite"
				className="mb-2 font-mono text-[13px] text-bone-dim"
			>
				{active
					? `当前筛选：${filtered.length} 份`
					: `共 ${filtered.length} 份`}
				{pages > 1 ? ` · 第 ${page} / ${pages} 页` : ""}
			</p>

			{items.length ? (
				<LedgerList
					items={items}
					caption={active ? "筛选后的台账档案" : "全部台账档案"}
				/>
			) : (
				<p className="border-y border-line py-10 text-center text-bone-dim">
					{rows.length ? "没有符合条件的档案。" : "今天还没有新的立案。"}
				</p>
			)}

			{pages > 1 ? (
				<nav
					aria-label="分页"
					className="mt-5 flex justify-between font-mono text-[13px]"
				>
					<button
						type="button"
						disabled={page <= 1}
						onClick={() => set("page", String(page - 1))}
						className="min-h-11 text-bone underline underline-offset-4 disabled:text-bone-dim disabled:no-underline"
					>
						← 上一页
					</button>
					<button
						type="button"
						disabled={page >= pages}
						onClick={() => set("page", String(page + 1))}
						className="min-h-11 text-bone underline underline-offset-4 disabled:text-bone-dim disabled:no-underline"
					>
						下一页 →
					</button>
				</nav>
			) : null}
		</>
	);
}
