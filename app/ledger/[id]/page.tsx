import { existsSync } from "node:fs";
import { join } from "node:path";
import { MDXContent } from "@content-collections/mdx/react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SignalChart } from "@/components/charts/SignalChart";
import { CaseFile } from "@/components/dossier/CaseFile";
import { Fields, Pct } from "@/components/dossier/Fields";
import { Redaction } from "@/components/dossier/Redaction";
import { Stamp } from "@/components/dossier/Stamp";
import { Arrow, ButtonLink } from "@/components/site/Button";
import { RiskNote } from "@/components/site/RiskNote";
import { moduleBySlug, type SignalDoc, signals } from "@/lib/content";
import {
	formatDate,
	formatDateTime,
	formatPct,
	formatPrice,
	holdingDays,
} from "@/lib/format";
import { directionLabel, statusLabel } from "@/lib/i18n/labels";
import { chartModel } from "@/lib/ledger/chart";
import { isClosed } from "@/lib/ledger/stats";
import { label, wrap } from "@/lib/ui";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
	return signals.map((s) => ({ id: s.id }));
}

const ascending = [...signals].reverse();
const find = (id: string) => signals.find((s) => s.id === id);
const CHAIN: Record<string, string> = {
	eth: "ETH",
	bsc: "BSC",
	base: "BASE",
	sol: "SOL",
	hyperliquid: "Hyperliquid",
	cex: "CEX",
	other: "其他",
};
const EVIDENCE: Record<string, string> = {
	tg: "TG 推送截图",
	tx: "链上交易",
	address: "地址",
	chart: "行情截图",
	x: "X 复盘",
};
const TWO_HOURS = 2 * 3_600_000;

