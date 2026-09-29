import Link from "next/link";
import { Fragment } from "react";
import { CasesGrid } from "@/components/cases/CasesExplorer";
import { AgentPhoto } from "@/components/dossier/AgentPhoto";
import { RedactedLine } from "@/components/dossier/Redaction";
import { SectionDivider } from "@/components/dossier/SectionDivider";
import { LedgerList } from "@/components/ledger/LedgerList";
import { Pane, PaneGrid, PaneTitle, paneAction } from "@/components/pane/Pane";
import { Arrow, ButtonLink } from "@/components/site/Button";
import { RiskNote } from "@/components/site/RiskNote";
import {
	agent,
	featuredCases,
	latestClosed,
	moduleBySlug,
	research,
	rows,
	runningModules,
	signals,
	stats,
	toCaseRow,
} from "@/lib/content";
import { martianMono } from "@/lib/fonts";
import { formatDate } from "@/lib/format";
import { categoryLabel } from "@/lib/i18n/labels";
import type { ModuleSlug } from "@/lib/schema/common";
import { section, wrap } from "@/lib/ui";
import { site, TBD } from "@/site.config";

const inlineLink = "text-bone underline underline-offset-4 hover:text-stamp";

/* § 03 ------------------------------------------------------------------ */
const WATCH: { label: string; module?: ModuleSlug }[] = [
	{ label: "聪明钱地址集群", module: "smart-money-radar" },
	{ label: "交易所巨鲸" },
	{ label: "衍生品 OI 异动", module: "oi-tracker" },
	{ label: "Coinbase 溢价", module: "coinbase-premium" },
	{ label: "Hyperliquid 大单", module: "hyperliquid-radar" },
	{ label: "KOL 钱包", module: "kol-asset-tracker" },
	{ label: "DCA 流向", module: "jup-dca" },
];

export function Monitor() {
	return (
		<section aria-labelledby="watch-h" className={`${wrap} ${section}`}>
			<SectionDivider n={3} title="我们盯什么" id="watch-h" />
			<p className="m-0 max-w-[21em] font-serif-zh text-[23px] leading-[1.6] font-bold tracking-[0.02em] md:text-[clamp(28px,3.4vw,44px)] md:tracking-[0.04em]">
				{WATCH.map((w, i) => {
					const href =
						w.module && moduleBySlug(w.module)
							? `/tools/${w.module}`
							: "/tools";
					// The space between items sits outside the nowrap span, so lines can break there.
					return (
						<Fragment key={w.label}>
							<span className="whitespace-nowrap">
								<Link
									href={href}
									className="underline decoration-line decoration-2 underline-offset-[0.2em] transition-colors hover:decoration-stamp"
								>
									{w.label}
								</Link>
								{i < WATCH.length - 1 ? (
									<span
										aria-hidden="true"
										className="ml-[0.2em] font-normal text-bone-dim"
									>
										·
									</span>
								) : (
									"——"
								)}
							</span>
							{i < WATCH.length - 1 ? " " : null}
						</Fragment>
					);
				})}
				<span className="text-stamp">以及链上任何反常的动静。</span>
			</p>
			<p className="mt-7 font-mono text-[13px] leading-relaxed text-bone-dim">
				数据源：CoinGlass Pro API · 自建四链地址标签库 · Hyperliquid 公开订单流
				· Jupiter DCA 订单
			</p>
		</section>
	);
}

/* § 04 ------------------------------------------------------------------ */
export function LatestLedger() {
	return (
		<section aria-labelledby="ledger-h" className={`${wrap} ${section}`}>
			<SectionDivider n={4} title="最新台账" id="ledger-h" />
			<p className="mb-6 max-w-[40em] text-bone-dim">
				每一条交易信号在推送后两小时内登记。进行中的档案，标的与价格暂时涂黑。
			</p>
			{signals.length ? (
				<LedgerList items={rows.slice(0, 5)} caption="最新 5 份台账档案" />
			) : (
				<p className="border-y border-line py-10 text-center text-bone-dim">
					今天还没有新的立案。
				</p>
			)}
			<div className="mt-4 flex flex-wrap justify-between gap-3 font-mono text-[13px] text-bone-dim">
				<span>风险预警类信号按预警后的跌幅计算，见方法论</span>
				<Link href="/ledger" className={inlineLink}>
					完整台账（{stats.registered} 份）
					<Arrow />
				</Link>
			</div>
		</section>
	);
}

