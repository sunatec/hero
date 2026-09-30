import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { JoinForm } from "@/components/join/JoinForm";
import { PageHeader } from "@/components/site/PageHeader";
import { runningModules } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { label, wrap } from "@/lib/ui";
import { site, TBD } from "@/site.config";

const INTRO = "申请制。提交后，官方管理员会通过 TG 联系你，确认方案与价格。";

export const metadata: Metadata = pageMeta({
	title: "申请加入",
	description: INTRO,
	path: "/join",
});

const tg = site.officialChannels.find((c) => c.type === "telegram");
const tgHandle = tg?.handle ?? "";

function Block({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="border-t border-line pt-6">
			<h2 className={`${label} mb-4`}>{title}</h2>
			{children}
		</section>
	);
}

const link = "text-bone tap underline underline-offset-4 hover:text-stamp";

/** Copy: docs/copy/join.md. Prices and batch come from site.config — never hard-coded. */
export default function JoinPage() {
	const { batch, pricing } = site;
	const full = batch.status === "full";
	return (
		<main id="main">
			<PageHeader kicker="申请加入 · Apply" title="申请加入" intro={INTRO} />
			<div
				className={`${wrap} grid gap-14 pb-20 md:pb-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20`}
			>
				<aside className="flex flex-col gap-10" aria-label="申请须知">
					<Block title="流程">
						<ol className="m-0 flex list-none flex-col gap-4 p-0">
							{[
								["提交申请", "填写简短问卷，约 2 分钟"],
								[
									"官方联系",
									<>
										管理员通过 <b className="font-medium">{tgHandle}</b>{" "}
										联系你。请先在
										<Link href="/verify" className={`${link} mx-0.5`}>
											官方渠道验证
										</Link>
										页核对账号
									</>,
								],
								["确认方案", "选择季度、半年或年付，确认最终价格"],
								["付款入群", "付款后加入成员频道与成员群"],
							].map(([t, d], i) => (
								<li
									key={String(t)}
									className="grid grid-cols-[2.2em_1fr] gap-x-2"
								>
									<span className="font-mono text-dossier">
										{String(i + 1).padStart(2, "0")}
									</span>
									<span>
										<b className="font-medium">{t}</b>
										<span className="mt-1 block text-[15px] text-bone-dim">
											{d}
										</span>
									</span>
								</li>
							))}
						</ol>
					</Block>

					<Block title="参考价">
						<ul className="m-0 flex list-none flex-col p-0 font-mono">
							{pricing.plans.map((p) => (
								<li
									key={p.period}
									className="flex items-baseline justify-between border-b border-line py-3"
								>
									<span className="font-sans">{p.label}</span>
									{p.from === TBD ? (
										<span className="text-dossier">待补充</span>
									) : (
										<span>
											{p.from} {pricing.currency}{" "}
											<span className="text-bone-dim">起</span>
										</span>
									)}
								</li>
							))}
						</ul>
						<p className="mt-3 mb-0 text-sm text-bone-dim">
							以 {pricing.currency} 计价，会根据 {pricing.currency}{" "}
							价格、社群阶段与系统投入调整，以管理员付款前的最终确认为准。
						</p>
					</Block>

					<Block title="名额">
						<p className="m-0 font-mono text-[15px]">
							{batch.name} · {batch.seats} 席 · 每日审核 {batch.reviewPerDay} 位
						</p>
						{full ? (
							<p className="mt-3 mb-0 text-sm text-bone-dim">
								本批已满。你仍然可以提交申请，我们会在下一批开放时按提交顺序联系你。
							</p>
						) : null}
					</Block>

					<Block title="规则">
						<p className="m-0 text-[15px]">
							不设试用 · 售出后不退款 · 禁止转发与转售 →{" "}
							<Link href="/legal/terms" className={link}>
								服务条款
							</Link>
						</p>
					</Block>

					<div
						role="note"
						className="rounded-file border border-stamp/60 bg-ink-1 p-5 text-[15px] leading-relaxed"
					>
						<p className={`${label} mb-2 text-stamp`}>防骗</p>
						付款前，请在
						<Link href="/verify" className={`${link} mx-0.5`}>
							官方渠道验证
						</Link>
						页核对联系你的账号{site.paymentAddresses.length ? "和收款地址" : ""}
						。除了回复你的申请，管理员不会主动私信你，也不会向你索要私钥、助记词或验证码。
					</div>
				</aside>

				<section aria-label="申请表">
					<JoinForm
						modules={runningModules.map((m) => ({
							slug: m.slug,
							label: m.nameZh,
						}))}
						waitlist={full}
						siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined}
						tgHandle={tgHandle}
					/>
				</section>
			</div>
		</main>
	);
}
