import type { Metadata } from "next";
import { Suspense } from "react";
import { PaneGrid } from "@/components/pane/Pane";
import { PageHeader } from "@/components/site/PageHeader";
import { ToolPane } from "@/components/tools/ToolPane";
import { ToolsExplorer, ToolsGrid } from "@/components/tools/ToolsExplorer";
import { toolRows } from "@/lib/content";
import { label, wrap } from "@/lib/ui";

const INTRO =
	"档案室隔壁的监控室。8 个自研监控模块全天运行，异动实时推送到成员频道；其中有明确方向的交易信号，会登记进台账。";

export const metadata: Metadata = {
	title: "链上工具箱",
	description: INTRO,
};

/** Copy: docs/copy/tools-research.md · layout: docs/ia/wireframes.md. */
export default function ToolsPage() {
	const running = toolRows.filter((t) => t.status !== "planned");
	const planned = toolRows.filter((t) => t.status === "planned");
	const count = (s: string) => running.filter((t) => t.status === s).length;
	return (
		<main id="main">
			<PageHeader
				kicker="链上工具箱 · Monitoring Room"
				title="链上工具箱"
				intro={INTRO.replace("8", String(running.length))}
				aside={
					<p className="m-0 font-data text-[12px]">
						模块 <b className="font-medium text-bone">{running.length}</b> ·
						运行{" "}
						<b className="font-medium text-bone">
							{count("member") + count("public")}
						</b>{" "}
						· 测试 <b className="font-medium text-bone">{count("beta")}</b>
					</p>
				}
			/>
			<section aria-label="监控模块" className={`${wrap} pb-16 md:pb-20`}>
				<Suspense fallback={<ToolsGrid items={running} />}>
					<ToolsExplorer rows={running} />
				</Suspense>
			</section>
			{planned.length ? (
				<section
					aria-labelledby="roadmap-h"
					className={`${wrap} pb-12 md:pb-16`}
				>
					<h2 id="roadmap-h" className={`${label} mb-6`}>
						Roadmap · 规划中
					</h2>
					<PaneGrid>
						{planned.map((t) => (
							<ToolPane key={t.slug} t={t} />
						))}
					</PaneGrid>
				</section>
			) : null}
			<section className={`${wrap} pb-20`}>
				<p className="max-w-[60em] text-[13px] leading-relaxed text-bone-dim">
					模块数据仅供研究参考，存在延迟与误报；推送内容不构成投资建议。模块公开后，可以在对应卡片上直接打开使用。
				</p>
			</section>
		</main>
	);
}