/* § 05 ------------------------------------------------------------------ */
const STEPS = [
	[
		"采集",
		"CoinGlass Pro API 的衍生品数据，BSC、BASE、ETH、SOL 四链的链上交互，Hyperliquid 订单流，Jupiter DCA 订单。",
	],
	[
		"清洗",
		"自研算法剔除刷量与对敲，把关联钱包归为同一实体，只留下有建仓意义的资金行为。",
	],
	[
		"判断",
		"多个信号交叉验证：OI 异动、机构溢价、聪明钱流向。主理人复核后才推送。",
	],
	["推送", "带时间戳推送到成员 TG 频道，写明依据、失效条件和风险。"],
	["登记", "两小时内登记到公开台账；按预设规则结案，失败的也同样公开。"],
] as const;

export function HowItWorks() {
	return (
		<section aria-labelledby="how-h" className={`${wrap} ${section}`}>
			<SectionDivider n={5} title="情报如何产生" id="how-h" />
			<p className="mb-10 max-w-[40em] text-bone-dim">
				情绪会放大噪音，价格会制造假象，资金流向更接近真实答案。我们把它拆成五个步骤。
			</p>
			<ol className="grid gap-px border border-line bg-line md:grid-cols-5">
				{STEPS.map(([title, body], i) => {
					const last = i === STEPS.length - 1;
					return (
						<li
							key={title}
							className={`bg-ink-0 p-5 md:p-6 ${last ? "md:bg-ink-1" : ""}`}
						>
							<p
								className={`font-mono text-xs tracking-[0.12em] ${last ? "text-stamp" : "text-dossier"}`}
							>
								{String(i + 1).padStart(2, "0")}
							</p>
							<h3
								className={`mt-2 mb-3 font-serif-zh text-xl font-bold ${last ? "text-stamp" : ""}`}
							>
								{title}
							</h3>
							<p className="m-0 text-sm leading-relaxed text-bone-dim">
								{body}
							</p>
						</li>
					);
				})}
			</ol>
			<p className="mt-5">
				<Link
					href="/methodology"
					className={`${inlineLink} font-mono text-[13px]`}
				>
					阅读方法论 <Arrow />
				</Link>
			</p>
		</section>
	);
}

/* § 06 ------------------------------------------------------------------ */
export function IntelSample() {
	const mod = moduleBySlug("smart-money-radar") ?? runningModules[0];
	if (!mod) return null;
	const lines = mod.samples.flatMap((s) => s.lines);
	return (
		<section aria-labelledby="sample-h" className={`${wrap} ${section}`}>
			<SectionDivider n={6} title="情报样本" id="sample-h" />
			<div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
				<figure
					aria-label="成员频道推送样本（部分内容已涂黑）"
					className="m-0 rounded-file border border-line bg-ink-1 px-[18px] py-5 font-mono text-[13.5px] leading-[1.95] md:px-6 md:text-[15px]"
				>
					<div className="mb-3 flex justify-between border-b border-dashed border-line pb-3 text-[13px] text-bone-dim">
						<span>0xInChain · 成员频道</span>
						<span>
							{mod.code} {mod.nameZh}
						</span>
					</div>
					{lines.map((line) => (
						<p key={line} className="m-0">
							<RedactedLine line={line} />
						</p>
					))}
				</figure>
				<ol className="m-0 list-none space-y-4 border-l border-dossier py-1 pl-[22px] text-[15px] text-bone-dim">
					<li>
						<span className="mr-2 font-serif-zh font-bold text-dossier">①</span>
						这是<b className="font-medium text-bone">{mod.nameZh}</b>
						的推送格式，成员会在异动发生后第一时间收到完整版本。
					</li>
					<li>
						<span className="mr-2 font-serif-zh font-bold text-dossier">②</span>
						涂黑部分——地址、标的、价格、操作参考——只对成员可见
						{latestClosed ? (
							<>
								；已结案信号会在台账完整公开，例如{" "}
								<Link
									href={`/ledger/${latestClosed.id}`}
									className={inlineLink}
								>
									{latestClosed.id}
								</Link>
							</>
						) : null}
						。
					</li>
					<li>
						<span className="mr-2 font-serif-zh font-bold text-dossier">③</span>
						每一条交易信号都会在两小时内登记为一份台账档案，编号连续，不可删除。
					</li>
					<li className="pt-1">
						<ButtonLink href="/join" variant="link">
							申请加入 <Arrow />
						</ButtonLink>
					</li>
				</ol>
			</div>
		</section>
	);
}

