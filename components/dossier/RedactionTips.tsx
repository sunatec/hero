"use client";

import { useEffect } from "react";

const TIP_WIDTH = 190;

/**
 * Touch screens have no hover: a tap on a redaction bar toggles its tip (WEBSITE_PLAN §17).
 * The bar stays non-focusable (§18); a tip near the right edge is right-aligned so it never
 * widens the page. Mounted once in the root layout.
 */
export function RedactionTips() {
	useEffect(() => {
		const closeAll = (except?: Element) => {
			for (const el of document.querySelectorAll("[data-tip][data-open]")) {
				if (el !== except) el.removeAttribute("data-open");
			}
		};
		const onPointerUp = (e: PointerEvent) => {
			if (e.pointerType === "mouse") return;
			const bar = (e.target as Element | null)?.closest?.("[data-tip]");
			closeAll(bar ?? undefined);
			if (!bar) return;
			if (bar.hasAttribute("data-open")) {
				bar.removeAttribute("data-open");
				return;
			}
			const r = bar.getBoundingClientRect();
			bar.toggleAttribute(
				"data-end",
				r.left + TIP_WIDTH > window.innerWidth - 8,
			);
			bar.setAttribute("data-open", "");
		};
		const onScroll = () => closeAll();
		document.addEventListener("pointerup", onPointerUp);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			document.removeEventListener("pointerup", onPointerUp);
			window.removeEventListener("scroll", onScroll);
		};
	}, []);
	return null;
}
