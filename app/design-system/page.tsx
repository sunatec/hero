import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SignalChart } from "@/components/charts/SignalChart";
import { Sparkline } from "@/components/charts/Sparkline";
import { AgentPhoto } from "@/components/dossier/AgentPhoto";
import {
	CaseFile,
	CaseFileFooter,
	CaseFileHeader,
} from "@/components/dossier/CaseFile";
import { Fields, Pct } from "@/components/dossier/Fields";
import { Marginalia } from "@/components/dossier/Marginalia";
import { RedactedLine, Redaction } from "@/components/dossier/Redaction";
import { SectionDivider } from "@/components/dossier/SectionDivider";
import { Stamp } from "@/components/dossier/Stamp";
import {
	Pane,
	PaneData,
	PaneFeed,
	PaneGrid,
	PaneTitle,
	paneAction,
	paneLink,
} from "@/components/pane/Pane";
import { Arrow, Button, ButtonLink } from "@/components/site/Button";
import { RiskNote } from "@/components/site/RiskNote";
import { Wordmark } from "@/components/site/Wordmark";
import { martianMono } from "@/lib/fonts";
import type { SignalStatus } from "@/lib/schema/signal";

export const metadata: Metadata = {
	title: "Design System",
	robots: { index: false, follow: false },
};

const SWATCHES = [
	{ name: "ink-0", hex: "#14161A", note: "页面底色" },
	{ name: "ink-1", hex: "#1B1E23", note: "档案卡" },
	{ name: "ink-2", hex: "#252930", note: "悬停 / 标题栏" },
	{ name: "line", hex: "#343841", note: "分隔线" },
	{ name: "bone", hex: "#E9E4D8", note: "正文 · 14.28" },
	{ name: "bone-dim", hex: "#A8A398", note: "次要 · 7.21" },
	{ name: "stamp", hex: "#E8604A", note: "强调 · 5.35" },
	{ name: "stamp-fill", hex: "#A93322", note: "按钮底 · 5.20" },
	{ name: "dossier", hex: "#C9A96A", note: "批注 · 8.08" },
	{ name: "gain", hex: "#6FBF8E", note: "数据 · 8.21" },
	{ name: "loss", hex: "#E07A68", note: "数据 · 6.17" },
	{ name: "redact", hex: "#0B0C0E", note: "涂黑" },
];

const STATUSES: SignalStatus[] = [
	"open",
	"hit",
	"invalidated",
	"stopped",
	"expired",
	"void",
];

const HYPE = [
	37.6, 37.9, 38.1, 38.2, 37.8, 38.6, 39.4, 39.1, 40.6, 41.2, 42.4, 41.9, 43.8,
	44.3, 45.6, 45.0, 45.4, 46.45, 46.0, 46.2, 45.9, 45.23,
];
const ARB = [
	0.409, 0.411, 0.412, 0.421, 0.429, 0.438, 0.433, 0.425, 0.427, 0.417, 0.409,
	0.405, 0.395, 0.397, 0.388, 0.383, 0.381, 0.379,
];

function Block({
	n,
	title,
	children,
}: {
	n: number;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="pb-24" aria-labelledby={`ds-${n}`}>
			<SectionDivider n={n} title={title} id={`ds-${n}`} />
			{children}
		</section>
	);
}

