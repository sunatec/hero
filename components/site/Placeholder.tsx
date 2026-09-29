import Link from "next/link";
import type { ReactNode } from "react";

/** M3 scaffold only: every route renders this until its milestone replaces it. */
export function Placeholder({
	route,
	title,
	milestone,
	children,
}: {
	route: string;
	title: string;
	milestone: string;
	children?: ReactNode;
}) {
	return (
		<main id="main" className="mx-auto max-w-[1280px] px-5 py-16 md:px-12">
			<p className="font-mono text-[11px] tracking-[0.14em] text-dossier uppercase">
				{route} · 占位页 · 由 {milestone} 实现
			</p>
			<h1 className="mt-3 font-serif-zh text-5xl font-black tracking-wide">
				{title}
			</h1>
			{children ? (
				<div className="mt-8 space-y-2 font-mono text-sm text-bone-dim">
					{children}
				</div>
			) : null}
			<nav className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm">
				<Link
					className="underline underline-offset-4 hover:text-stamp"
					href="/"
				>
					首页
				</Link>
				<Link
					className="underline underline-offset-4 hover:text-stamp"
					href="/ledger"
				>
					信号台账
				</Link>
				<Link
					className="underline underline-offset-4 hover:text-stamp"
					href="/tools"
				>
					链上工具箱
				</Link>
				<Link
					className="underline underline-offset-4 hover:text-stamp"
					href="/join"
				>
					申请加入
				</Link>
			</nav>
		</main>
	);
}
