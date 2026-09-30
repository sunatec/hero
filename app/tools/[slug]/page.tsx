import { MDXContent } from "@content-collections/mdx/react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { RedactedLine } from "@/components/dossier/Redaction";
import { LedgerList } from "@/components/ledger/LedgerList";
import { StatusDot } from "@/components/pane/Pane";
import { Arrow, ButtonLink } from "@/components/site/Button";
import { RiskNote } from "@/components/site/RiskNote";
import { chainsText } from "@/components/tools/ToolPane";
import { ledgerByModule, modules, toToolRow } from "@/lib/content";
import { categoryLabel } from "@/lib/i18n/labels";
import { accessFor } from "@/lib/tools";
import { wrap } from "@/lib/ui";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
	return modules.map((m) => ({ slug: m.slug }));
}

const find = (slug: string) => modules.find((m) => m.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const m = find((await params).slug);
	return m ? { title: `${m.nameZh} · 链上工具箱`, description: m.tagline } : {};
}

/** Detail pane: title bar + body, same hairline system as the toolbox grid. */
function Panel({
	n,
	title,
	id,
	children,
	className = "",
}: {
	n: number;
	title: string;
	id: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<section
			aria-labelledby={id}
			className={`flex flex-col bg-ink-0 ${className}`}
		>
			<header className="flex h-[34px] items-center gap-3 border-b border-line bg-ink-1 px-4 font-data text-[10.5px] tracking-[0.06em]">
				<span className="text-dossier">{String(n).padStart(2, "0")}</span>
				<h2
					id={id}
					className="m-0 font-sans text-[13px] font-medium tracking-normal"
				>
					{title}
				</h2>
			</header>
			<div className="flex-1 px-5 py-5 leading-relaxed md:px-6">{children}</div>
		</section>
	);
}

/** Module detail (WEBSITE_PLAN §10.3; copy: docs/copy/tools-research.md). */
export default async function ModulePage({ params }: Props) {
	const m = find((await params).slug);
	if (!m) notFound();
	const t = toToolRow(m);
	const planned = m.status === "planned";
	const recent = ledgerByModule(m.slug).slice(0, 5);
	const access = accessFor(t);
	let n = 0;

	return (
		<main id="main" className={`${wrap} pt-10 pb-20 md:pt-14 md:pb-32`}>
			<nav
				aria-label="模块导航"
				className="mb-10 flex flex-wrap items-center justify-between gap-3 font-data text-[11px] tracking-[0.06em]"
			>
				<Link
					href="/tools"
					className="text-bone underline underline-offset-4 hover:text-stamp"
				>
					← 链上工具箱
				</Link>
				<span className="flex items-center gap-3">
					<span className="text-dossier">
						{m.code} / {categoryLabel[m.category].code}
					</span>
					<StatusDot status={m.status} />
				</span>
			</nav>
			<header className="mb-12">
				<h1 className="font-serif-zh text-[clamp(36px,5.5vw,64px)] leading-[1.1] font-black tracking-[0.04em]">
					{m.nameZh}
				</h1>
				<p className="mt-3 font-data text-sm text-bone-dim">{m.nameEn}</p>
				<p className="mt-5 max-w-[34em] text-lg">{m.tagline}</p>
			</header>

			<div className="grid gap-px border border-line bg-line md:grid-cols-2">
				<Panel
					n={++n}
					title="它是什么"
					id="p-what"
					className={m.why ? "" : "md:col-span-2"}
				>
					<div className="space-y-4 [&_p]:m-0">
						<MDXContent code={m.mdx} />
					</div>
				</Panel>
				{m.why ? (
					<Panel n={++n} title="为什么重要" id="p-why">
						<p className="m-0">{m.why}</p>
					</Panel>
				) : null}
				{planned ? null : (
					<>
						<Panel n={++n} title="数据源与方法" id="p-data">
							<dl className="m-0 grid grid-cols-[4em_1fr] gap-x-4 gap-y-3 text-[15px]">
								{(
									[
										["数据源", m.sources.join(" · ") || "—"],
										["覆盖", chainsText(m.chains)],
										["频率", m.frequency ?? "—"],
										["交付", m.delivery ?? "—"],
									] as const
								).map(([k, v]) => (
									<div key={k} className="contents">
										<dt className="font-data text-[12px] leading-[1.9] text-dossier">
											{k}
										</dt>
										<dd className="m-0">{v}</dd>
									</div>
								))}
							</dl>
						</Panel>
						<Panel n={++n} title="推送样例" id="p-samples">
							<div className="border-l-2 border-line bg-redact px-4 py-3 font-data text-[12px] leading-[2] text-bone-dim">
								{m.samples.map((s) =>
									s.lines.map((line) => (
										<p key={line} className="m-0">
											<RedactedLine line={line} subtle />
										</p>
									)),
								)}
							</div>
							<p className="mt-3 mb-0 font-data text-[11px] text-bone-dim">
								涂黑部分只对成员可见
							</p>
						</Panel>
						<Panel
							n={++n}
							title="局限性"
							id="p-limits"
							className="md:col-span-2"
						>
							<ul className="m-0 grid list-none gap-2 p-0 md:grid-cols-2 md:gap-x-10">
								{(m.limitations ?? []).map((l) => (
									<li key={l} className="flex gap-3">
										<span aria-hidden="true" className="font-data text-dossier">
											—
										</span>
										{l}
									</li>
								))}
							</ul>
						</Panel>
						<Panel
							n={++n}
							title="关联台账"
							id="p-ledger"
							className="md:col-span-2"
						>
							{recent.length ? (
								<>
									<LedgerList
										items={recent}
										caption={`${m.nameZh} 最近的档案`}
									/>
									<p className="mt-5 mb-0 font-mono text-[13px]">
										<Link
											href={`/ledger?module=${m.slug}`}
											className="text-bone underline underline-offset-4 hover:text-stamp"
										>
											查看该模块的全部档案（{t.ledgerCount}）<Arrow />
										</Link>
									</p>
								</>
							) : (
								<p className="m-0 text-bone-dim">这个模块还没有登记的档案。</p>
							)}
						</Panel>
					</>
				)}
				<Panel n={++n} title="如何获得" id="p-access" className="md:col-span-2">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<p className="m-0">{access.text}</p>
						{access.cta ? (
							<ButtonLink
								href={access.cta.href}
								external={access.cta.external}
								size="sm"
							>
								{access.cta.label}{" "}
								<Arrow>{access.cta.external ? "↗" : "→"}</Arrow>
							</ButtonLink>
						) : null}
					</div>
				</Panel>
			</div>
			<RiskNote className="mt-12" />
		</main>
	);
}
