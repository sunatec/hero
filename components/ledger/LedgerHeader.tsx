import Link from "next/link";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/site/PageHeader";

const TABS = [
	{ href: "/ledger", label: "台账" },
	{ href: "/cases", label: "精选案例" },
	{ href: "/methodology", label: "方法论" },
] as const;

/** PageHeader + the 社群战绩 second-level tabs (docs/ia/README.md §1). */
export function LedgerHeader({
	current,
	...head
}: {
	kicker: string;
	title: string;
	intro: ReactNode;
	aside?: ReactNode;
	current: (typeof TABS)[number]["href"];
}) {
	return (
		<PageHeader {...head}>
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
		</PageHeader>
	);
}
