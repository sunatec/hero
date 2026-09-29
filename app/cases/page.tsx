import type { Metadata } from "next";
import { Suspense } from "react";
import { CasesExplorer, CasesGrid } from "@/components/cases/CasesExplorer";
import { LedgerHeader } from "@/components/ledger/LedgerHeader";
import { RiskNote } from "@/components/site/RiskNote";
import { caseRows, ledgerStart } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { wrap } from "@/lib/ui";

export const metadata: Metadata = {
	title: "精选案例",
	description:
		"0xInChain 在 X 发布的历史复盘精选。精选、非完整记录，不计入台账统计。",
};

export default function CasesPage() {
	const start = ledgerStart ? formatDate(ledgerStart) : "台账上线";
	return (
		<main id="main">
			<LedgerHeader
				kicker="社群战绩 · Case Studies"
				title="精选案例"
				intro="台账启动之前，我们在 X 上公开过的部分复盘。"
				current="/cases"
				aside={
					<span className="text-[28px] leading-tight font-medium text-bone">
						{caseRows.length} 条
					</span>
				}
			/>
			<section className={wrap} aria-label="精选案例">
				<div
					role="note"
					className="mb-10 rounded-file border border-stamp p-5 md:p-6"
				>
					<p className="m-0 font-mono text-xs tracking-[0.12em] text-stamp">
						精选 · 非完整记录
					</p>
					<p className="mt-3 mb-0 max-w-[44em] leading-relaxed">
						这些是 {start} 之前在 X 发布的复盘，是
						<b className="font-medium">挑选过的</b>
						。收益是原帖写的最大涨幅口径，未经统一核验，
						<b className="font-medium">不计入台账统计</b>。想看完整记录，请看{" "}
						<a
							href="/ledger"
							className="text-bone underline underline-offset-4 hover:text-stamp"
						>
							信号台账
						</a>
						。
					</p>
				</div>
				<Suspense fallback={<CasesGrid items={caseRows} />}>
					<CasesExplorer rows={caseRows} />
				</Suspense>
				<RiskNote variant="cases" className="mt-14" />
				<RiskNote className="mt-3" />
			</section>
		</main>
	);
}
