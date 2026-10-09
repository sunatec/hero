import type { Metadata } from "next";
import Link from "next/link";
import { RedactedLine } from "@/components/dossier/Redaction";
import { SectionDivider } from "@/components/dossier/SectionDivider";
import { FitCheck } from "@/components/home/Sections";
import { Arrow, ButtonLink } from "@/components/site/Button";
import { PageHeader } from "@/components/site/PageHeader";
import { RiskNote } from "@/components/site/RiskNote";
import { pageMeta } from "@/lib/seo";
import { section, wrap } from "@/lib/ui";
import { site } from "@/site.config";

export const metadata: Metadata = pageMeta({
	title: "社群介绍",
	description:
		"一个只服务中文实战交易者的付费链上情报室：你会得到什么、如何交付、适合谁、有哪些规则。",
	path: "/community",
});

/** Copy: docs/copy/community.md. 待补充 marks facts still missing (docs/open-items.md). */
const PENDING = "待补充";

const BENEFITS = [
	{
		title: "私密情报频道",
		body: (
			<>
				8 个监控模块的实时推送：OI 异动、Coinbase 溢价、四链聪明钱、Hyperliquid
				大单等。每个模块的数据源与局限都写在
				<Link
					href="/tools"
					className="text-bone tap underline underline-offset-4 hover:text-stamp"
				>
					链上工具箱
				</Link>
				里。
			</>
		),
	},
	{
		title: "主理人操作同步",
		body: (
			<>
				信号触发后，主理人会同步自己的实际操作——建仓、加仓、分批止盈、止损——并写明依据。
				<b className="font-medium text-bone">这是参考，不是跟单指令。</b>
			</>
		),
	},
	{
		title: "专属币种监控",
		body: "你可以指定一个重点关注的币种，出现主力异动、巨鲸大单或跨链资金异常时单独提醒你。每人限一个。",
	},
	{
		title: "币种链上分析申请",
		body: "对某个币看不清筹码分布时，可以申请一次深度分析：大户成本区、聪明钱均价、关键地址动向。",
	},
	{
		title: "内部直播",
		body: "本批满员后开始，内容包括链上数据解读、地址追踪方法、实战复盘与风控纪律。仅对在期成员开放，禁止录屏和外传。",
	},
];

const DAY = [
	["09:12", "OI 异动预警", "▇{4} 1 小时 OI +14.2%，现货同步放量"],
	["11:40", "全链聪明钱雷达", "BASE 链一个 6 地址集群分批买入 ▇{6}"],
	["14:30", "Coinbase 溢价", "BTC 溢价转正，美盘买盘回暖"],
	["21:05", "主理人操作同步", "▇{5} 建仓 1/3，失效条件：▇{8}"],
] as const;

const RULES = [
	["周期", "季度 · 半年 · 年付"],
	[
		"计价",
		`以 ${site.pricing.currency} 计价。价格会根据 ${site.pricing.currency} 价格、社群阶段、剩余名额和系统迭代成本调整，以管理员付款前的最终确认为准。参考价见「申请加入」页。`,
	],
	[
		"限流",
		`每天最多审核 ${site.batch.reviewPerDay} 位新成员。情报的价值依赖于它不被大规模转发：如果地址信息被聚合群搬运，主力会弃用这些地址，信号也就失效了。限流也便于在发生转发时定位来源。`,
	],
	[
		"不设试用",
		"情报一经查看即被「消费」，无法收回，所以我们不提供试用或体验名额。",
	],
	[
		"不退款",
		"同样的原因，付款入群后不支持退款。请在付款前充分了解方法论、台账和风险披露。",
	],
	[
		"禁止转发",
		"成员不得截图转发、搬运、转售频道内容。违反者将被移出且不退款。",
	],
	["仅限中文", "目前只有中文社群，因此只接受能使用中文交流的成员。"],
] as const;

const FAQ = [
	[
		"数据从哪里来？",
		"衍生品数据来自 CoinGlass Pro API；链上数据来自我们对 BSC、BASE、ETH、SOL 四链的自有解析；另外还有 Hyperliquid 公开订单流和 Jupiter DCA 订单。每个模块的来源都写在工具箱里。",
	],
	[
		"信号多久一条？",
		"取决于市场。我们不为了保持活跃而凑数，台账记录了每一条信号的时间，你可以自己统计频率。",
	],
	["我能只订阅某一个模块吗？", "目前不能，成员资格包含全部模块。"],
	[
		"台账上的收益是真实收益吗？",
		"台账按预设的结案规则计算，不含手续费与滑点，不代表任何成员的实际收益。具体口径见方法论。",
	],
	[
		"为什么失败的信号也要公开？",
		"只展示成功案例的战绩没有参考价值。完整记录才能让你判断这套系统适不适合你。",
	],
	[
		"怎么确认联系我的是官方？",
		"只认「官方渠道验证」页列出的账号。除了回复你的申请，管理员不会主动私信你，也不会向你索要私钥、助记词或验证码。",
	],
	["续费怎么算？", PENDING],
	[`可以用 ${site.pricing.currency} 以外的币种付款吗？`, PENDING],
] as const;

