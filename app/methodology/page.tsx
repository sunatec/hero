import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Stamp } from "@/components/dossier/Stamp";
import { LedgerHeader } from "@/components/ledger/LedgerHeader";
import { RiskNote } from "@/components/site/RiskNote";
import { ledgerStart } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { wrap } from "@/lib/ui";

export const metadata: Metadata = {
	title: "方法论",
	description:
		"台账如何登记、何时结案、收益怎么算，以及为什么失败的信号也要公开。",
};

/** Copy: docs/copy/ledger.md「/methodology」. Rules mirror lib/ledger/* — keep them in sync. */
const SECTIONS = [
	{ id: "what", title: "台账是什么" },
	{ id: "signal", title: "什么算一条信号" },
	{ id: "register", title: "立案与登记" },
	{ id: "redaction", title: "涂黑规则" },
	{ id: "closing", title: "结案规则" },
	{ id: "returns", title: "收益口径" },
	{ id: "evidence", title: "证据类型" },
	{ id: "void", title: "作废与修改" },
	{ id: "cases", title: "精选案例和台账的区别" },
	{ id: "limits", title: "局限性" },
] as const;

function Rule({
	n,
	id,
	children,
}: {
	n: number;
	id: string;
	children: ReactNode;
}) {
	const s = SECTIONS.find((x) => x.id === id);
	return (
		<section
			id={id}
			aria-labelledby={`${id}-h`}
			className="scroll-mt-24 border-t border-line pt-8 pb-12"
		>
			<h2 id={`${id}-h`} className="mb-5 flex items-baseline gap-3">
				<span className="font-mono text-xs tracking-[0.12em] text-dossier">
					{String(n).padStart(2, "0")}
				</span>
				<span className="font-serif-zh text-2xl font-bold">{s?.title}</span>
			</h2>
			<div className="max-w-[40em] space-y-4 leading-relaxed text-bone-dim [&_b]:font-medium [&_b]:text-bone">
				{children}
			</div>
		</section>
	);
}

const td = "border-b border-line py-3 pr-4 align-top";