export default function DesignSystemPage() {
	if (process.env.VERCEL_ENV === "production") notFound();

	return (
		<main
			id="main"
			className={`mx-auto max-w-[1280px] px-5 py-16 md:px-8 xl:px-12 ${martianMono.variable}`}
		>
			<p className="font-mono text-[11px] tracking-[0.14em] text-dossier">
				DESIGN SYSTEM · M4 · 仅用于开发，不在生产环境显示
			</p>
			<h1 className="mt-3 mb-16 font-serif-zh text-[clamp(44px,6vw,72px)] leading-tight font-black tracking-[0.04em]">
				设计系统
			</h1>

			<Block n={1} title="色彩">
				<ul className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
					{SWATCHES.map((s) => (
						<li key={s.name} className="bg-ink-0 p-3">
							<span
								className="block h-14 border border-line"
								style={{ background: s.hex }}
							/>
							<p className="mt-2 font-mono text-xs text-bone">{s.name}</p>
							<p className="font-mono text-[11px] text-bone-dim">
								{s.hex} · {s.note}
							</p>
						</li>
					))}
				</ul>
			</Block>

			<Block n={2} title="字体">
				<div className="space-y-6">
					<p className="m-0 font-serif-zh text-[clamp(56px,8.2vw,110px)] leading-none font-black tracking-[0.04em]">
						链上情报局
					</p>
					<p className="m-0 font-latin text-[26px] text-bone-dim italic">
						On-chain Intelligence Bureau
					</p>
					<p className="m-0 font-serif-zh text-[clamp(32px,4vw,48px)] font-bold">
						H2 · 信号台账
					</p>
					<p className="m-0 font-serif-zh text-2xl font-bold">H3 · 档案详情</p>
					<p className="m-0 max-w-[24em] text-[clamp(18px,1.6vw,22px)]">
						Lead · 把链上资金的每一次异动，整理成可复盘的情报档案。
					</p>
					<p className="m-0 max-w-[38em]">
						Body 17/1.75 ·
						情绪会放大噪音，价格会制造假象，资金流向更接近真实答案。中英文之间留一个空格，例如
						CoinGlass Pro API。
					</p>
					<p className="m-0 font-mono text-[13px] text-bone-dim">
						Meta · IBM Plex Mono · 2026.10.14 10:02 (UTC+8)
					</p>
					<p className="m-0 font-data text-[13px]">
						Data · Martian Mono · OI +14.2% / 1h · 1200 req/min
					</p>
				</div>
			</Block>

			<Block n={3} title="按钮">
				<div className="flex flex-wrap items-center gap-8">
					<ButtonLink href="/join">
						申请加入 <Arrow />
					</ButtonLink>
					<ButtonLink href="/join" size="sm">
						申请加入
					</ButtonLink>
					<ButtonLink href="/ledger" variant="link">
						查看信号台账 <Arrow />
					</ButtonLink>
					<Button variant="bracket">详情</Button>
					<Button disabled className="cursor-not-allowed opacity-50">
						提交中…
					</Button>
					<Wordmark className="h-6 w-auto" />
				</div>
			</Block>

			<Block n={4} title="印章 · 六种状态 × 三种尺寸">
				<div className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
					{STATUSES.map((s, i) => (
						<div
							key={s}
							className="flex flex-col items-center gap-6 bg-ink-0 px-3 pt-10 pb-6"
						>
							<Stamp status={s} size="lg" animate delay={0.1 + i * 0.06} />
							<Stamp status={s} date="10.13" />
							<Stamp status={s} size="sm" />
							<span className="font-mono text-xs text-bone-dim">{s}</span>
						</div>
					))}
				</div>
			</Block>

			<Block n={5} title="涂黑">
				<div className="space-y-4">
					<p className="m-0">
						集群 <Redaction width={8} animate /> 共 6 个地址，过去 3h 累计买入{" "}
						<Redaction width={7} animate delay={0.3} />。
					</p>
					<p className="m-0 font-mono text-sm">
						<RedactedLine line="09:12 ▲ OI +14.2% / 1h · ▇{5} · 资金费率 ▇{6}" />
					</p>
					<p className="m-0 text-[13px] text-bone-dim">
						鼠标悬停涂黑条会出现提示（读屏软件直接朗读「成员可见内容，已隐藏」，涂黑条不占用
						Tab 焦点）；DOM 中没有被隐藏的内容，只有宽度。
					</p>
				</div>
			</Block>

			<Block n={6} title="档案卡">
				<div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
					<CaseFile
						tab="立案 · IC-2026-0003"
						dashed
						stamp={<Stamp status="open" date="10.14 10:02" />}
					>
						<CaseFileHeader
							kicker="M-03 · 全链聪明钱雷达"
							title={
								<>
									做多 · <Redaction width={6} />
								</>
							}
						/>
						<Fields
							items={[
								{ label: "立案", value: "2026.10.14 10:02" },
								{ label: "链", value: "BASE" },
								{ label: "入场", value: <Redaction width={7} /> },
								{ label: "依据", value: <Redaction width={12} /> },
							]}
						/>
						<CaseFileFooter>
							<span>证据 · TG 时间戳</span>
							<span>档案 →</span>
						</CaseFileFooter>
					</CaseFile>

					<CaseFile
						tab="结案 · IC-2026-0001"
						stamp={<Stamp status="hit" date="10.13" />}
					>
						<CaseFileHeader
							kicker="M-04 · Hyperliquid 雷达"
							title="$HYPE 做多"
						/>
						<div className="my-4">
							<SignalChart
								series={HYPE}
								entry={{ index: 3, label: "入场 38.20" }}
								peak={{ index: 17, label: "峰值 +21.6%" }}
								exit={{ index: 21, label: "止盈" }}
								summary="$HYPE：10.11 入场 38.20，10.12 峰值 46.45（+21.6%），10.13 按目标价 45.23 止盈（+18.4%）。"
							/>
						</div>
						<Fields
							items={[
								{ label: "最大涨幅", value: <Pct value={21.6} /> },
								{ label: "最大回撤", value: <Pct value={-3.4} /> },
								{ label: "结案收益", value: <Pct value={18.4} /> },
								{ label: "持有", value: "2 天" },
							]}
						/>
					</CaseFile>

					<CaseFile
						tab="结案 · IC-2026-0002"
						stamp={<Stamp status="stopped" date="10.13" />}
					>
						<CaseFileHeader kicker="M-01 · OI 异动预警" title="$ARB 做多" />
						<div className="my-4">
							<SignalChart
								series={ARB}
								entry={{ index: 2, label: "入场" }}
								peak={{ index: 5, label: "峰值 +6.3%" }}
								exit={{ index: 17, label: "止损 0.3790" }}
								levels={[{ value: 0.379, kind: "stop" }]}
								summary="$ARB：10.10 入场 0.4120，最高 0.4380（+6.3%），10.13 触发止损 0.3790（−8.0%）。"
							/>
						</div>
						<Fields
							items={[
								{ label: "最大涨幅", value: <Pct value={6.3} /> },
								{ label: "最大回撤", value: <Pct value={-8} /> },
								{ label: "结案收益", value: <Pct value={-8} /> },
							]}
						/>
					</CaseFile>

					<CaseFile tab="作废 · IC-2026-0004" stamp={<Stamp status="void" />}>
						<CaseFileHeader kicker="M-02 · Coinbase 溢价" title="重复登记" />
						<p className="m-0 text-sm text-bone-dim">
							本档案已作废：与 IC-2026-0003 重复登记。编号保留，不计入统计。
						</p>
					</CaseFile>
				</div>
			</Block>

			<Block n={7} title="批注栏 · 分隔线">
				<div className="grid gap-12 lg:grid-cols-[112px_1fr]">
					<Marginalia
						items={[
							{ k: "FILE №", v: "IC-2026" },
							{ k: "§ 01", v: "档案封面" },
							{ k: "UTC+8", v: "2026.10.14" },
						]}
					/>
					<div>
						<SectionDivider n={5} title="最新台账" />
						<p className="m-0 text-sm text-bone-dim">
							批注栏在 lg 以下折叠为一行元信息；分隔线包含真正的 h2。
						</p>
					</div>
				</div>
			</Block>

			<Block n={8} title="窗格 · 工具箱">
				<PaneGrid>
					<Pane
						label="M-01 / DERIVATIVES"
						status="member"
						footer={
							<>
								<a className={paneLink} href="/ledger">
									关联台账 34 份 →
								</a>
								<a className={paneAction} href="/tools/oi-tracker">
									详情
								</a>
							</>
						}
					>
						<PaneTitle en="Elite OI Tracker" zh="OI 异动预警" />
						<PaneData
							items={[
								{ label: "数据源", value: "CoinGlass Pro API" },
								{ label: "频率", value: "5m / 15m" },
								{ label: "交付", value: "TG 成员频道" },
							]}
						/>
						<PaneFeed
							lines={["09:12 ▲ OI +14.2%/1h ▇{5}", "09:40 ▼ OI −9.1%/1h ▇{4}"]}
						/>
					</Pane>
					<Pane
						label="M-05 / SMART MONEY"
						status="beta"
						footer={
							<a className={paneAction} href="/tools/oi-tracker">
								详情
							</a>
						}
					>
						<PaneTitle en="HYPE Whale Watcher" zh="智能 HYPE 巨鲸监控" />
						<PaneData items={[{ label: "状态", value: "测试期" }]} />
						<PaneFeed lines={["巨鲸开多 ▇{6} BTC · 杠杆 ▇{3}"]} />
					</Pane>
					<Pane
						label="M-09 / MARKET"
						status="public"
						footer={
							<>
								<span className={paneLink}>关联台账 —</span>
								<a className={paneAction} href="/tools/oi-tracker">
									打开工具
								</a>
							</>
						}
					>
						<PaneTitle en="Public module (example)" zh="公开模块示例" />
						<p className="m-0 text-[11.5px] text-bone-dim">
							有 url 字段时显示「打开工具」。
						</p>
					</Pane>
					<Pane label="P-01 / DERIVATIVES" status="planned">
						<PaneTitle en="Funding Rate Board" zh="资金费率看板" />
					</Pane>
				</PaneGrid>
			</Block>

			<Block n={9} title="图表">
				<div className="flex flex-wrap items-center gap-10">
					<Sparkline values={HYPE} label="$HYPE 走势" tone="gain" />
					<Sparkline values={ARB} tone="loss" />
					<Pct value={18.4} className="text-2xl" />
					<Pct value={-8} className="text-2xl" />
					<Pct value={0} className="text-2xl" />
				</div>
			</Block>

			<Block n={10} title="风险提示">
				<div className="space-y-4">
					<RiskNote />
					<RiskNote variant="ledger" />
					<RiskNote variant="cases" />
				</div>
			</Block>

			<Block n={11} title="主理人档案照">
				<AgentPhoto />
			</Block>
		</main>
	);
}
