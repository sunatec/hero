import type { Metadata } from "next";
import { Suspense } from "react";
import {
	LedgerExplorer,
	LedgerStats,
} from "@/components/ledger/LedgerExplorer";
import { LedgerHeader } from "@/components/ledger/LedgerHeader";
import { LedgerList } from "@/components/ledger/LedgerList";
import { JsonLd } from "@/components/site/JsonLd";
import { RiskNote } from "@/components/site/RiskNote";
import { ledgerStart, rows } from "@/lib/content";
import { formatDate, formatDateTime } from "@/lib/format";
import { itemListLd } from "@/lib/jsonld";
import { PAGE_SIZE } from "@/lib/ledger/rows";
import { pageMeta } from "@/lib/seo";
import { wrap } from "@/lib/ui";

export const metadata: Metadata = pageMeta({
	title: "信号台账",
	description:
		"每一条交易信号：立案即登记，结案即公开，命中、失效、止损同样记录。",
	path: "/ledger",
});

const lastUpdate = rows
	.map((r) => r.closedAt ?? r.registeredAt)
	.sort((a, b) => Date.parse(b) - Date.parse(a))[0];

export default function LedgerPage() {
	return (
		<main id="main">
			<JsonLd
				data={itemListLd(
					"0xInChain 信号台账",
					rows
						.slice(0, 50)
						.map((r) => ({ name: r.id, path: `/ledger/${r.id}` })),
				)}
			/>
			<LedgerHeader
				kicker="社群战绩 · Signal Ledger"
				title="信号台账"
				intro="从台账起始日起的每一条交易信号都在这里：立案即登记，结案即公开。命中、失效、止损，用同样的格式记录。"
				current="/ledger"
				aside={
					<>
						台账起始日
						<b className="block font-mono text-[28px] leading-tight font-medium text-bone">
							{ledgerStart ? formatDate(ledgerStart) : "上线日"}
						</b>
						{lastUpdate
							? `最后更新 ${formatDateTime(lastUpdate)} (UTC+8)`
							: null}
					</>
				}
			/>
			<section className={wrap} aria-label="台账">
				{/* Server-rendered fallback: unfiltered first page (no-JS visitors and the first paint). */}
				<Suspense
					fallback={
						<>
							<LedgerStats rows={rows} />
							<div className="mt-8">
								<LedgerList
									items={rows.slice(0, PAGE_SIZE)}
									caption="全部台账档案"
								/>
							</div>
						</>
					}
				>
					<LedgerExplorer rows={rows} />
				</Suspense>
				<p className="mt-4 font-mono text-[13px] text-bone-dim">
					风险预警类信号按预警后的跌幅计算 · 收益不含手续费与滑点
				</p>
				<RiskNote variant="ledger" className="mt-10" />
				<RiskNote className="mt-3" />
			</section>
		</main>
	);
}
