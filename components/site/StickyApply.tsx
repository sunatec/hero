"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { showApplyCta } from "@/lib/nav";
import { site } from "@/site.config";
import { Arrow, ButtonLink } from "./Button";

/** Mobile-only bar that appears after the first screen (docs/ia/README.md §2). */
export function StickyApply() {
	const pathname = usePathname();
	const [shown, setShown] = useState(false);

	useEffect(() => {
		const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	if (!showApplyCta(pathname) || pathname.startsWith("/en")) return null;

	return (
		<div
			data-sticky-apply
			aria-hidden={!shown}
			inert={!shown}
			className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-line bg-ink-0/96 px-5 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] transition-transform duration-250 ease-[var(--ease-out-dossier)] md:hidden ${
				shown ? "translate-y-0" : "translate-y-[110%]"
			}`}
		>
			<span className="font-mono text-[13px] text-bone-dim">
				{site.batch.name} · 每日审核 {site.batch.reviewPerDay} 位
			</span>
			<ButtonLink href="/join" size="bar">
				申请加入 <Arrow />
			</ButtonLink>
		</div>
	);
}
