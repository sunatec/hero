import type { Metadata } from "next";
import Link from "next/link";
import { Pct } from "@/components/dossier/Fields";
import { Arrow, ButtonLink } from "@/components/site/Button";
import { coveredChains, ledgerStart, stats } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { label, section, wrap } from "@/lib/ui";
import { site } from "@/site.config";

export const metadata: Metadata = {
	title: { absolute: "0xInChain · On-chain Intelligence Bureau" },
	description:
		"An on-chain intelligence bureau for traders — we track where capital moves, and keep a public ledger of every call.",
	alternates: { languages: { "zh-CN": "/", en: "/en" } },
};

/** Copy: docs/copy/home.en.md. Brand front door only — the room itself is Chinese-speaking. */
const WATCH = [
	"Smart-money wallet clusters",
	"exchange whales",
	"derivatives OI shifts",
	"the Coinbase premium",
	"Hyperliquid size",
	"KOL wallets",
	"DCA flows",
];

const STEPS = [
	[
		"Collect",
		"Derivatives data via the CoinGlass Pro API, on-chain activity across BSC, BASE, ETH and SOL, Hyperliquid order flow, Jupiter DCA orders.",
	],
	[
		"Clean",
		"Our own filters strip wash trading and cluster related wallets into single entities, keeping only positioning that means something.",
	],
	[
		"Judge",
		"Signals are cross-checked — OI, institutional premium, smart-money flow — and reviewed by a human before anything is sent.",
	],
	[
		"Push",
		"Timestamped alerts to the members' Telegram channel, with the thesis, invalidation and risk spelled out.",
	],
	[
		"Log",
		"Every trade signal is logged to the public ledger within two hours and closed by pre-set rules. Losses included.",
	],
] as const;

function Heading({ n, title, id }: { n: number; title: string; id: string }) {
	return (
		<div className="mb-10 flex items-center gap-4">
			<h2 id={id} className="m-0 flex items-baseline gap-2.5 whitespace-nowrap">
				<span className="font-mono text-xs tracking-[0.12em] text-dossier">
					§ {String(n).padStart(2, "0")}
				</span>
				<span className="font-latin text-lg text-bone italic">{title}</span>
			</h2>
			<span aria-hidden="true" className="h-px flex-1 bg-line" />
		</div>
	);
}