export default function CommunityPage() {
	return (
		<main id="main">
			<PageHeader
				kicker="社群介绍 · The Room"
				title="一间只服务中文实战交易者的付费链上情报室"
				intro="我们不追逐碎片化的喊单，也不依赖单一消息源。我们关心的是：巨鲸在建仓还是撤退，交易所持仓有没有异常，聪明钱是否在提前潜伏，价格波动背后有没有真实资金推动。"
			/>

			<section aria-labelledby="c1" className={`${wrap} ${section}`}>
				<SectionDivider n={1} title="你会得到什么" id="c1" />
				<ol className="m-0 list-none border-t border-line p-0">
					{BENEFITS.map((b, i) => (
						<li
							key={b.title}
							className="grid gap-2 border-b border-line py-6 md:grid-cols-[4em_14em_1fr] md:gap-6"
						>
							<span className="font-mono text-dossier">
								{String(i + 1).padStart(2, "0")}
							</span>
							<h3 className="m-0 font-serif-zh text-xl font-bold">{b.title}</h3>
							<p className="m-0 max-w-[40em] leading-relaxed text-bone-dim">
								{b.body}
							</p>
						</li>
					))}
				</ol>
			</section>

			<section aria-labelledby="c2" className={`${wrap} ${section}`}>
				<SectionDivider n={2} title="交付方式" id="c2" />
				<p className="mb-8 max-w-[40em] text-bone-dim">
					成员频道（TG
					私密频道）接收全部模块推送；成员群用于讨论和提问。下面是一天的节奏示例，涂黑部分只对成员可见。
				</p>
				<ol className="m-0 max-w-[760px] list-none border-l border-dossier p-0">
					{DAY.map(([time, mod, line]) => (
						<li
							key={time}
							className="relative grid gap-1 py-4 pl-6 md:grid-cols-[5em_10em_1fr] md:gap-4"
						>
							<span
								aria-hidden="true"
								className="absolute top-[26px] -left-[5px] size-[9px] rounded-full border-2 border-dossier bg-ink-0"
							/>
							<span className="font-mono text-bone">{time}</span>
							<span className="font-serif-zh font-bold">{mod}</span>
							<span className="font-mono text-sm text-bone-dim">
								<RedactedLine line={line} />
							</span>
						</li>
					))}
				</ol>
				<p className="mt-4 font-mono text-xs text-bone-dim">
					示例时间线，推送内容已脱敏
				</p>
			</section>

			<FitCheck n={3} />

			<section aria-labelledby="c4" className={`${wrap} ${section}`}>
				<SectionDivider n={4} title="规则" id="c4" />
				<dl className="m-0 border-t border-line">
					{RULES.map(([k, v]) => (
						<div
							key={k}
							className="grid gap-2 border-b border-line py-5 md:grid-cols-[10em_1fr] md:gap-6"
						>
							<dt className="font-serif-zh font-bold">{k}</dt>
							<dd className="m-0 max-w-[44em] leading-relaxed text-bone-dim">
								{v}
							</dd>
						</div>
					))}
				</dl>
			</section>

			<section aria-labelledby="c5" className={`${wrap} ${section}`}>
				<SectionDivider n={5} title="常见问题" id="c5" />
				<div className="border-t border-line">
					{FAQ.map(([q, a]) => (
						<details key={q} className="group border-b border-line">
							<summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-serif-zh text-lg font-bold [&::-webkit-details-marker]:hidden">
								{q}
								<span
									aria-hidden="true"
									className="font-mono text-dossier transition-transform group-open:rotate-45"
								>
									+
								</span>
							</summary>
							<p
								className={`m-0 max-w-[44em] pb-5 leading-relaxed ${a === PENDING ? "text-dossier" : "text-bone-dim"}`}
							>
								{a}
							</p>
						</details>
					))}
				</div>
			</section>

			<section aria-label="申请加入" className={`${wrap} ${section}`}>
				<div className="rounded-file border border-line bg-ink-1 p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
					<p className="m-0 font-serif-zh text-xl leading-relaxed">
						{site.batch.name} · {site.batch.seats} 席 · 每日审核{" "}
						{site.batch.reviewPerDay} 位
					</p>
					<ButtonLink
						href="/join"
						className="mt-5 max-md:w-full max-md:justify-center md:mt-0"
					>
						申请加入 <Arrow />
					</ButtonLink>
				</div>
				<RiskNote className="mt-10" />
			</section>
		</main>
	);
}
