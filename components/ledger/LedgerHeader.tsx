import Link from "next/link";
import type { ReactNode } from "react";
import { label, wrap } from "@/lib/ui";

const TABS = [
	{ href: "/ledger", label: "台账" },
	{ href: "/cases", label: "精选案例" },
	{ href: "/methodology", label: "方法论" },
] as const;

/** Index-Dossier page head + the 社群战绩 second-level tabs (docs/ia/README.md §1). */
export function LedgerHeader({
	kicker,
	title,
	intro,
	aside,
	current,
}: {
	kicker: string;
	title: string;
	intro: ReactNode;
	aside?: ReactNode;
	current: (typeof TABS)[number]["href"];
}) {
	return (
		<header className={`${wrap} pt-11 md:pt-18`}>
			<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8">
				<div>
					<p className={label}>{kicker}</p>
					<h1 className="mt-3 font-serif-zh text-[clamp(44px,6vw,72px)] leading-[1.05] font-black tracking-[0.04em]">
						{title}
					</h1>
					<p className="mt-4 max-w-[34em] text-bone-dim">{intro}</p>
				</div>
				{aside ? (
					<div className="font-mono text-[13px] text-bone-dim md:text-right">
						{aside}
					</div>
				) : null}
			</div>
			<nav aria-label="社群战绩" className="mt-10 mb-8 border-b border-line">
				<ul className="-mb-px flex gap-6">
					{TABS.map((t) => (
						<li key={t.href}>
							<Link
								href={t.href}
								aria-current={t.href === current ? "page" : undefined}
								className="inline-block border-b-2 border-transparent py-3 font-serif-zh text-base font-bold tracking-[0.06em] text-bone-dim hover:text-bone aria-[current=page]:border-stamp aria-[current=page]:text-bone"
							>
								{t.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</header>
	);
}