export default function EnHomePage() {
	const cells: [string, number][] = [
		["Logged", stats.registered],
		["Hit", stats.counts.hit],
		["Invalidated", stats.counts.invalidated],
		["Stopped", stats.counts.stopped],
		["Expired", stats.counts.expired],
		["Open", stats.counts.open],
	];
	return (
		<main id="main">
			<section
				aria-labelledby="en-hero"
				className={`${wrap} pt-12 pb-20 md:pt-20 md:pb-28`}
			>
				<p className={`${label} mb-6`}>
					FILE № IC-2026 — On-chain Intelligence Bureau
				</p>
				<h1
					id="en-hero"
					className="font-latin text-[clamp(56px,9vw,120px)] leading-none font-medium tracking-[-0.01em]"
				>
					0xInChain
				</h1>
				<div
					aria-hidden="true"
					className="mt-6 mb-4 h-px max-w-[640px] bg-bone/80"
				/>
				<p className="mb-8 font-latin text-[22px] text-bone-dim italic md:text-[26px]">
					On-chain Intelligence Bureau · <span lang="zh-CN">{site.nameZh}</span>
				</p>
				<p className="mb-5 max-w-[28em] text-[clamp(18px,1.6vw,22px)] leading-[1.6]">
					We track where capital moves on-chain — and keep a{" "}
					<em className="text-stamp not-italic">public ledger</em> of every call
					we make.
				</p>
				<p className="mb-10 font-mono text-[13px] text-bone-dim">
					Ledger since{" "}
					<b className="font-medium text-bone">
						{ledgerStart ? formatDate(ledgerStart) : "launch"}
					</b>{" "}
					· <b className="font-medium text-bone">{stats.registered}</b> entries
					{coveredChains.length ? ` · ${coveredChains.join(" / ")}` : ""}
				</p>
				<div className="flex flex-wrap items-center gap-x-7 gap-y-3">
					<ButtonLink
						href={site.social.x}
						external
						className="max-md:w-full max-md:justify-center"
					>
						Follow on X <Arrow>↗</Arrow>
					</ButtonLink>
					<ButtonLink href="/ledger" variant="link">
						Read the ledger (in Chinese) <Arrow />
					</ButtonLink>
				</div>
			</section>

			<section aria-labelledby="en-proof" className={`${wrap} ${section}`}>
				<Heading n={2} title="Evidence" id="en-proof" />
				<ul className="grid grid-cols-2 border-y border-line md:grid-cols-6">
					{cells.map(([k, v], i) => (
						<li
							key={k}
							className={`flex flex-col gap-3 border-line px-4 pt-5 pb-[18px] md:px-5 ${i % 2 ? "border-l" : ""} ${i >= 2 ? "border-t md:border-t-0" : ""} ${i ? "md:border-l" : "md:border-l-0"}`}
						>
							<span className="font-mono text-[32px] leading-none font-medium tabular-nums md:text-[40px]">
								{v}
							</span>
							<span className="font-latin text-base text-bone-dim italic">
								{k}
							</span>
						</li>
					))}
				</ul>
				<p className="mt-4 font-mono text-[13px] text-bone-dim">
					{stats.smallSample ? (
						`${stats.closed} closed so far — small sample, read the numbers with care.`
					) : (
						<>
							Median closed return{" "}
							{stats.medianReturn === null ? (
								"—"
							) : (
								<Pct value={stats.medianReturn} />
							)}{" "}
							· Avg. holding {stats.avgHoldingDays} days
						</>
					)}
				</p>
			</section>

			<section aria-labelledby="en-watch" className={`${wrap} ${section}`}>
				<Heading n={3} title="What we watch" id="en-watch" />
				<p className="m-0 max-w-[26em] font-latin text-[clamp(26px,3.2vw,40px)] leading-[1.35]">
					{WATCH.join(" · ")} —{" "}
					<span className="text-stamp">
						and anything on-chain that doesn't look normal.
					</span>
				</p>
			</section>

			<section aria-labelledby="en-how" className={`${wrap} ${section}`}>
				<Heading n={4} title="How intel is made" id="en-how" />
				<ol className="grid gap-px border border-line bg-line md:grid-cols-5">
					{STEPS.map(([title, body], i) => {
						const last = i === STEPS.length - 1;
						return (
							<li
								key={title}
								className={`bg-ink-0 p-5 md:p-6 ${last ? "md:bg-ink-1" : ""}`}
							>
								<p
									className={`font-mono text-xs ${last ? "text-stamp" : "text-dossier"}`}
								>
									{String(i + 1).padStart(2, "0")}
								</p>
								<h3
									className={`mt-2 mb-3 font-latin text-2xl ${last ? "text-stamp" : ""}`}
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
			</section>

			<section aria-labelledby="en-room" className={`${wrap} ${section}`}>
				<Heading n={5} title="The room" id="en-room" />
				<div className="rounded-file border border-line bg-ink-1 p-6 md:p-8">
					<p className="m-0 max-w-[36em] text-lg leading-relaxed">
						0xInChain runs a paid Telegram intelligence room for active traders.{" "}
						<b className="font-medium">It is Chinese-speaking only for now.</b>{" "}
						If you read Chinese, the full site is one click away.
					</p>
					<div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
						<ButtonLink href={site.social.x} external>
							Follow on X <Arrow>↗</Arrow>
						</ButtonLink>
						<Link
							href="/"
							lang="zh-CN"
							className="font-mono text-[13px] text-bone underline underline-offset-4 hover:text-stamp"
						>
							中文站 <Arrow />
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
