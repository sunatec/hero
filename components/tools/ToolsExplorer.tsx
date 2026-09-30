"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PaneGrid } from "@/components/pane/Pane";
import { categoryLabel, moduleStatusLabel } from "@/lib/i18n/labels";
import {
	filterTools,
	TOOL_CATEGORIES,
	type ToolFilter,
	type ToolRow,
} from "@/lib/tools";
import { ToolPane } from "./ToolPane";

const chip =
	"min-h-11 shrink-0 border border-line px-3.5 font-data text-[11.5px] tracking-[0.04em] text-bone-dim transition-colors hover:text-bone aria-pressed:border-dossier aria-pressed:bg-ink-1 aria-pressed:text-bone";

export function ToolsGrid({ items }: { items: ToolRow[] }) {
	return (
		<PaneGrid>
			{items.map((t) => (
				<ToolPane key={t.slug} t={t} />
			))}
		</PaneGrid>
	);
}

/** Category + status filters kept in the URL (?category=&status=). */
export function ToolsExplorer({ rows }: { rows: ToolRow[] }) {
	const params = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const filter: ToolFilter = {
		...(params.get("category")
			? { category: params.get("category") as string }
			: {}),
		...(params.get("status") ? { status: params.get("status") as string } : {}),
	};
	const items = filterTools(rows, filter);

	const set = (key: keyof ToolFilter, value: string | null) => {
		const next = new URLSearchParams(params.toString());
		if (value) next.set(key, value);
		else next.delete(key);
		const qs = next.toString();
		router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
	};

	const categories = TOOL_CATEGORIES.filter((c) =>
		rows.some((r) => r.category === c),
	);
	const statuses = (["member", "beta", "public"] as const).filter((s) =>
		rows.some((r) => r.status === s),
	);

	return (
		<>
			<div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<fieldset className="m-0 min-w-0 border-0 p-0 -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
					<legend className="sr-only">按类别筛选</legend>
					<button
						type="button"
						aria-pressed={!filter.category}
						onClick={() => set("category", null)}
						className={chip}
					>
						全部 {String(rows.length).padStart(2, "0")}
					</button>
					{categories.map((c) => (
						<button
							key={c}
							type="button"
							aria-pressed={filter.category === c}
							onClick={() => set("category", filter.category === c ? null : c)}
							className={chip}
						>
							{categoryLabel[c].zh}
						</button>
					))}
				</fieldset>
				<fieldset className="m-0 min-w-0 border-0 p-0 flex gap-2">
					<legend className="sr-only">按状态筛选</legend>
					{statuses.map((s) => (
						<button
							key={s}
							type="button"
							aria-pressed={filter.status === s}
							onClick={() => set("status", filter.status === s ? null : s)}
							className={chip}
						>
							{moduleStatusLabel[s]}
						</button>
					))}
				</fieldset>
			</div>
			<p aria-live="polite" className="sr-only">
				{`当前显示 ${items.length} 个模块`}
			</p>
			{items.length ? (
				<ToolsGrid items={items} />
			) : (
				<p className="border-y border-line py-10 text-center text-bone-dim">
					没有符合条件的模块。
				</p>
			)}
		</>
	);
}
