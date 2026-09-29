import Link from "next/link";
import { Pct } from "@/components/dossier/Fields";
import { Redaction } from "@/components/dossier/Redaction";
import { Stamp } from "@/components/dossier/Stamp";
import { moduleBySlug, type SignalDoc } from "@/lib/content";
import { formatShort } from "@/lib/format";
import { directionLabel } from "@/lib/i18n/labels";
import { isClosed } from "@/lib/ledger/stats";

function Asset({ s }: { s: SignalDoc }) {
	if (s.status === "open") return <Redaction width={6} />;
	return <>{s.asset ?? "—"}</>;
}

function Result({ s }: { s: SignalDoc }) {
	return isClosed(s) ? (
		<Pct value={s.closedReturnPct} />
	) : (
		<span className="font-mono text-bone-dim">—</span>
	);
}

function moduleName(s: SignalDoc) {
	const m = moduleBySlug(s.module);
	return m ? `${m.code} ${m.nameZh}` : s.module;
}

/** Ledger rows: a real table from md up, two-line cards below (same data, one visible at a time). */
export function LedgerList({
	items,
	caption,
}: {
	items: SignalDoc[];
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
				<tbody>
					{items.map((s) => (
						<tr
							key={s.id}
							className="border-b border-line transition-colors hover:bg-ink-1"
						>
							<td className="px-3 py-5 font-mono whitespace-nowrap">
								<Link
									href={`/ledger/${s.id}`}
									className="text-dossier underline underline-offset-4 hover:text-stamp"
								>
									{s.id}
								</Link>
							</td>
							<td className="px-3 py-5 font-mono text-[13px] whitespace-nowrap text-bone-dim">
								{formatShort(s.openedAt)}
							</td>
							<td className="px-3 py-5 text-sm text-bone-dim">
								{moduleName(s)}
							</td>
							<td className="px-3 py-5 text-sm text-bone-dim">
								{directionLabel[s.direction]}
							</td>
							<td className="px-3 py-5 font-serif-zh text-base font-bold">
								<Asset s={s} />
							</td>
							<td className="px-3 py-5">
								<Stamp status={s.status} size="sm" />
							</td>
							<td className="px-3 py-5 text-right whitespace-nowrap">
								<Result s={s} />
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<ul className="md:hidden" aria-label={caption}>
				{items.map((s) => (
					<li
						key={s.id}
						className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-b border-line py-[18px]"
					>
						<Link
							href={`/ledger/${s.id}`}
							className="font-mono text-dossier underline underline-offset-4"
						>
							{s.id}
						</Link>
						<span className="row-span-2 self-center">
							<Stamp status={s.status} size="sm" />
						</span>
						<span className="font-serif-zh text-base font-bold">
							<Asset s={s} />{" "}
							<span className="text-sm font-normal text-bone-dim">
								{directionLabel[s.direction]}
							</span>
						</span>
						<span className="font-mono text-[13px] text-bone-dim">
							{formatShort(s.openedAt)}
						</span>
						<span className="text-right">
							<Result s={s} />
						</span>
					</li>
				))}
			</ul>
		</>
	);
}
