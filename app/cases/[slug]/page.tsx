import { MDXContent } from "@content-collections/mdx/react";
import { allCases } from "content-collections";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseFile } from "@/components/dossier/CaseFile";
import { Fields } from "@/components/dossier/Fields";
import { Arrow, ButtonLink } from "@/components/site/Button";
import { RiskNote } from "@/components/site/RiskNote";
import { moduleBySlug } from "@/lib/content";
import { formatDate } from "@/lib/format";
import {
	caseResultLabel,
	directionLabel,
	methodLabel,
} from "@/lib/i18n/labels";
import { label, wrap } from "@/lib/ui";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
	return allCases.map((c) => ({ slug: c.slug }));
}

const find = (slug: string) => allCases.find((c) => c.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const c = find((await params).slug);
	if (!c) return {};
	return {
		title: `${c.assets.join(" ")} ${directionLabel[c.direction]} · 精选案例`,
		description: `精选案例：「${c.titleOriginal}」— X，${formatDate(c.date)}。精选、非完整记录，收益为原帖最大涨幅口径。`,
	};
}

export default async function CasePage({ params }: Props) {
	const c = find((await params).slug);
	if (!c) notFound();
	const m = c.module ? moduleBySlug(c.module) : null;

	return (
		<main id="main" className={`${wrap} pt-10 md:pt-14`}>
			<nav aria-label="案例导航" className="mb-10 font-mono text-[13px]">
				<Link
					href="/cases"
					className="text-bone underline underline-offset-4 hover:text-stamp"
				>
					← 精选案例
				</Link>
			</nav>
			<div className="mx-auto max-w-[820px]">
				<CaseFile tab={`精选 · ${formatDate(c.date)}`}>
					<p className={label}>
						{methodLabel[c.method] ?? c.method}
						{m ? ` · ${m.code} ${m.nameZh}` : ""}
					</p>
					<h1 className="mt-2 mb-6 font-serif-zh text-[clamp(28px,4vw,44px)] leading-tight font-black tracking-[0.04em]">
						{c.assets.join(" ")} {directionLabel[c.direction]}
					</h1>
					<blockquote className="m-0 mb-8 border-l border-dossier pl-5">
						<p className="m-0 font-serif-zh text-lg">「{c.titleOriginal}」</p>
						<footer className="mt-2 font-mono text-[13px] text-bone-dim">
							— X，{formatDate(c.date)}
						</footer>
					</blockquote>
					<Fields
						items={[
							{ label: "原帖收益", value: c.claim?.value ?? "—" },
							{ label: "口径", value: "最大涨幅（原帖写法）" },
							{ label: "结果", value: caseResultLabel[c.result] },
							{
								label: "核验",
								value: c.verified ? (
									"已核验"
								) : (
									<span className="text-dossier">未核验</span>
								),
							},
						]}
					/>
					{c.claim?.value ? (
						<p className="mt-6 text-sm text-bone-dim">
							原帖收益 {c.claim.value}
							，为最大涨幅口径，未经统一核验，不计入台账统计。
						</p>
					) : null}
					{c.hasBody ? (
						<section className="mt-8 border-t border-dashed border-line pt-6">
							<h2 className="mb-4 font-mono text-[11px] tracking-[0.14em] text-dossier">
								逻辑复盘
							</h2>
							<div className="space-y-4 leading-relaxed text-bone-dim">
								<MDXContent code={c.mdx} />
							</div>
						</section>
					) : null}
					<p className="mt-8 border-t border-dashed border-line pt-5">
						<a
							href={c.xUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="font-mono text-[13px] text-bone underline underline-offset-4 hover:text-stamp"
						>
							在 X 查看原帖 <Arrow>↗</Arrow>
						</a>
					</p>
				</CaseFile>

				<section
					aria-label="关于精选案例"
					className="mt-12 rounded-file border border-line p-6 md:p-8"
				>
					<p className="m-0 font-serif-zh text-lg leading-relaxed">
						精选案例只是挑选过的片段。台账上线后，每一条信号都会公开登记、按规则结案，失败的也一样。
					</p>
					<div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
						<ButtonLink href="/ledger">
							查看完整台账 <Arrow />
						</ButtonLink>
						<ButtonLink href="/methodology" variant="link">
							阅读方法论 <Arrow />
						</ButtonLink>
					</div>
				</section>
				<RiskNote variant="cases" className="mt-10" />
				<RiskNote className="mt-3" />
			</div>
		</main>
	);
}
