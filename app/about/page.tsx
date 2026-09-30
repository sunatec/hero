import { MDXContent } from "@content-collections/mdx/react";
import type { Metadata } from "next";
import Link from "next/link";
import { AgentPhoto } from "@/components/dossier/AgentPhoto";
import { SectionDivider } from "@/components/dossier/SectionDivider";
import { Arrow } from "@/components/site/Button";
import { PageHeader } from "@/components/site/PageHeader";
import { agent, ledgerStart } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { section, wrap } from "@/lib/ui";
import { site, TBD } from "@/site.config";

export const metadata: Metadata = pageMeta({
	title: "主理人档案",
	description: "谁在负责链上情报局，以及为什么要公开每一条信号。",
	path: "/about",
	languages: { "zh-CN": "/about", en: "/en/about" },
});

const PENDING = "待补充";
const pending = (v?: string) =>
	!v || v === PENDING ? <span className="text-dossier">{PENDING}</span> : v;

/** Earliest date from real data: the oldest recap collected from Notion (tweet 1989000014677570002). */
const TIMELINE: [string, string][] = [
	["2025.11", "Notion 收录的最早一条公开推文（「25 年做空」）"],
	[PENDING, "情报局成立，第一批 20 位成员"],
	[PENDING, "第一批满员，开放第二批"],
	[
		ledgerStart ? formatDate(ledgerStart) : PENDING,
		"官网上线，公开台账开始登记",
	],
];

const DATA = [
	"CoinGlass Pro API（$699/月，每分钟 1200 次调用）",
	"BSC / BASE / ETH / SOL 四链的自有数据解析与清洗",
	"自建地址标签库（聪明钱、巨鲸、KOL、地址集群）",
	"Hyperliquid 公开订单流解析",
	"Jupiter DCA 订单解析",
];

export default function AboutPage() {
	const a = agent;
	return (
		<main id="main">
			<PageHeader kicker="主理人档案 · Agent File" title="谁在负责链上情报局" />

			<section aria-label="档案" className={`${wrap} ${section}`}>
				<div className="grid items-start gap-10 md:grid-cols-[auto_1fr] md:gap-16">
					<AgentPhoto src={a?.photo || undefined} size={200} />
					<dl className="grid max-w-[560px] grid-cols-[5em_1fr] gap-x-6 gap-y-3 font-mono text-[15px]">
						{(
							[
								["代号", pending(a?.codename)],
								["入行", pending(a?.since)],
								["专长", pending(a?.focus.join(" · "))],
								["风格", pending(a?.style)],
								[
									"X",
									<a
										key="x"
										href={site.social.x}
										target="_blank"
										rel="noopener noreferrer"
										className="text-bone tap underline underline-offset-4 hover:text-stamp"
									>
										{a?.handle ?? "@0xInChain"} <Arrow>↗</Arrow>
									</a>,
								],
							] as const
						).map(([k, v]) => (
							<div key={k} className="contents">
								<dt className="text-dossier">{k}</dt>
								<dd className="m-0">{v}</dd>
							</div>
						))}
					</dl>
				</div>
			</section>

			<section aria-labelledby="a1" className={`${wrap} ${section}`}>
				<SectionDivider n={1} title="为什么创建链上情报局" id="a1" />
				<div className="max-w-[36em] space-y-5 font-serif-zh text-lg leading-[1.9]">
					{a?.mdx ? (
						<MDXContent code={a.mdx} />
					) : (
						<p className="text-dossier">{PENDING}</p>
					)}
				</div>
			</section>

			<section aria-labelledby="a2" className={`${wrap} ${section}`}>
				<SectionDivider n={2} title="情报局大事记" id="a2" />
				<ol className="m-0 max-w-[680px] list-none border-l border-dossier p-0">
					{TIMELINE.map(([when, what]) => (
						<li
							key={what}
							className="relative grid gap-1 py-4 pl-6 md:grid-cols-[8em_1fr] md:gap-4"
						>
							<span
								aria-hidden="true"
								className="absolute top-[26px] -left-[5px] size-[9px] rounded-full border-2 border-dossier bg-ink-0"
							/>
							<span
								className={`font-mono ${when === PENDING ? "text-dossier" : "text-bone"}`}
							>
								{when}
							</span>
							<span className="text-bone-dim">{what}</span>
						</li>
					))}
				</ol>
			</section>

			<section aria-labelledby="a3" className={`${wrap} ${section}`}>
				<SectionDivider n={3} title="数据投入" id="a3" />
				<ul className="m-0 max-w-[40em] list-none space-y-3 p-0">
					{DATA.map((d) => (
						<li key={d} className="flex gap-3">
							<span aria-hidden="true" className="font-mono text-dossier">
								—
							</span>
							{d}
						</li>
					))}
				</ul>
				<p className="mt-6 max-w-[40em] text-bone-dim">
					为什么列出这些：数据从哪里来，和数据说了什么一样重要。
				</p>
			</section>

			<section aria-labelledby="a4" className={`${wrap} ${section}`}>
				<SectionDivider n={4} title="官方账号" id="a4" />
				<ul className="m-0 max-w-[40em] list-none border-t border-line p-0 font-mono text-[15px]">
					{site.officialChannels.map((c) => (
						<li
							key={c.handle}
							className="grid grid-cols-[7em_1fr] gap-4 border-b border-line py-4 md:grid-cols-[7em_14em_1fr]"
						>
							<span className="text-dossier">
								{c.type === "x" ? "X" : "Telegram"}
							</span>
							<span>{c.handle}</span>
							<span className="text-bone-dim max-md:col-start-2">
								{c.role}
								{c.numericId === TBD ? "" : ` · ID ${c.numericId}`}
							</span>
						</li>
					))}
				</ul>
				<p className="mt-6">
					<Link
						href="/verify"
						className="font-mono text-[13px] text-bone tap underline underline-offset-4 hover:text-stamp"
					>
						官方渠道验证 <Arrow />
					</Link>
				</p>
			</section>
		</main>
	);
}
