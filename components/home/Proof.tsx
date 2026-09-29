import Link from "next/link";
import { Pct } from "@/components/dossier/Fields";
import { SectionDivider } from "@/components/dossier/SectionDivider";
import { Arrow } from "@/components/site/Button";
import { ledgerStart, stats } from "@/lib/content";
import { daysSince, formatDate } from "@/lib/format";
import { section, wrap } from "@/lib/ui";

const CELLS = [
	{ key: "registered", label: "已登记", href: "/ledger" },
	{ key: "hit", label: "命中", href: "/ledger?status=hit" },
	{ key: "invalidated", label: "失效", href: "/ledger?status=invalidated" },
	{ key: "stopped", label: "止损", href: "/ledger?status=stopped" },
	{ key: "expired", label: "超时", href: "/ledger?status=expired" },
	{ key: "open", label: "进行中", href: "/ledger?status=open" },
] as const;

/** § 02 — facts first. No headline "win rate": every outcome gets the same cell (WEBSITE_PLAN §8.4). */
export function Proof() {
	const value = (k: (typeof CELLS)[number]["key"]) =>
		k === "registered" ? stats.registered : stats.counts[k];
	return (
		<section aria-labelledby="proof-h" className={`${wrap} ${section}`}>
			<SectionDivider n={2} title="证据" id="proof-h" />
			<ul className="grid grid-cols-2 border-y border-line md:grid-cols-3 lg:grid-cols-6">
				{CELLS.map((c, i) => (
					<li
						key={c.key}
						className={`border-line ${i % 2 ? "border-l" : ""} ${i >= 2 ? "border-t" : ""} md:border-t-0 ${
							i % 3 ? "md:border-l" : "md:border-l-0"
						} ${i >= 3 ? "md:border-t" : ""} lg:border-t-0 ${i ? "lg:border-l" : "lg:border-l-0"}`}
					>
						<Link
							href={c.href}
							className="flex flex-col gap-3 px-4 pt-5 pb-[18px] transition-colors hover:bg-ink-1 md:px-[22px] md:pt-[26px] md:pb-[22px]"
						>
							<span className="font-mono text-[32px] leading-none font-medium tracking-[-0.02em] tabular-nums md:text-[40px]">
								{value(c.key)}
							</span>
							<span className="font-serif-zh text-sm font-medium tracking-[0.1em] text-bone-dim">
								{c.label}
							</span>
						</Link>
					</li>
				))}
			</ul>
			<div className="mt-4 flex flex-wrap justify-between gap-3 font-mono text-[13px] leading-relaxed text-bone-dim">
				{stats.smallSample ? (
					<span>
						台账运行第 {ledgerStart ? daysSince(ledgerStart) : 1} 天 · 已结案{" "}
						{stats.closed} 份，样本较少，统计仅供参考
					</span>
				) : (
					<span>
						结案收益中位数{" "}
						{stats.medianReturn === null ? (
							"—"
						) : (
							<Pct value={stats.medianReturn} />
						)}{" "}
						· 平均持有 {stats.avgHoldingDays} 天 · 统计区间{" "}
						{ledgerStart ? formatDate(ledgerStart) : "—"} – 今日
					</span>
				)}
				<Link
					href="/methodology"
					className="text-bone underline underline-offset-4 hover:text-stamp"
				>
					收益口径与结案规则 <Arrow />
				</Link>
			</div>
		</section>
	);
}