/* § 07 ------------------------------------------------------------------ */
export function ToolboxPreview() {
	return (
		<section
			aria-labelledby="tools-h"
			className={`${wrap} ${section} ${martianMono.variable}`}
		>
			<SectionDivider n={7} title="链上工具箱" id="tools-h" />
			<p className="mb-8 max-w-[40em] text-bone-dim">
				{runningModules.length}{" "}
				个自研监控模块全天运行。它们是情报的来源，也是成员每天实际收到的东西。
			</p>
			<PaneGrid>
				{runningModules.map((m) => (
					<Pane
						key={m.slug}
						label={`${m.code} / ${categoryLabel[m.category].code}`}
						status={m.status}
						footer={
							<Link
								href={`/tools/${m.slug}`}
								className={`${paneAction} ml-auto`}
								aria-label={`${m.nameZh} 详情`}
							>
								详情
							</Link>
						}
					>
						<PaneTitle en={m.nameEn} zh={m.nameZh} />
						<p className="m-0 font-sans text-[13px] leading-relaxed text-bone-dim">
							{m.tagline}
						</p>
					</Pane>
				))}
			</PaneGrid>
			<p className="mt-5">
				<Link href="/tools" className={`${inlineLink} font-mono text-[13px]`}>
					进入链上工具箱 <Arrow />
				</Link>
			</p>
		</section>
	);
}

/* § 08 ------------------------------------------------------------------ */
export function FeaturedCases() {
	if (featuredCases.length === 0) return null;
	return (
		<section aria-labelledby="cases-h" className={`${wrap} ${section}`}>
			<SectionDivider n={8} title="精选案例" id="cases-h" />
			<div className="mb-10 flex flex-wrap items-baseline gap-x-4 gap-y-2">
				<span className="border border-stamp px-2 py-1 font-mono text-xs tracking-[0.1em] text-stamp">
					精选 · 非完整记录
				</span>
				<p className="m-0 max-w-[40em] text-bone-dim">
					台账启动之前，我们在 X
					上公开过的部分复盘。收益是原帖写的最大涨幅口径，不计入台账统计。
				</p>
			</div>
			<CasesGrid items={featuredCases.map(toCaseRow)} />
			<p className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[13px]">
				<Link href="/cases" className={inlineLink}>
					全部精选案例 <Arrow />
				</Link>
				<Link href="/ledger" className={inlineLink}>
					查看完整台账 <Arrow />
				</Link>
			</p>
		</section>
	);
}

/* § 09 ------------------------------------------------------------------ */
export function AgentFile() {
	const a = agent;
	return (
		<section aria-labelledby="agent-h" className={`${wrap} ${section}`}>
			<SectionDivider n={9} title="主理人档案" id="agent-h" />
			<div className="grid items-start gap-10 md:grid-cols-[auto_1fr] md:gap-14">
				<AgentPhoto src={a?.photo || undefined} />
				<div>
					<dl className="grid max-w-[520px] grid-cols-[5em_1fr] gap-x-5 gap-y-2.5 font-mono text-sm">
						{[
							["代号", a?.codename ?? "待补充"],
							["入行", a?.since ?? "待补充"],
							["专长", a?.focus.join(" · ") ?? "待补充"],
							["风格", a?.style ?? "待补充"],
							["X", a?.handle ?? site.officialChannels[1]?.handle],
						].map(([k, v]) => (
							<div key={k} className="contents">
								<dt className="text-dossier">{k}</dt>
								<dd className="m-0">{v}</dd>
							</div>
						))}
					</dl>
					{a?.why ? (
						<blockquote className="mt-8 max-w-[34em] border-l border-dossier pl-5 font-serif-zh text-lg leading-relaxed">
							「{a.why}」
						</blockquote>
					) : null}
					<p className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[13px]">
						<Link href="/about" className={inlineLink}>
							完整档案 <Arrow />
						</Link>
						<a
							href={site.social.x}
							target="_blank"
							rel="noopener noreferrer"
							className={inlineLink}
						>
							在 X 关注 <Arrow>↗</Arrow>
						</a>
					</p>
				</div>
			</div>
		</section>
	);
}

/* § 10 ------------------------------------------------------------------ */
const FIT = [
	[
		"有自己的交易体系，把情报当作决策的一部分",
		"希望有人直接告诉你买什么、卖什么",
	],
	[
		"能读懂 OI、资金费率、链上地址等基础数据",
		"期待确定的收益，或者无法接受亏损",
	],
	["重视风控和纪律，愿意独立判断", "打算转发、转售或搬运情报内容"],
	["看重信息的时效与来源", "只想免费体验，再决定是否付费"],
] as const;