export default function MethodologyPage() {
	const start = ledgerStart ? formatDate(ledgerStart) : "台账起始日";
	return (
		<main id="main">
			<LedgerHeader
				kicker="社群战绩 · Methodology"
				title="方法论"
				intro="一份只展示成功的战绩没有参考价值。这一页说明台账如何登记、何时结案、收益怎么算——以及为什么失败的信号也要公开。"
				current="/methodology"
			/>
			<div
				className={`${wrap} grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16`}
			>
				<nav aria-label="目录" className="lg:sticky lg:top-24 lg:self-start">
					<ol className="m-0 list-none p-0 font-mono text-[13px] lg:space-y-2">
						{SECTIONS.map((s, i) => (
							<li key={s.id}>
								<a
									href={`#${s.id}`}
									className="inline-flex min-h-11 items-center text-bone-dim underline-offset-4 hover:text-bone hover:underline lg:min-h-0"
								>
									{String(i + 1).padStart(2, "0")} {s.title}
								</a>
							</li>
						))}
					</ol>
				</nav>

				<article>
					<Rule n={1} id="what">
						<p>
							台账是从 {start} 起的一份<b>前向、全量</b>
							记录。「前向」指只记录上线之后发出的信号，不补登历史；「全量」指每一条符合定义的信号都会登记，不做挑选。
						</p>
					</Rule>

					<Rule n={2} id="signal">
						<p>
							<b>登记</b>
							：成员频道里带明确方向的交易信号，包括实战操作播报中的建仓，以及明确的风险预警。每条都会写明方向、入场参考和失效条件。
						</p>
						<p>
							<b>不登记</b>：监控模块自动推送的原始异动提醒，例如一次 OI
							变化、一笔巨鲸转账。它们是信号的素材，本身没有方向和结案条件。
						</p>
						<p>
							同一标的在持有期内的加仓或减仓，记在同一份档案的修改记录里，不另开新档案。
						</p>
					</Rule>

					<Rule n={3} id="register">
						<p>
							信号推送到成员频道的时刻就是<b>立案时间</b>。我们在立案后
							<b>两小时内</b>把它登记到台账，得到一个连续编号，例如
							IC-2026-0001。编号按登记顺序分配，编号大的档案不可能登记得更早。
						</p>
						<p>登记晚于两小时的档案，会在页面上显示「延迟登记」标记。</p>
					</Rule>

					<Rule n={4} id="redaction">
						<p>
							进行中的档案只公开编号、立案时间、模块、方向和链。标的、价格、依据等字段会被涂黑——
							<b>这些内容不会出现在网站的代码里</b>
							，结案之后才会写入；网站构建时会自动拦下任何提前写入的成员字段。结案后
							24 小时内公开全部字段。
						</p>
					</Rule>

					<Rule n={5} id="closing">
						<p>
							每条信号在立案时都预设了结案条件，先触发哪一条，就按哪一条结案：
						</p>
						<table className="w-full border-collapse text-sm">
							<caption className="sr-only">结案状态与条件</caption>
							<tbody>
								{(
									[
										["hit", "价格达到预设目标"],
										["stopped", "价格触及预设止损"],
										[
											"invalidated",
											"立案依据不再成立（例如聪明钱集群撤出），按当时价格结案",
										],
										[
											"expired",
											"超过最长持有期（默认 30 天，按模块可能不同），按当时价格结案",
										],
										[
											"void",
											"登记错误等特殊情况。编号保留，写明原因，不计入统计",
										],
									] as const
								).map(([status, rule]) => (
									<tr key={status}>
										<td className={`${td} w-28`}>
											<Stamp status={status} size="sm" />
										</td>
										<td className={td}>{rule}</td>
									</tr>
								))}
							</tbody>
						</table>
					</Rule>

					<Rule n={6} id="returns">
						<p>
							<b>结案收益</b>：按结案价格计算，<b>所有统计默认使用这个口径</b>。
						</p>
						<p>
							<b>最大涨幅</b>：持有期内最有利的价格偏移，只作参考。
							<b>最大回撤</b>：持有期内最不利的偏移。两者由持有期的 K
							线最高价和最低价计算，始终满足「最大回撤 ≤ 结案收益 ≤ 最大涨幅」。
						</p>
						<ul className="m-0 list-none space-y-2 rounded-file border border-line bg-ink-1 p-5 font-mono text-[13px] text-bone">
							<li>做多　　 (结案价 − 入场价) ÷ 入场价</li>
							<li>做空　　 (入场价 − 结案价) ÷ 入场价</li>
							<li>
								风险预警 (预警价 − 结案价) ÷ 预警价 ——按预警离场能避开多少跌幅
							</li>
						</ul>
						<p>
							不计手续费、资金费率和滑点，实际执行结果会与台账不同。汇总中不展示单独的「胜率」数字；结案少于
							10 份时，统计会标注「样本较少」。
						</p>
					</Rule>

					<Rule n={7} id="evidence">
						<p>
							TG 推送截图（带时间）· 链上交易 · 地址 · 行情截图 · X
							复盘。每份结案档案至少附一项证据。
						</p>
					</Rule>

					<Rule n={8} id="void">
						<p>
							任何档案都<b>不会被删除</b>
							。编号连续，缺号会被系统拦截。修改已公开的内容时，页面上会保留一条修改记录，写明时间和原因。
						</p>
					</Rule>

					<Rule n={9} id="cases">
						<p>
							<Link
								href="/cases"
								className="text-bone tap underline underline-offset-4 hover:text-stamp"
							>
								精选案例
							</Link>
							是台账启动之前在 X 发布的复盘，是<b>挑选过的</b>
							，收益按原帖的最大涨幅口径，不计入任何统计。我们把它们放在单独的页面，并在每处都标注「精选」。
						</p>
					</Rule>

					<Rule n={10} id="limits">
						<ul className="m-0 list-disc space-y-2 pl-5">
							<li>台账反映的是信号本身，不是任何人的实际盈亏</li>
							<li>样本量少时，统计数字的波动会很大</li>
							<li>链上数据存在延迟，地址标签可能出错，监控模块也会误报</li>
							<li>过往表现不代表未来结果</li>
						</ul>
					</Rule>

					<RiskNote variant="ledger" className="mt-4" />
					<RiskNote className="mt-3" />
				</article>
			</div>
		</main>
	);
}
