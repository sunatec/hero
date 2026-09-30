"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type CaseFilter, type CaseRow, filterCases } from "@/lib/cases";
import { methodLabel } from "@/lib/i18n/labels";
import { CaseCard } from "./CaseCard";

const KEYS = ["direction", "method", "year"] as const;

export function CasesGrid({ items }: { items: CaseRow[] }) {
	return (
		<div className="grid gap-x-8 gap-y-12 pt-2 md:grid-cols-2 xl:grid-cols-3">
			{items.map((c) => (
				<CaseCard key={c.slug} c={c} />
			))}
		</div>
	);
}

export function CasesExplorer({ rows }: { rows: CaseRow[] }) {
	const params = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const filter: CaseFilter = Object.fromEntries(
		KEYS.map((k) => [k, params.get(k) ?? undefined]).filter(([, v]) => v),
	);
	const active = Object.keys(filter).length > 0;
	const items = filterCases(rows, filter);

	const set = (key: (typeof KEYS)[number], value: string) => {
		const next = new URLSearchParams(params.toString());
		if (value) next.set(key, value);
		else next.delete(key);
		const qs = next.toString();
		router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
	};

	const methods = [...new Set(rows.map((r) => r.method))];
	const years = [...new Set(rows.map((r) => r.date.slice(0, 4)))]
		.sort()
		.reverse();
	const selects = [
		{
			key: "direction" as const,
			label: "方向",
			options: [
				{ value: "long", label: "做多" },
				{ value: "short", label: "做空 / 风险预警" },
			],
		},
		{
			key: "method" as const,
			label: "识别方法",
			options: methods.map((m) => ({ value: m, label: methodLabel[m] ?? m })),
		},
		{
			key: "year" as const,
			label: "年份",
			options: years.map((y) => ({ value: y, label: y })),
		},
	];

	return (
		<>
			<fieldset className="m-0 mb-3 flex flex-wrap items-end gap-3 border-0 p-0">
				<legend className="sr-only">筛选精选案例</legend>
				{selects.map((s) => (
					<label
						key={s.key}
						className="flex flex-col gap-1 font-mono text-[11px] tracking-[0.1em] text-dossier"
					>
						{s.label}
						<select
							value={filter[s.key] ?? ""}
							onChange={(e) => set(s.key, e.target.value)}
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
						className="min-h-11 px-2 font-mono text-[13px] text-bone tap underline underline-offset-4 hover:text-stamp"
					>
						清除筛选
					</button>
				) : null}
			</fieldset>
			<p
				aria-live="polite"
				className="mb-8 font-mono text-[13px] text-bone-dim"
			>
				{active ? `当前筛选：${items.length} 条` : `共 ${items.length} 条`}
			</p>
			{items.length ? (
				<CasesGrid items={items} />
			) : (
				<p className="border-y border-line py-10 text-center text-bone-dim">
					没有符合条件的案例。
				</p>
			)}
		</>
	);
}