export function FitCheck({ n = 10 }: { n?: number } = {}) {
	return (
		<section aria-labelledby="fit-h" className={`${wrap} ${section}`}>
			<SectionDivider n={n} title="这间情报室适合谁" id="fit-h" />
			<div className="grid gap-px border border-line bg-line md:grid-cols-2">
				{(["适合", "不太适合"] as const).map((title, col) => (
					<div key={title} className="bg-ink-0 p-6 md:p-8">
						<h3
							className={`mb-5 font-serif-zh text-xl font-bold ${col ? "text-bone-dim" : ""}`}
						>
							{title}
						</h3>
						<ul
							className={`m-0 list-none space-y-3 p-0 ${col ? "text-bone-dim" : ""}`}
						>
							{FIT.map((row) => (
								<li key={row[col]} className="flex gap-3">
									<span aria-hidden="true" className="font-mono text-dossier">
										—
									</span>
									{row[col]}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</section>
	);
}

/* § 11 ------------------------------------------------------------------ */
const JOIN_STEPS = [
	["提交申请", "在本站填写简短问卷"],
	["官方联系", "管理员通过官方 TG 账号联系你（请在「官方渠道验证」页核对）"],
	["确认方案", "选择季度、半年或年付，确认最终价格"],
	["付款入群", "付款后加入成员频道"],
] as const;

export function JoinSection() {
	const { pricing, batch } = site;
	const priced = pricing.plans.every((p) => p.from !== TBD);
	return (
		<section aria-labelledby="join-h" className={`${wrap} ${section}`}>
			<SectionDivider n={11} title="加入" id="join-h" />
			<p className="mb-10 max-w-[40em] text-bone-dim">
				申请制。我们每天只审核一位新成员——人数增长太快，信号被聚合群转发的风险就越大，信号质量也会被稀释。
			</p>
			<div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
				<div>
					<ol className="m-0 list-none space-y-5 p-0">
						{JOIN_STEPS.map(([title, body], i) => (
							<li key={title} className="grid grid-cols-[2.5em_1fr] gap-2">
								<span className="font-mono text-dossier">
									{String(i + 1).padStart(2, "0")}
								</span>
								<span>
									<b className="font-serif-zh font-bold">{title}</b>
									<span className="text-bone-dim"> — {body}</span>
								</span>
							</li>
						))}
					</ol>
					<p className="mt-8 font-mono text-[13px] text-bone-dim">
						不设试用 · 售出后不退款（原因见{" "}
						<Link href="/legal/terms" className={inlineLink}>
							服务条款
						</Link>
						）
					</p>
				</div>
				<div className="rounded-file border border-line bg-ink-1 p-6 md:p-7">
					<p className="font-mono text-[11px] tracking-[0.14em] text-dossier">
						参考价
					</p>
					{priced ? (
						<ul className="mt-3 mb-4 list-none space-y-1.5 p-0 font-mono">
							{pricing.plans.map((p) => (
								<li key={p.period} className="flex justify-between">
									<span className="text-bone-dim">{p.label}</span>
									<span>
										{p.from} {pricing.currency} 起
									</span>
								</li>
							))}
						</ul>
					) : (
						<p className="mt-3 mb-4 font-serif-zh text-xl font-bold">
							参考价待公布
						</p>
					)}
					<p className="text-[13px] leading-relaxed text-bone-dim">
						以 {pricing.currency}{" "}
						计价，会根据社群阶段与系统投入调整，以管理员付款前的最终确认为准。
					</p>
					<p className="mt-5 border-t border-dashed border-line pt-4 font-mono text-[13px]">
						{batch.status === "full"
							? `${batch.name}已满 · 可提交候补申请`
							: `${batch.name} · ${batch.seats} 席 · 每日审核 ${batch.reviewPerDay} 位`}
					</p>
					<ButtonLink href="/join" className="mt-5 w-full justify-center">
						{batch.status === "full" ? "提交候补申请" : "申请加入"} <Arrow />
					</ButtonLink>
				</div>
			</div>
			<RiskNote className="mt-10" />
		</section>
	);
}

/* § 12 ------------------------------------------------------------------ */
export function LatestResearch() {
	if (research.length === 0) return null;
	return (
		<section aria-labelledby="research-h" className={`${wrap} ${section}`}>
			<SectionDivider n={12} title="Research" id="research-h" />
			<ol className="m-0 list-none border-t border-line p-0">
				{research.slice(0, 2).map((r, i) => (
					<li key={r.slug} className="border-b border-line">
						<Link
							href={`/research/${r.slug}`}
							className="grid grid-cols-[3em_1fr_auto] items-baseline gap-4 py-5 hover:text-stamp"
						>
							<span className="font-mono text-dossier">
								{String(i + 1).padStart(2, "0")}
							</span>
							<span className="font-serif-zh text-lg font-bold">{r.title}</span>
							<span className="font-mono text-[13px] text-bone-dim">
								{formatDate(r.publishedAt)}
							</span>
						</Link>
					</li>
				))}
			</ol>
			<p className="mt-5">
				<Link
					href="/research"
					className={`${inlineLink} font-mono text-[13px]`}
				>
					全部 Research <Arrow />
				</Link>
			</p>
		</section>
	);
}
