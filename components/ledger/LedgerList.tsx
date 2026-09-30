import Link from "next/link";
import { Pct } from "@/components/dossier/Fields";
import { Redaction } from "@/components/dossier/Redaction";
import { Stamp } from "@/components/dossier/Stamp";
import { formatShort } from "@/lib/format";
import { directionLabel } from "@/lib/i18n/labels";
import type { LedgerRow } from "@/lib/ledger/rows";

function Asset({ r }: { r: LedgerRow }) {
	if (r.status === "open") return <Redaction width={6} />;
	return <>{r.asset ?? "—"}</>;
}

function Result({ r }: { r: LedgerRow }) {
	return r.closedReturnPct === undefined ? (
		<span className="font-mono text-bone-dim">—</span>
	) : (
		<Pct value={r.closedReturnPct} />
	);
}

/**
 * Ledger rows: a real table from md up, two-line cards below (same data, one visible at a time).
 * Client-safe: takes plain LedgerRow objects, never the content collections.
 */
export function LedgerList({
	items,
	caption,
}: {
	items: LedgerRow[];
	caption: string;
}) {
	return (
		<>
			<table className="hidden w-full border-collapse text-[15px] md:table">
				<caption className="sr-only">{caption}</caption>
				<thead>
					<tr className="border-b border-line text-left font-mono text-[11px] tracking-[0.14em] text-dossier">
						<th className="px-3 pt-4 pb-3.5 font-medium">编号</th>
						<th className="px-3 pt-4 pb-3.5 font-medium">立案</th>
						<th className="px-3 pt-4 pb-3.5 font-medium">模块</th>
						<th className="px-3 pt-4 pb-3.5 font-medium">方向</th>
						<th className="px-3 pt-4 pb-3.5 font-medium">标的</th>
						<th className="px-3 pt-4 pb-3.5 font-medium">状态</th>
						<th className="px-3 pt-4 pb-3.5 text-right font-medium">
							结案收益
						</th>
					</tr>
				</thead>
				<tbody data-reveal="rows">
					{items.map((r) => (
						<tr
							key={r.id}
							className="border-b border-line transition-colors hover:bg-ink-1"
						>
							<td className="px-3 py-5 font-mono whitespace-nowrap">
								<Link
									href={`/ledger/${r.id}`}
									className="text-dossier tap underline underline-offset-4 hover:text-stamp"
								>
									{r.id}
								</Link>
							</td>
							<td className="px-3 py-5 font-mono text-[13px] whitespace-nowrap text-bone-dim">
								{formatShort(r.openedAt)}
							</td>
							<td className="px-3 py-5 text-sm text-bone-dim">
								{r.moduleLabel}
							</td>
							<td className="px-3 py-5 text-sm text-bone-dim">
								{directionLabel[r.direction]}
							</td>
							<td className="px-3 py-5 font-serif-zh text-base font-bold">
								<Asset r={r} />
							</td>
							<td className="px-3 py-5">
								<Stamp status={r.status} size="sm" />
							</td>
							<td className="px-3 py-5 text-right whitespace-nowrap">
								<Result r={r} />
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<ul className="md:hidden" aria-label={caption} data-reveal="rows">
				{items.map((r) => (
					<li
						key={r.id}
						className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-b border-line py-[18px]"
					>
						<Link
							href={`/ledger/${r.id}`}
							className="font-mono text-dossier tap underline underline-offset-4"
						>
							{r.id}
						</Link>
						<span className="row-span-2 self-center">
							<Stamp status={r.status} size="sm" />
						</span>
						<span className="font-serif-zh text-base font-bold">
							<Asset r={r} />{" "}
							<span className="text-sm font-normal text-bone-dim">
								{directionLabel[r.direction]}
							</span>
						</span>
						<span className="font-mono text-[13px] text-bone-dim">
							{formatShort(r.openedAt)}
						</span>
						<span className="text-right">
							<Result r={r} />
						</span>
					</li>
				))}
			</ul>
		</>
	);
}