function title(s: SignalDoc): string {
	if (s.status === "open") return `进行中档案 · ${directionLabel[s.direction]}`;
	return `${s.asset ?? "作废档案"} ${directionLabel[s.direction]}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const s = find((await params).id);
	if (!s) return {};
	const m = moduleBySlug(s.module);
	const result = isClosed(s)
		? `，结案收益 ${formatPct(s.closedReturnPct)}`
		: "";
	return {
		title: `${s.id} · ${title(s)}`,
		description: `${m?.nameZh ?? s.module} 模块于 ${formatDateTime(s.openedAt)} 立案，状态：${statusLabel[s.status]}${result}。`,
	};
}

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="mt-10 border-t border-dashed border-line pt-6">
			<h2 className="mb-4 font-mono text-[11px] tracking-[0.14em] text-dossier">
				{title}
			</h2>
			{children}
		</section>
	);
}

export default async function SignalPage({ params }: Props) {
	const { id } = await params;
	const s = find(id);
	if (!s) notFound();

	const m = moduleBySlug(s.module);
	const idx = ascending.findIndex((x) => x.id === s.id);
	const prev = ascending[idx - 1];
	const next = ascending[idx + 1];
	const late = Date.parse(s.registeredAt) - Date.parse(s.openedAt) > TWO_HOURS;
	const tab =
		s.status === "open" ? "立案" : s.status === "void" ? "作废" : "结案";
	const stampDate = isClosed(s)
		? formatDate(s.closedAt)
		: formatDate(s.openedAt);

	return (
		<main id="main" className={`${wrap} pt-10 md:pt-14`}>
			<nav
				aria-label="档案导航"
				className="mb-10 flex flex-wrap justify-between gap-3 font-mono text-[13px]"
			>
				<Link
					href="/ledger"
					className="text-bone underline underline-offset-4 hover:text-stamp"
				>
					← 信号台账
				</Link>
				<span className="flex gap-6">
					{prev ? (
						<Link
							href={`/ledger/${prev.id}`}
							className="text-bone-dim underline underline-offset-4 hover:text-bone"
						>
							上一份 {prev.id}
						</Link>
					) : null}
					{next ? (
						<Link
							href={`/ledger/${next.id}`}
							className="text-bone-dim underline underline-offset-4 hover:text-bone"
						>
							下一份 {next.id} <Arrow />
						</Link>
					) : null}
				</span>
			</nav>

			<div className="grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-12">
				<aside className="font-mono text-xs leading-relaxed tracking-[0.04em]">
					<dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 lg:grid-cols-1 lg:gap-y-5">
						{[
							["编号", s.id],
							["立案", formatDateTime(s.openedAt)],
							["登记", formatDateTime(s.registeredAt)],
							["链", s.chains.map((c) => CHAIN[c] ?? c).join(" · ")],
						].map(([k, v]) => (
							<div key={k} className="contents lg:block">
								<dt className="text-dossier">{k}</dt>
								<dd className="m-0 text-bone-dim">{v}</dd>
							</div>
						))}
						<div className="contents lg:block">
							<dt className="text-dossier">模块</dt>
							<dd className="m-0">
								<Link
									href={`/tools/${s.module}`}
									className="text-bone-dim underline underline-offset-4 hover:text-bone"
								>
									{m ? `${m.code} ${m.nameZh}` : s.module}
								</Link>
							</dd>
						</div>
					</dl>
					{late ? (
						<p className="mt-5 inline-block border border-dossier px-2 py-1 text-dossier">
							延迟登记（立案后{" "}
							{Math.round(
								(Date.parse(s.registeredAt) - Date.parse(s.openedAt)) /
									3_600_000,
							)}{" "}
							小时）
						</p>
					) : null}
				</aside>

				<div>
					<CaseFile
						tab={`${tab} · ${s.id}`}
						dashed={s.status === "open"}
						stamp={<Stamp status={s.status} size="lg" date={stampDate} />}
					>
						<p className={label}>{m ? `${m.code} · ${m.nameZh}` : s.module}</p>
						<h1 className="mt-2 mb-6 pr-36 font-serif-zh text-[clamp(28px,4vw,44px)] leading-tight font-black tracking-[0.04em]">
							{s.status === "open" ? (
								<>
									{directionLabel[s.direction]} · <Redaction width={6} />
								</>
							) : (
								title(s)
							)}
						</h1>

						{s.status === "open" ? (
							<>
								<Fields
									items={[
										{ label: "标的", value: <Redaction width={6} /> },
										{ label: "入场", value: <Redaction width={7} /> },
										{ label: "依据", value: <Redaction width={14} /> },
										{ label: "止损 / 目标", value: <Redaction width={11} /> },
									]}
								/>
								<p className="mt-6 text-sm leading-relaxed text-bone-dim">
									立案即登记，结案后 24 小时内公开全部字段。成员已于{" "}
									{formatDateTime(s.openedAt)} 在 TG 收到完整信号。{" "}
									<Link
										href="/join"
										className="text-bone underline underline-offset-4 hover:text-stamp"
									>
										申请加入 <Arrow />
									</Link>
								</p>
							</>
						) : null}

						{s.status === "void" ? (
							<p className="text-bone-dim">
								本档案已作废：{s.voidReason}。编号保留，不计入统计。
							</p>
						) : null}

						{isClosed(s) ? <ClosedBody s={s} /> : null}

						{s.changelog.length ? (
							<Section title="修改记录">
								<ol className="m-0 list-none space-y-2 p-0 text-sm text-bone-dim">
									{s.changelog.map((c) => (
										<li key={c.at}>
											<span className="font-mono text-bone">
												{formatDateTime(c.at)}
											</span>{" "}
											· {c.note}
										</li>
									))}
								</ol>
							</Section>
						) : null}
					</CaseFile>

					<section
						aria-label="关于台账"
						className="mt-12 rounded-file border border-line p-6 md:p-8"
					>
						<p className="m-0 font-serif-zh text-lg leading-relaxed">
							这是 0xInChain 台账中的第 {idx + 1}{" "}
							份档案。我们为每一条信号公开登记、按规则结案，失败的也一样。
						</p>
						<div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
							<ButtonLink href="/join">
								申请加入 <Arrow />
							</ButtonLink>
							<ButtonLink href="/ledger" variant="link">
								查看台账 <Arrow />
							</ButtonLink>
						</div>
					</section>
					<RiskNote variant="ledger" className="mt-10" />
					<RiskNote className="mt-3" />
				</div>
			</div>
		</main>
	);
}

function ClosedBody({
	s,
}: {
	s: SignalDoc & { status: "hit" | "invalidated" | "stopped" | "expired" };
}) {
	const model = chartModel(s);
	const levels = [
		...(s.stopLoss ? [{ value: s.stopLoss, kind: "stop" as const }] : []),
		...(s.targets ?? []).map((t) => ({ value: t, kind: "target" as const })),
	];
	const summary = `${s.asset}：${formatDateTime(s.openedAt)} 入场 ${formatPrice(s.entryPrice)}，持有期内最大涨幅 ${formatPct(s.mfePct)}、最大回撤 ${formatPct(s.maePct)}，${formatDateTime(s.closedAt)} ${statusLabel[s.status]}结案于 ${formatPrice(s.exitPrice)}（${formatPct(s.closedReturnPct)}）。`;
	const publicImage = (p?: string) =>
		p && existsSync(join(process.cwd(), "public", p)) ? p : null;

	return (
		<>
			<Fields
				items={[
					{ label: "入场", value: formatPrice(s.entryPrice) },
					...(s.targets?.length
						? [{ label: "目标", value: s.targets.map(formatPrice).join(" / ") }]
						: []),
					...(s.stopLoss
						? [{ label: "止损", value: formatPrice(s.stopLoss) }]
						: []),
					...(s.invalidation
						? [{ label: "失效条件", value: s.invalidation }]
						: []),
					{
						label: "结案",
						value: `${formatPrice(s.exitPrice)} · ${formatDateTime(s.closedAt)}`,
					},
					{ label: "持有", value: `${holdingDays(s.openedAt, s.closedAt)} 天` },
				]}
			/>

			<dl className="mt-8 grid grid-cols-3 gap-px border border-line bg-line">
				{[
					["最大涨幅", s.mfePct],
					["最大回撤", s.maePct],
					["结案收益", s.closedReturnPct],
				].map(([k, v]) => (
					<div key={k} className="bg-ink-1 px-3 py-4 md:px-5">
						<dt className="font-serif-zh text-sm text-bone-dim">{k}</dt>
						<dd className="m-0 mt-2">
							<Pct value={v as number} className="text-xl md:text-[28px]" />
						</dd>
					</div>
				))}
			</dl>

			<div className="mt-8">
				<SignalChart
					series={model.series}
					entry={{
						index: model.entry,
						label: `入场 ${formatPrice(s.entryPrice)}`,
					}}
					peak={{ index: model.peak, label: `峰值 ${formatPct(s.mfePct)}` }}
					exit={{
						index: model.exit,
						label: `${statusLabel[s.status]} ${formatPrice(s.exitPrice)}`,
					}}
					levels={levels}
					summary={summary}
					height={180}
					sketch={model.sparse}
				/>
				<p className="mt-3 font-mono text-xs text-bone-dim">
					{model.sparse
						? "仅关键价格示意（未获取到行情数据）"
						: `行情：${s.series?.source} · ${s.series?.interval} K 线收盘价`}
				</p>
			</div>

			{s.mdx ? (
				<Section title="依据与复盘">
					<div className="max-w-[40em] space-y-4 leading-relaxed [&_strong]:text-bone [&_strong]:font-medium text-bone-dim">
						<MDXContent code={s.mdx} />
					</div>
				</Section>
			) : null}

			<Section title="证据">
				<ul className="m-0 list-none space-y-2 p-0 text-sm">
					{s.evidence.map((e, i) => {
						const img = publicImage(e.image);
						const text = `${EVIDENCE[e.type]}${e.note ? ` · ${e.note}` : ""}`;
						return (
							// biome-ignore lint/suspicious/noArrayIndexKey: evidence has no stable id and never reorders
							<li key={i}>
								{e.url ? (
									<a
										href={e.url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-bone underline underline-offset-4 hover:text-stamp"
									>
										{text} <Arrow>↗</Arrow>
									</a>
								) : img ? (
									<a
										href={img}
										target="_blank"
										rel="noopener noreferrer"
										className="text-bone underline underline-offset-4 hover:text-stamp"
									>
										{text} <Arrow>↗</Arrow>
									</a>
								) : (
									<span className="text-bone-dim">{text}（截图待上传）</span>
								)}
							</li>
						);
					})}
					{s.xUrl ? (
						<li>
							<a
								href={s.xUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-bone underline underline-offset-4 hover:text-stamp"
							>
								X 复盘 <Arrow>↗</Arrow>
							</a>
						</li>
					) : null}
				</ul>
			</Section>
		</>
	);
}
