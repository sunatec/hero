import type { Metadata } from "next";
import Link from "next/link";
import { AgentPhoto } from "@/components/dossier/AgentPhoto";
import { Arrow } from "@/components/site/Button";
import { agent } from "@/lib/content";
import { label, section, wrap } from "@/lib/ui";
import { site, TBD } from "@/site.config";

export const metadata: Metadata = {
	title: { absolute: "Who runs the bureau · 0xInChain" },
	description:
		"The operator behind 0xInChain, the data we pay for, and our official accounts.",
	alternates: { languages: { "zh-CN": "/about", en: "/en/about" } },
};

const PENDING = "To be added";
/** Agent fields are authored in Chinese; placeholders read 待补充 until the operator provides them. */
const val = (v?: string) =>
	!v || v === "待补充" ? (
		<span className="text-dossier">{PENDING}</span>
	) : (
		<span lang="zh-CN">{v}</span>
	);

export default function EnAboutPage() {
	const a = agent;
	return (
		<main id="main">
			<header className={`${wrap} pt-11 pb-14 md:pt-18`}>
				<p className={label}>Agent file</p>
				<h1 className="mt-3 font-latin text-[clamp(40px,6vw,72px)] leading-[1.1] font-medium">
					Who runs the bureau
				</h1>
			</header>

			<section aria-label="Agent" className={`${wrap} ${section}`}>
				<div className="grid items-start gap-10 md:grid-cols-[auto_1fr] md:gap-16">
					<AgentPhoto
						src={a?.photo || undefined}
						alt="Agent ID photo"
						size={200}
					/>
					<div>
						<dl className="grid max-w-[560px] grid-cols-[6em_1fr] gap-x-6 gap-y-3 font-mono text-[15px]">
							{(
								[
									["Codename", val(a?.codename)],
									["Since", val(a?.since)],
									["Focus", val(a?.focus.join(" · "))],
									["Style", val(a?.style)],
								] as const
							).map(([k, v]) => (
								<div key={k} className="contents">
									<dt className="text-dossier">{k}</dt>
									<dd className="m-0">{v}</dd>
								</div>
							))}
						</dl>
						<blockquote className="mt-10 max-w-[34em] border-l border-dossier pl-5 font-latin text-xl leading-relaxed italic">
							“I trade with the same system I share. Putting every call into a
							public ledger is how I ask you to judge it, instead of trusting
							it.”
						</blockquote>
					</div>
				</div>
			</section>

			<section aria-labelledby="en-data" className={`${wrap} ${section}`}>
				<h2 id="en-data" className="mb-6 font-latin text-2xl italic">
					Data we pay for
				</h2>
				<p className="max-w-[36em] leading-relaxed text-bone-dim">
					The CoinGlass Pro API, our own indexing of BSC, BASE, ETH and SOL, a
					hand-built wallet label set, and parsers for Hyperliquid order flow
					and Jupiter DCA orders. We list our sources because where data comes
					from matters as much as what it says.
				</p>
			</section>

			<section aria-labelledby="en-accounts" className={`${wrap} ${section}`}>
				<h2 id="en-accounts" className="mb-6 font-latin text-2xl italic">
					Official accounts
				</h2>
				<ul className="m-0 max-w-[40em] list-none border-t border-line p-0 font-mono text-[15px]">
					{site.officialChannels.map((c) => (
						<li
							key={c.handle}
							className="grid grid-cols-[7em_1fr] gap-4 border-b border-line py-4"
						>
							<span className="text-dossier">
								{c.type === "x" ? "X" : "Telegram"}
							</span>
							<span>
								{c.handle}
								{c.numericId === TBD ? "" : ` · ID ${c.numericId}`}
							</span>
						</li>
					))}
				</ul>
				<p className="mt-6 max-w-[36em] text-sm text-bone-dim">
					Apart from replying to an application, admins will never DM you first.{" "}
					<Link
						href="/verify"
						lang="zh-CN"
						className="text-bone underline underline-offset-4 hover:text-stamp"
					>
						官方渠道验证 <Arrow />
					</Link>
				</p>
			</section>
		</main>
	);
}
