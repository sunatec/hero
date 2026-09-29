import type { ReactNode } from "react";
import { label, wrap } from "@/lib/ui";

/** Index / Article page head: label → serif H1 → short intro, optional meta on the right. */
export function PageHeader({
	kicker,
	title,
	intro,
	aside,
	children,
}: {
	kicker: string;
	title: string;
	intro?: ReactNode;
	aside?: ReactNode;
	/** Rendered under the head inside the same container (e.g. second-level tabs). */
	children?: ReactNode;
}) {
	return (
		<header className={`${wrap} pt-11 md:pt-18`}>
			<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8">
				<div>
					<p className={label}>{kicker}</p>
					<h1 className="mt-3 font-serif-zh text-[clamp(40px,6vw,72px)] leading-[1.1] font-black tracking-[0.04em]">
						{title}
					</h1>
					{intro ? (
						<p className="mt-4 max-w-[34em] text-bone-dim">{intro}</p>
					) : null}
				</div>
				{aside ? (
					<div className="font-mono text-[13px] text-bone-dim md:text-right">
						{aside}
					</div>
				) : null}
			</div>
			{children ?? <div className="mb-14" />}
		</header>
	);
}
